import {
	DatabaseMapper,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
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
		while (voterReports.length > 0) {
			const lastPosition = voterReports.length < 25 ? voterReports.length : 25;
			const singleBatchRequest = voterReports
				.splice(0, lastPosition)
				.map((voterReport) => this.mapper.fromDomain(voterReport))
				.map((voterRecord) => ({
					PutRequest: {
						Item: voterRecord,
					},
				}));
			let params: BatchWriteCommandInput = {
				RequestItems: {
					[this.config.tableName]: singleBatchRequest,
				},
			};

			let keepBatchingCurrentRequest = true;
			let batchingTime = 0;
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
