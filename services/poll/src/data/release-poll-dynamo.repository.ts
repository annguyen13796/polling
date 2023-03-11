import {
	GetCommand,
	GetCommandInput,
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
import { IReleasedPollRepository, Question, ReleasedPoll } from '../domains';
import { ReleasedQuestionDynamoRepository } from './release-question.repository';

export interface ReleasedPollDataModel {
	PK: string | null | undefined;
	SK?: string | null | undefined;
	CreatedAt: string;
	StartDate: string;
	EndDate: string;
}

export class ReleasedPollDynamoDBMapper extends DatabaseMapper<
	ReleasedPoll,
	ReleasedPollDataModel
> {
	toDomain(dataModel: ReleasedPollDataModel): ReleasedPoll {
		const versionsOfPoll = new ReleasedPoll({
			pollId: dataModel.PK.split('#')[1],
			version: dataModel.SK.split('#')[3],
			createdAt: dataModel.CreatedAt,
			startDate: dataModel.StartDate,
			endDate: dataModel.EndDate,
		});

		return versionsOfPoll;
	}
	fromDomain(domainModel: ReleasedPoll): ReleasedPollDataModel {
		const versionDataModel: ReleasedPollDataModel = {
			PK: `POLL#${domainModel.pollId}`,
			SK: `POLL#${domainModel.pollId}#VERSION#${domainModel.version}`,
			CreatedAt: domainModel.createdAt,
			StartDate: domainModel.startDate,
			EndDate: domainModel.endDate,
		};
		return versionDataModel;
	}
}

export class ReleasedPollDynamoRepository
	extends DynamoDBRepository<ReleasedPoll, ReleasedPollDataModel>
	implements IReleasedPollRepository
{
	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<
			ReleasedPoll,
			ReleasedPollDataModel
		>,
		protected readonly releasedQuestionRepository: ReleasedQuestionDynamoRepository,
	) {
		super(config, mapper);
	}

	async createPollRelease(releasedPoll: ReleasedPoll): Promise<void> {
		const versionPollDataModel = this.mapper.fromDomain(releasedPoll);

		const params: PutCommandInput = {
			TableName: this.config.tableName,
			Item: versionPollDataModel,
		};

		await this.dynamoDBDocClient.send(new PutCommand(params));
	}

	async getAllPollReleases(pollId: string): Promise<ReleasedPoll[]> {
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
				return this.mapper.toDomain(element as ReleasedPollDataModel);
			});

			return versions;
		}
		return [];
	}

	async packageQuestionsWithReleasedPoll(
		releasedPoll: ReleasedPoll,
	): Promise<void> {
		await this.createPollRelease(releasedPoll);
		await this.releasedQuestionRepository.packageQuestionsWithReleasedPoll(
			releasedPoll.questions,
			releasedPoll.version,
		);
	}

	async getQuestionsOfLatestRelease(
		pollId: string,
		latestRelease: string,
	): Promise<Question[] | null> {
		const questions =
			await this.releasedQuestionRepository.getAllQuestionsOfLatestRelease(
				pollId,
				latestRelease,
			);

		if (questions?.length) {
			return questions;
		}

		return null;
	}

	async getLatestReleaseInformation(
		pollId: string,
		version: string,
	): Promise<ReleasedPoll | null> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,

			Key: {
				PK: `POLL#${pollId}`,
				SK: `POLL#${pollId}#VERSION#${version}`,
			},
		};

		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));

		if (Item) {
			const versionInformation = this.mapper.toDomain(
				Item as ReleasedPollDataModel,
			);

			return versionInformation;
		}

		return null;
	}
}
