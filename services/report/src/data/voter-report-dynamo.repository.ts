import { DatabaseMapper, DynamoDBRepository } from '@libs/common';
import { IVoterReportRepository, VoterReport } from '../domains';
import {
	BatchWriteCommand,
	BatchWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
interface VoterReportDataModel {
	PK: string | null | undefined;
	SK?: string;
}

export class VoterReportDynamoDBMapper extends DatabaseMapper<
	VoterReport,
	VoterReportDataModel
> {
	toDomain(dataModel: VoterReportDataModel): VoterReport {
		const voterReport = new VoterReport({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			pollRecurrence: dataModel.PK.split('#')[5],
			questionId: dataModel.SK.split('#')[2],
			answer: dataModel.SK.split('#')[4],
			voterEmail: dataModel.SK.split('#')[6],
		});
		return voterReport;
	}
	fromDomain(domainModel: VoterReport): VoterReportDataModel {
		const data: VoterReportDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#RECURRENCE#${domainModel.pollRecurrence}`,
			SK: `DETAIL#QUES#${domainModel.questionId}#ANSWER#${domainModel.answer}#VOTER#${domainModel.voterEmail}`,
		};
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
}
