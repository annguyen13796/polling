import {
	PutCommand,
	PutCommandInput,
	QueryCommand,
	QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import {
	DatabaseMapper,
	DynamoDBConfig,
	DynamoDBRepository,
} from '@libs/common';
import { IVersionPollRepository, Question, Version } from '../domains';
import { VersionQuestionDynamoRepository } from './version-question.repository';

export interface VersionPollDataModel {
	PK: string | null | undefined;
	SK?: string | null | undefined;
	CreatedAt: string;
	Recurrence: string[] | null | undefined;
}

export class VersionPollDynamoDBMapper extends DatabaseMapper<
	Version,
	VersionPollDataModel
> {
	toDomain(dataModel: VersionPollDataModel): Version {
		const versionsOfPoll = new Version({
			pollId: dataModel.PK.split('#')[1],
			version: dataModel.CreatedAt,
			createdAt: dataModel.CreatedAt,
			recurrence: dataModel.Recurrence,
		});

		return versionsOfPoll;
	}
	fromDomain(domainModel: Version): VersionPollDataModel {
		const versionDataModel: VersionPollDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `POLL#${domainModel.pollId}#VERSION#${domainModel.version}`,
			CreatedAt: domainModel.createdAt,
			Recurrence: domainModel.recurrence,
		};
		return versionDataModel;
	}
}

export class VersionPollDynamoRepository
	extends DynamoDBRepository<Version, VersionPollDataModel>
	implements IVersionPollRepository
{
	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<Version, VersionPollDataModel>,
		protected readonly versionQuestionRepository: VersionQuestionDynamoRepository,
	) {
		super(config, mapper);
	}

	async createPollVersion(version: Version): Promise<void> {
		const versionPollDataModel = this.mapper.fromDomain(version);

		const params: PutCommandInput = {
			TableName: this.config.tableName,
			Item: versionPollDataModel,
		};

		await this.dynamoDBDocClient.send(new PutCommand(params));
	}

	async getAllPollVersions(pollId: string): Promise<Version[]> {
		const params: QueryCommandInput = {
			TableName: this.config.tableName,

			KeyConditionExpression: `PK = :partitionKeyval and begins_with(SK, :sortKeyVal)`,
			ExpressionAttributeValues: {
				':partitionKeyval': `POLL#${pollId}`,
				':sortKeyVal': `POLL#${pollId}`,
			},
		};

		const { Items } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		if (Items.length) {
			const versions = Items.map((element) => {
				return this.mapper.toDomain(element as VersionPollDataModel);
			});

			return versions;
		}
		return [];
	}

	async packageQuestionsWithVersion(version: Version): Promise<void> {
		await this.createPollVersion(version);
		await this.versionQuestionRepository.packageQuestionsWithVersion(
			version.questions,
			version.version,
		);
	}

	async getQuestionsByLatestVersion(
		pollId: string,
		latestVersion: string,
	): Promise<Question[] | null> {
		const questions =
			await this.versionQuestionRepository.getAllQuestionsByLatestVersion(
				pollId,
				latestVersion,
			);

		if (questions?.length) {
			return questions;
		}

		return null;
	}
}
