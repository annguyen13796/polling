import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { IQuestionRepository, Question } from '../domains';
import { DynamoDBRepository, DatabaseMapper } from '@libs/common';
import { QUESTION_TYPE } from '../constants';
import {
	DeleteItemCommand,
	DeleteItemCommandInput,
	UpdateItemCommand,
	UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';

interface QuestionDataModel {
	PK: string | null | undefined;
	SK?: string;
	Content: string | null | undefined;
	QuestionType: QUESTION_TYPE | null | undefined;
	IsRequired: boolean;
	Answers: string[];
}
export class QuestionDynamoDBMapper extends DatabaseMapper<
	Question,
	QuestionDataModel
> {
	toDomain(dataModel: QuestionDataModel): Question {
		const question = new Question({
			pollId: dataModel.PK.split('#')[1],
			questionId: dataModel.SK.split('#')[1],
			content: dataModel.Content,
			questionType: dataModel.QuestionType,
			isRequired: dataModel.IsRequired,
			answers: dataModel.Answers,
		});
		return question;
	}
	fromDomain(domainModel: Question): QuestionDataModel {
		const data: QuestionDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `QUES#${domainModel.questionId}`,
			Content: domainModel.content,
			QuestionType: domainModel.questionType,
			IsRequired: domainModel.isRequired,
			Answers: domainModel.answers,
		};
		return data;
	}
}

export class QuestionDynamoRepository
	extends DynamoDBRepository<Question, QuestionDataModel>
	implements IQuestionRepository
{
	async getQuestionsByPollId(pollId: string): Promise<Question[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,

			KeyConditionExpression: `PK = :partitionKeyValue and begins_with(SK, :sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}`,
				':sortKeyValue': `QUES`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items && Items.length) {
			const listQuestion = Items.map((element) => {
				return this.mapper.toDomain(element as QuestionDataModel);
			});

			return listQuestion;
		}
		return [];
	}
	async getQuestionByPollIdAndQuestionId(
		pollId: string,
		questionId: string,
	): Promise<Question> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,

			KeyConditionExpression: `PK = :partitionKeyValue and SK = :sortKeyValue`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}`,
				':sortKeyValue': `QUES#${questionId}`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items.length) {
			return this.mapper.toDomain(Items[0] as QuestionDataModel);
		}
		return null;
	}
	async updateQuestionGeneralInformation(
		modifiedQuestion: Question,
	): Promise<void> {
		const parsedAnswersToDynamodbFormat = modifiedQuestion.answers.map(
			(element) => {
				// eslint-disable-next-line no-unused-labels
				return { S: element };
			},
		);

		const params: UpdateItemCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: { S: `POLL#${modifiedQuestion.pollId}` },
				SK: { S: `QUES#${modifiedQuestion.questionId}` },
			},
			UpdateExpression: `SET Content= :content , QuestionType= :questionType , IsRequired= :isRequired ,Answers= :answers `,
			ExpressionAttributeValues: {
				':content': { S: modifiedQuestion.content },
				':questionType': { S: modifiedQuestion.questionType },
				':isRequired': { BOOL: modifiedQuestion.isRequired },
				':answers': { L: parsedAnswersToDynamodbFormat },
			},
		};
		await this.dynamoDBDocClient.send(new UpdateItemCommand(params));
	}
	async deleteQuestionById(
		pollId: string,
		questionId: string,
	): Promise<boolean> {
		const params: DeleteItemCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: { S: `POLL#${pollId}` },
				SK: { S: `QUES#${questionId}` },
			},
			ReturnValues: 'ALL_OLD',
		};

		const { Attributes } = await this.dynamoDBDocClient.send(
			new DeleteItemCommand(params),
		);
		if (Attributes) {
			const deletedQuestionId = Attributes.SK.S.split('#')[1];
			if (questionId === deletedQuestionId) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}
}
