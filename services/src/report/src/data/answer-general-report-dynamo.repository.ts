import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';

import {
	BatchWriteCommand,
	BatchWriteCommandInput,
	GetCommand,
	GetCommandInput,
	QueryCommand,
	QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import {
	AnswerReport,
	IAnswerGeneralReportRepository,
	VoterReport,
} from '../domains';
import { VoterReportDynamoRepository } from './voter-report-dynamo.repository';
import { QUESTION_TYPE } from '../constants';

interface AnswerReportDataModel {
	PK: string | null | undefined;
	SK?: string;
	NumberOfVoter: number;
	Question: string;
	QuestionType: QUESTION_TYPE;
}

export class AnswerGeneralReportDynamoDBMapper extends DatabaseMapper<
	AnswerReport,
	AnswerReportDataModel
> {
	toDomain(dataModel: AnswerReportDataModel): AnswerReport {
		const answerGeneralReport = new AnswerReport({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			startDate: dataModel.PK.split('#')[5],
			endDate: dataModel.PK.split('#')[7],
			questionId: dataModel.SK.split('#')[3],
			answer: dataModel.SK.split('#')[5],
			question: dataModel.Question,
			numberOfVoter: dataModel.NumberOfVoter,
			questionType: dataModel.QuestionType,
		});
		return answerGeneralReport;
	}
	fromDomain(domainModel: AnswerReport): AnswerReportDataModel {
		const data: AnswerReportDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#START#${domainModel.startDate}#END#${domainModel.endDate}`,
			SK: `#GENERAL#QUES#${domainModel.questionId}#ANSWER#${domainModel.answer}`,
			Question: domainModel.question,
			NumberOfVoter: domainModel.numberOfVoter,
			QuestionType: domainModel.questionType,
		};
		return data;
	}
}

export interface QueryCommandReturnType<T> {
	lastEvaluatedKey: Record<string, any> | null;
	data: T[];
}
export class AnswerGeneralReportDynamoRepository
	extends DynamoDBRepository<AnswerReport, AnswerReportDataModel>
	implements IAnswerGeneralReportRepository
{
	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<
			AnswerReport,
			AnswerReportDataModel
		>,
		protected readonly voterReportRepository: VoterReportDynamoRepository,
	) {
		super(config, mapper);
	}

	async createVoterReports(newVoterReports: VoterReport[]): Promise<void> {
		await this.voterReportRepository.putVoterReports(newVoterReports);
	}

	async getVotersOfSpecificAnswer(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null> {
		const voterReports = await this.voterReportRepository.getVoterReports(
			pollId,
			pollVersion,
			startDate,
			endDate,
			questionId,
			answer,
		);

		if (voterReports) {
			return voterReports;
		}

		return null;
	}

	async getAnswerReport(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
				SK: `#GENERAL#QUES#${questionId}#ANSWER#${answer}`,
			},
		};

		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));

		if (Item) {
			const answerReport = this.mapper.toDomain(Item as AnswerReportDataModel);

			return answerReport;
		}

		return null;
	}

	async getAnswerReports(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue AND begins_with(SK,:sortKeyPattern)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
				':sortKeyPattern': `#GENERAL`,
			},
		};
		if (startItem) {
			if (startItem.SK) {
				params.ExclusiveStartKey = { PK: startItem.PK, SK: startItem.SK };
			} else {
				params.ExclusiveStartKey = { PK: startItem.PK };
			}
		}
		const { Items, LastEvaluatedKey } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items && Items.length) {
			const answerReports = Items.map((element) => {
				return this.mapper.toDomain(element as AnswerReportDataModel);
			});

			return {
				lastEvaluatedKey: LastEvaluatedKey,
				data: answerReports,
			};
		}
		return {
			lastEvaluatedKey: null,
			data: null,
		};
	}

	async putAnswerReports(answerReports: AnswerReport[]): Promise<void> {
		while (answerReports.length > 0) {
			// TODO: Magic Number
			const lastPosition =
				answerReports.length < 25 ? answerReports.length : 25;
			const singleBatchRequest = answerReports
				.splice(0, lastPosition)
				.map((answerReport) => this.mapper.fromDomain(answerReport))
				.map((answerRecord) => ({
					PutRequest: {
						Item: answerRecord,
					},
				}));
			let params: BatchWriteCommandInput = {
				RequestItems: {
					[this.config.tableName]: singleBatchRequest,
				},
			};

			let keepBatchingCurrentRequest = true;
			let batchingTime = 0;

			// TODO: Magic Number
			while (keepBatchingCurrentRequest && batchingTime < 3) {
				const { UnprocessedItems } = await this.dynamoDBDocClient.send(
					new BatchWriteCommand(params),
				);

				if (Object.keys(UnprocessedItems).length !== 0) {
					params = {
						RequestItems: {
							[this.config.tableName]: UnprocessedItems.report,
						},
					};
				} else {
					keepBatchingCurrentRequest = false;
					break;
				}

				batchingTime++;
				if (batchingTime === 3) {
					throw new UnknownException(
						'something wrong in the batch write, please try again later',
					);
				}
			}
		}
	}
}
