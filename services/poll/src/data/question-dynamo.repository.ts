import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { IQuestionRepository, Question } from '../domains';
import { DynamoDBRepository, DatabaseMapper } from '@libs/common';
import { QUESTIONTYPE } from '../constants';

interface QuestionDataModel {
	PK: string | null | undefined;
	SK?: string;
	Content: string | null | undefined;
	QuestionType: QUESTIONTYPE | null | undefined;
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

			KeyConditionExpression: `PK = :partitionKeyval and begins_with(SK, :sortKeyVal)`,
			ExpressionAttributeValues: {
				':partitionKeyval': `POLL#${pollId}`,
				':sortKeyVal': `QUES`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items.length) {
			const listQuestion = Items.map((element) => {
				return this.mapper.toDomain(element as QuestionDataModel);
			});

			return listQuestion;
		}
		return [];
	}
}
