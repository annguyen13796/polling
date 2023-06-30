import {
	DatabaseMapper,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
import {
	CurrentAnswersForQuestion,
	ICurrentAnswersForQuestionRepository,
} from '../domains';

import {
	QueryCommand,
	QueryCommandInput,
	PutCommand,
	PutCommandInput,
} from '@aws-sdk/lib-dynamodb';

interface CurrentAnswersForQuestionDataModel {
	PK: string | null | undefined;
	SK?: string;
	Question: string | null;
	Answers: string[] | null;
}

export class CurrentAnswersForQuestionDynamoDBMapper extends DatabaseMapper<
	CurrentAnswersForQuestion,
	CurrentAnswersForQuestionDataModel
> {
	toDomain(
		dataModel: CurrentAnswersForQuestionDataModel,
	): CurrentAnswersForQuestion {
		const currentAnswersForQuestion = new CurrentAnswersForQuestion({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			startDate: dataModel.PK.split('#')[5],
			endDate: dataModel.PK.split('#')[7],
			voterEmail: dataModel.SK.split('#')[1],
			questionId: dataModel.SK.split('#')[3],
			question: dataModel.Question,
			answers: dataModel.Answers,
		});
		return currentAnswersForQuestion;
	}
	fromDomain(
		domainModel: CurrentAnswersForQuestion,
	): CurrentAnswersForQuestionDataModel {
		const data: CurrentAnswersForQuestionDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#START#${domainModel.startDate}#END#${domainModel.endDate}`,
			SK: `VOTER#${domainModel.voterEmail}#QUES#${domainModel.questionId}`,
			Question: domainModel.question,
			Answers: domainModel.answers,
		};
		return data;
	}
}

export class CurrentAnswersForQuestionDynamoRepository
	extends DynamoDBRepository<
		CurrentAnswersForQuestion,
		CurrentAnswersForQuestionDataModel
	>
	implements ICurrentAnswersForQuestionRepository
{
	async getCurrentAnswersForDraft(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<CurrentAnswersForQuestion[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue AND begins_with(SK,:sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
				':sortKeyValue': `VOTER#${voterEmail}#QUES`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);
		if (Items && Items.length) {
			const draftAnswersForUser = Items.map((element) => {
				return this.mapper.toDomain(
					element as CurrentAnswersForQuestionDataModel,
				);
			});
			return draftAnswersForUser;
		}
		return [];
	}

	async putCurrentAnswersForQuestion(
		draftAnswers: CurrentAnswersForQuestion,
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
}
