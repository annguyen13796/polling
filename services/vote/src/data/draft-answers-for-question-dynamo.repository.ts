import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
import {
	DraftAnswersForQuestion,
	GeneralVotingStatusOfUser,
	IDraftAnswersForQuestionRepository,
} from '../domains';

import {
	QueryCommand,
	QueryCommandInput,
	PutCommand,
	PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { GeneralVotingStatusOfUserDynamoRepository } from './general-voting-status-of-user-dynamo.repository';

interface DraftAnswersDataModel {
	PK: string | null | undefined;
	SK?: string;
	Question: string | null;
	Answers: string[] | null;
}

export class DraftAnswersForQuestionDynamoDBMapper extends DatabaseMapper<
	DraftAnswersForQuestion,
	DraftAnswersDataModel
> {
	toDomain(dataModel: DraftAnswersDataModel): DraftAnswersForQuestion {
		const draftAnswersForQuestion = new DraftAnswersForQuestion({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			pollRecurrence: dataModel.PK.split('#')[5],
			voterEmail: dataModel.SK.split('#')[1],
			questionId: dataModel.SK.split('#')[3],
			question: dataModel.Question,
			answers: dataModel.Answers,
		});
		return draftAnswersForQuestion;
	}
	fromDomain(domainModel: DraftAnswersForQuestion): DraftAnswersDataModel {
		const data: DraftAnswersDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#RECURRENCE#${domainModel.pollRecurrence}`,
			SK: `VOTER#${domainModel.voterEmail}#QUES#${domainModel.questionId}`,
			Question: domainModel.question,
			Answers: domainModel.answers,
		};
		return data;
	}
}

export class DraftAnswersForQuestionDynamoRepository
	extends DynamoDBRepository<DraftAnswersForQuestion, DraftAnswersDataModel>
	implements IDraftAnswersForQuestionRepository
{
	constructor(
		protected readonly generalVotingStatusOfUserRepository: GeneralVotingStatusOfUserDynamoRepository,
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DraftAnswersForQuestionDynamoDBMapper,
	) {
		super(config, mapper);
	}
	async getDraftAnswersForUser(
		pollId: string,
		pollVersion: string,
		recurrence: string,
		voterEmail: string,
	): Promise<DraftAnswersForQuestion[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue AND begins_with(SK,:sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}#VERSION#${pollVersion}#RECURRENCE#${recurrence}`,
				':sortKeyValue': `VOTER#${voterEmail}#QUES`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);
		if (Items && Items.length) {
			const draftAnswersForUser = Items.map((element) => {
				return this.mapper.toDomain(element as DraftAnswersDataModel);
			});
			return draftAnswersForUser;
		}
		return [];
	}
	async putDraftAnswersForQuestion(
		draftAnswers: DraftAnswersForQuestion,
	): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(draftAnswers);
			const params: PutCommandInput = {
				TableName: this.config.tableName,
				Item: dataModel as any,
			};
			await this.dynamoDBDocClient.send(new PutCommand(params));
		} catch (error) {
			throw new UnknownException(error);
		}
	}

	async getGeneralVotingStatusOfUser(
		pollId: string,
		pollVersion: string,
		recurrence: string,
		voterEmail: string,
	): Promise<GeneralVotingStatusOfUser | null> {
		return this.generalVotingStatusOfUserRepository.getGeneralVotingStatusOfUser(
			pollId,
			pollVersion,
			recurrence,
			voterEmail,
		);
	}

	async putGeneralVotingStatusOfUser(
		newGeneralVotingStatusOfUserObj: GeneralVotingStatusOfUser,
	): Promise<void> {
		await this.generalVotingStatusOfUserRepository.putGeneralVotingStatusOfUser(
			newGeneralVotingStatusOfUserObj,
		);
	}
}
