import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
import {
	AnswerReport,
	IOverviewReportRepository,
	OverviewReport,
	VoterReport,
} from '../domains';
import {
	GetCommand,
	GetCommandInput,
	PutCommand,
	PutCommandInput,
	QueryCommand,
	QueryCommandInput,
	UpdateCommand,
	UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { STATUS_TYPE } from '../constants';
import { VoterReportDynamoRepository } from './voter-report-dynamo.repository';
import {
	AnswerGeneralReportDynamoRepository,
	QueryCommandReturnType,
} from './answer-general-report-dynamo.repository';
interface OverviewReportDataModel {
	PK: string | null | undefined;
	SK?: string;
	PollName: string;
	PollDescription: string;
	Status: STATUS_TYPE;
	Participants: string[];
}

export class OverviewReportDynamoDBMapper extends DatabaseMapper<
	OverviewReport,
	OverviewReportDataModel
> {
	toDomain(dataModel: OverviewReportDataModel): OverviewReport {
		const overviewReport = new OverviewReport({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.SK.split('#')[3],
			pollRecurrence: dataModel.SK.split('#')[5],
			pollName: dataModel.PollName,
			pollDescription: dataModel.PollDescription,
			participants: dataModel.Participants,
			status: dataModel.Status,
		});
		return overviewReport;
	}
	fromDomain(domainModel: OverviewReport): OverviewReportDataModel {
		const data: OverviewReportDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `#METADATA#VERSION#${domainModel.pollVersion}#RECURRENCE#${domainModel.pollRecurrence}`,
			PollName: domainModel.pollName,
			PollDescription: domainModel.pollDescription,
			Status: domainModel.status,
			Participants: domainModel.participants,
		};
		return data;
	}
}

export class OverviewReportDynamoRepository
	extends DynamoDBRepository<OverviewReport, OverviewReportDataModel>
	implements IOverviewReportRepository
{
	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<
			OverviewReport,
			OverviewReportDataModel
		>,
		protected readonly voterReportRepository: VoterReportDynamoRepository,
		protected readonly answerGeneralReportRepository: AnswerGeneralReportDynamoRepository,
	) {
		super(config, mapper);
	}
	async updateAnswerReportsForRecurrence(
		modifiedAnswerReports: AnswerReport[],
	): Promise<void> {
		await this.answerGeneralReportRepository.putAnswerReports(
			modifiedAnswerReports,
		);
	}
	async createVoterReportsForRecurrence(
		newVoterReports: VoterReport[],
	): Promise<void> {
		await this.answerGeneralReportRepository.createVoterReportsForRecurrence(
			newVoterReports,
		);
	}
	getAnswerReport(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport> {
		const report = this.answerGeneralReportRepository.getAnswerReport(
			pollId,
			pollVersion,
			pollRecurrence,
			questionId,
			answer,
		);
		return report;
	}
	async getOverviewReportsForPoll(pollId: string): Promise<OverviewReport[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue and begins_with(SK, :sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}`,
				':sortKeyValue': `#METADATA`,
			},
			ScanIndexForward: false,
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items && Items.length) {
			const overviewList = Items.map((element) => {
				return this.mapper.toDomain(element as OverviewReportDataModel);
			});

			return overviewList;
		}
		return [];
	}
	async getOverviewReportForRecurrence(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
	): Promise<OverviewReport> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}`,
				SK: `#METADATA#VERSION#${pollVersion}#RECURRENCE#${pollRecurrence}`,
			},
		};

		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));

		if (Item) {
			const overview = this.mapper.toDomain(Item as OverviewReportDataModel);

			return overview;
		}

		return null;
	}

	async updateStatusForOverviewReport(
		modifiedOverviewReport: OverviewReport,
	): Promise<void> {
		const params: UpdateCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${modifiedOverviewReport.pollId}`,
				SK: `#METADATA#VERSION#${modifiedOverviewReport.pollVersion}#RECURRENCE#${modifiedOverviewReport.pollRecurrence}`,
			},
			UpdateExpression: `SET #status= :status `,
			ExpressionAttributeNames: {
				'#status': 'Status',
			},
			ExpressionAttributeValues: {
				':status': modifiedOverviewReport.status,
			},
		};
		await this.dynamoDBDocClient.send(new UpdateCommand(params));
	}

	async updateUserResponseForRecurrence(
		modifiedOverviewReport: OverviewReport,
	): Promise<void> {
		const params: UpdateCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${modifiedOverviewReport.pollId}`,
				SK: `#METADATA#VERSION#${modifiedOverviewReport.pollVersion}#RECURRENCE#${modifiedOverviewReport.pollRecurrence}`,
			},
			UpdateExpression: `SET #participants= :participants `,
			ExpressionAttributeNames: {
				'#participants': 'Participants',
			},
			ExpressionAttributeValues: {
				':participants': modifiedOverviewReport.participants,
			},
		};
		await this.dynamoDBDocClient.send(new UpdateCommand(params));
	}

	async createOverload(
		newOverviewReport: OverviewReport,
		newAnswerReports: AnswerReport[],
	): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(newOverviewReport);
			const params: PutCommandInput = {
				TableName: this.config.tableName,
				Item: dataModel as any,
			};
			await this.dynamoDBDocClient.send(new PutCommand(params));

			await this.answerGeneralReportRepository.putAnswerReports(
				newAnswerReports,
			);
		} catch (error) {
			throw new UnknownException(error);
		}
	}

	async getAnswerReportsForRecurrence(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>> {
		const response =
			await this.answerGeneralReportRepository.getAnswerReportsForRecurrence(
				pollId,
				pollVersion,
				pollRecurrence,
				startItem,
			);
		return response;
	}
}
