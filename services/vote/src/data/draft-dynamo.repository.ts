import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
import { Draft, DraftAnswersForQuestion, IDraftRepository } from '../domains';

import {
	GetCommandInput,
	GetCommand,
	PutCommandInput,
	PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DraftAnswersForQuestionDynamoRepository } from './draft-answers-for-question-dynamo.repository';

interface DraftDataModel {
	PK: string | null | undefined;
	SK?: string;
	HasBeenSubmitted: boolean;
}

export class DraftDynamoDBMapper extends DatabaseMapper<Draft, DraftDataModel> {
	toDomain(dataModel: DraftDataModel): Draft {
		const generalVotingStatus = new Draft({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			startDate: dataModel.PK.split('#')[5],
			endDate: dataModel.PK.split('#')[7],
			voterEmail: dataModel.SK.split('#')[1],
			hasBeenSubmitted: dataModel.HasBeenSubmitted,
		});
		return generalVotingStatus;
	}
	fromDomain(domainModel: Draft): DraftDataModel {
		const data: DraftDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#START#${domainModel.startDate}#END#${domainModel.endDate}`,
			SK: `VOTER#${domainModel.voterEmail}#GENERAL`,
			HasBeenSubmitted: domainModel.hasBeenSubmitted,
		};
		return data;
	}
}

export class DraftDynamoRepository
	extends DynamoDBRepository<Draft, DraftDataModel>
	implements IDraftRepository
{
	constructor(
		protected readonly draftAnswersForQuestionDynamodbRepository: DraftAnswersForQuestionDynamoRepository,
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DraftDynamoDBMapper,
	) {
		super(config, mapper);
	}

	async getDraftAnswers(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<DraftAnswersForQuestion[]> {
		const data =
			await this.draftAnswersForQuestionDynamodbRepository.getDraftAnswers(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);
		return data;
	}
	async putDraftAnswersForQuestion(
		draftAnswers: DraftAnswersForQuestion,
	): Promise<void> {
		await this.draftAnswersForQuestionDynamodbRepository.putDraftAnswersForQuestion(
			draftAnswers,
		);
	}
	async getDraftInformation(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<Draft | null> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
				SK: `VOTER#${voterEmail}#GENERAL`,
			},
		};
		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));
		if (Item) {
			const draftInformationObject = this.mapper.toDomain(
				Item as DraftDataModel,
			);
			return draftInformationObject;
		}
		return null;
	}
	async putDraftInformation(newDraftObject: Draft): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(newDraftObject);
			const params: PutCommandInput = {
				TableName: this.config.tableName,
				Item: dataModel as any,
			};
			await this.dynamoDBDocClient.send(new PutCommand(params));
		} catch (error) {
			throw new UnknownException(error);
		}
	}
}
