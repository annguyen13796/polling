import { DatabaseMapper, DynamoDBRepository } from '@libs/common';
import {
	IVoterReportRepository,
	VoterReport,
	VoterReportProps,
} from '../domains';
import {
	BatchWriteCommand,
	BatchWriteCommandInput,
	QueryCommand,
	QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
interface VoterReportDataModel {
	PK: string | null | undefined;
	SK?: string;
	ShortAnswer?: string;
}

export class VoterReportDynamoDBMapper extends DatabaseMapper<
	VoterReport,
	VoterReportDataModel
> {
	toDomain(dataModel: VoterReportDataModel): VoterReport {
		const voterReportProps: VoterReportProps = {
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			startDate: dataModel.PK.split('#')[5],
			endDate: dataModel.PK.split('#')[7],
			questionId: dataModel.SK.split('#')[2],
			answer: dataModel.SK.split('#')[4],
			voterEmail: dataModel.SK.split('#')[6],
		};
		if (dataModel.ShortAnswer) {
			voterReportProps.shortAnswer = dataModel.ShortAnswer;
		}
		const voterReport = new VoterReport(voterReportProps);
		return voterReport;
	}
	fromDomain(domainModel: VoterReport): VoterReportDataModel {
		const data: VoterReportDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#START#${domainModel.startDate}#END#${domainModel.endDate}`,
			SK: `DETAIL#QUES#${domainModel.questionId}#ANSWER#${domainModel.answer}#VOTER#${domainModel.voterEmail}`,
		};
		if (domainModel.shortAnswer) {
			data.ShortAnswer = domainModel.shortAnswer;
		}
		return data;
	}
}

export class VoterReportDynamoRepository
	extends DynamoDBRepository<VoterReport, VoterReportDataModel>
	implements IVoterReportRepository
{
	async putVoterReports(voterReports: VoterReport[]): Promise<void> {
		const singleBatchRequest = [];
		let count = 0;
		for (const element of voterReports) {
			const recordDynamodb = this.mapper.fromDomain(element);
			const singlePutRequest = {
				PutRequest: {
					Item: recordDynamodb,
				},
			};
			singleBatchRequest.push(singlePutRequest);
			count += 1;
			if (count === 25 || count === voterReports.length) {
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

	async getVoterReports(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue AND begins_with(SK, :sortKeyPattern)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
				':sortKeyPattern': `DETAIL#QUES#${questionId}#ANSWER#${answer}#VOTER`,
			},
		};
		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);
		if (Items) {
			const voterReports = Items.map((item: VoterReportDataModel) =>
				this.mapper.toDomain(item),
			);

			return voterReports;
		}

		return null;
	}
}
