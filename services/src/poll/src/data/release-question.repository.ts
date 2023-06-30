import {
	BatchWriteCommand,
	BatchWriteCommandInput,
	QueryCommand,
	QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { DatabaseMapper, DynamoDBRepository } from '@libs/common';
import { QUESTION_TYPE } from '../constants';
import { Question, IReleasedQuestionRepository } from '../domains';
import * as ramda from 'ramda';

export interface ReleasedQuestionDataModel {
	PK: string | null | undefined;
	SK?: string | null | undefined;
	Content: string | null | undefined;
	QuestionType: QUESTION_TYPE | null | undefined;
	IsRequired: boolean;
	Answers: string[];
}

export class ReleasedQuestionDynamoDBMapper extends DatabaseMapper<
	Question,
	ReleasedQuestionDataModel
> {
	toDomain(dataModel: ReleasedQuestionDataModel): Question {
		const question = new Question({
			pollId: dataModel.PK.split('#')[1],
			answers: dataModel.Answers,
			content: dataModel.Content,
			isRequired: dataModel.IsRequired,
			questionType: dataModel.QuestionType,
			questionId: dataModel.SK.split('#')[3],
		});

		return question;
	}
	fromDomain(
		domainModel: Question,
		version: string,
	): ReleasedQuestionDataModel {
		const versionQuestionDataModel: ReleasedQuestionDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `VERSION#${version}#QUEST#${domainModel.questionId}`,
			Content: domainModel.content,
			Answers: domainModel.answers,
			QuestionType: domainModel.questionType,
			IsRequired: domainModel.isRequired,
		};
		return versionQuestionDataModel;
	}
}

export class ReleasedQuestionDynamoRepository
	extends DynamoDBRepository<Question, ReleasedQuestionDataModel>
	implements IReleasedQuestionRepository
{
	async packageQuestionsWithReleasedPoll(
		questions: Question[],
		version: string,
	): Promise<void> {
		const allQuestionsDataSegments = ramda.splitEvery(25, questions);

		const numberOfBatchQueries = Math.ceil(questions.length / 25);

		for (let i = 0; i < numberOfBatchQueries; i++) {
			const questionsSegment = allQuestionsDataSegments[i];

			const params: BatchWriteCommandInput = {
				RequestItems: {
					[this.config.tableName]: questionsSegment.map((question) => {
						return {
							PutRequest: {
								Item: this.mapper.fromDomain(question, version),
							},
						};
					}),
				},
			};

			const { UnprocessedItems } = await this.dynamoDBDocClient.send(
				new BatchWriteCommand(params),
			);

			let unprocessedItems = UnprocessedItems;

			while (
				unprocessedItems &&
				unprocessedItems[this.config.tableName]?.length > 0
			) {
				const retryUnprocessedItemsResult = await this.dynamoDBDocClient.send(
					new BatchWriteCommand({ RequestItems: unprocessedItems }),
				);

				unprocessedItems = retryUnprocessedItemsResult.UnprocessedItems;
			}
		}
	}

	async getAllQuestionsOfLatestRelease(
		pollId: string,
		latestVersion: string,
	): Promise<Question[] | null> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue and begins_with(SK, :sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}`,
				':sortKeyValue': `VERSION#${latestVersion}`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items?.length) {
			return Items.map((element) => {
				return this.mapper.toDomain(element as ReleasedQuestionDataModel);
			});
		}

		return null;
	}
}
