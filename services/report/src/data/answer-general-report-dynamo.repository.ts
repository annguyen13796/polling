import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
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

interface AnswerReportDataModel {
	PK: string | null | undefined;
	SK?: string;
	NumberOfVoter: number;
	Question: string;
}

export class AnswerGeneralReportDynamoDBMapper extends DatabaseMapper<
	AnswerReport,
	AnswerReportDataModel
> {
	toDomain(dataModel: AnswerReportDataModel): AnswerReport {
		const answerGeneralReport = new AnswerReport({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			pollRecurrence: dataModel.PK.split('#')[5],
			questionId: dataModel.SK.split('#')[3],
			answer: dataModel.SK.split('#')[5],
			question: dataModel.Question,
			numberOfVoter: dataModel.NumberOfVoter,
		});
		return answerGeneralReport;
	}
	fromDomain(domainModel: AnswerReport): AnswerReportDataModel {
		const data: AnswerReportDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#RECURRENCE#${domainModel.pollRecurrence}`,
			SK: `#GENERAL#QUES#${domainModel.questionId}#ANSWER#${domainModel.answer}`,
			Question: domainModel.question,
			NumberOfVoter: domainModel.numberOfVoter,
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
	async createVoterReportsForRecurrence(
		newVoterReports: VoterReport[],
	): Promise<void> {
		await this.voterReportRepository.putVoterReports(newVoterReports);
	}
	getVotersOfSpecificAnswer(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[]> {
		throw new Error('Method not implemented.');
	}
	async getAnswerReport(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}#VERSION#${pollVersion}#RECURRENCE#${pollRecurrence}`,
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

	async getAnswerReportsForRecurrence(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue AND begins_with(SK,:sortKeyPattern)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}#VERSION#${pollVersion}#RECURRENCE#${pollRecurrence}`,
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
		const singleBatchRequest = [];
		let count = 0;
		for (const element of answerReports) {
			const recordDynamodb = this.mapper.fromDomain(element);
			const singlePutRequest = {
				PutRequest: {
					Item: recordDynamodb,
				},
			};
			singleBatchRequest.push(singlePutRequest);
			count += 1;
			if (count === 25 || count === answerReports.length) {
				let params: BatchWriteCommandInput = {
					RequestItems: {
						[this.config.tableName]: singleBatchRequest,
					},
				};

				let keepBatchingCurrentRequest = true;
				while (keepBatchingCurrentRequest) {
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
					}
				}
				singleBatchRequest.splice(0, singleBatchRequest.length);
			}
		}
	}
}
