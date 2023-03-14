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
	OverviewReportProps,
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

export interface LastEvaluatedKeyType {
	PK: string;
	SK?: string;
}

interface OverviewReportDataModel {
	PK: string | null | undefined;
	SK?: string;
	Status: STATUS_TYPE;
	Participants: string[];
	BlockedDate?: string;
}

export class OverviewReportDynamoDBMapper extends DatabaseMapper<
	OverviewReport,
	OverviewReportDataModel
> {
	toDomain(dataModel: OverviewReportDataModel): OverviewReport {
		const newOverviewReportProps: OverviewReportProps = {
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.SK.split('#')[3],
			startDate: dataModel.SK.split('#')[5],
			endDate: dataModel.SK.split('#')[7],
			participants: dataModel.Participants,
			status: dataModel.Status,
		};
		if (dataModel.BlockedDate) {
			newOverviewReportProps.blockedDate = dataModel.BlockedDate;
		}
		const overviewReport = new OverviewReport(newOverviewReportProps);
		return overviewReport;
	}
	fromDomain(domainModel: OverviewReport): OverviewReportDataModel {
		const data: OverviewReportDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `#METADATA#VERSION#${domainModel.pollVersion}#START#${domainModel.startDate}#END#${domainModel.endDate}`,
			Status: domainModel.status,
			Participants: domainModel.participants,
		};
		if (domainModel.blockedDate) {
			data.BlockedDate = domainModel.blockedDate;
		}
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

	async updateAnswerReports(
		modifiedAnswerReports: AnswerReport[],
	): Promise<void> {
		await this.answerGeneralReportRepository.putAnswerReports(
			modifiedAnswerReports,
		);
	}

	async createVoterReports(newVoterReports: VoterReport[]): Promise<void> {
		await this.answerGeneralReportRepository.createVoterReports(
			newVoterReports,
		);
	}

	getAnswerReport(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport> {
		const report = this.answerGeneralReportRepository.getAnswerReport(
			pollId,
			pollVersion,
			startDate,
			endDate,
			questionId,
			answer,
		);
		return report;
	}

	async getOverviewReportsForPoll(
		pollId: string,
		limit?: number | null | undefined,
		lastEvaluatedKey?: LastEvaluatedKeyType | null | undefined,
	): Promise<OverviewReport[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			KeyConditionExpression: `PK = :partitionKeyValue and begins_with(SK, :sortKeyValue)`,
			ExpressionAttributeValues: {
				':partitionKeyValue': `POLL#${pollId}`,
				':sortKeyValue': `#METADATA`,
			},
			ScanIndexForward: false,
		};
		if (lastEvaluatedKey) {
			params.ExclusiveStartKey = lastEvaluatedKey;
		}
		if (limit) {
			params.Limit = limit;
		}

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

	async getOverviewReportForOccurrence(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
	): Promise<OverviewReport> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}`,
				SK: `#METADATA#VERSION#${pollVersion}#START#${startDate}#END#${endDate}`,
			},
		};

		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));

		if (Item) {
			const overview = this.mapper.toDomain(Item as OverviewReportDataModel);

			return overview;
		}

		return null;
	}

	async updateOverviewReport(
		modifiedOverviewReport: OverviewReport,
	): Promise<void> {
		const dataModel = this.mapper.fromDomain(modifiedOverviewReport);
		const params: PutCommandInput = {
			TableName: this.config.tableName,
			Item: dataModel as any,
		};
		await this.dynamoDBDocClient.send(new PutCommand(params));
	}

	async updateUserResponse(
		modifiedOverviewReport: OverviewReport,
	): Promise<void> {
		const params: UpdateCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${modifiedOverviewReport.pollId}`,
				SK: `#METADATA#VERSION#${modifiedOverviewReport.pollVersion}#START#${modifiedOverviewReport.startDate}#END#${modifiedOverviewReport.endDate}`,
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

	async createOverviewReportAndAnswerReports(
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

	async getAnswerReportsForOccurrence(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>> {
		const response = await this.answerGeneralReportRepository.getAnswerReports(
			pollId,
			pollVersion,
			startDate,
			endDate,
			startItem,
		);
		return response;
	}

	async getVoterReportsOfAnswer(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	) {
		const result =
			await this.answerGeneralReportRepository.getVotersOfSpecificAnswer(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		if (result) {
			return result;
		}

		return null;
	}
}
