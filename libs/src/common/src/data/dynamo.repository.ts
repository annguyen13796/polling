import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	PutCommand,
	PutCommandInput,
	UpdateCommand,
	UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { IRepository } from '../domains';
import { UnknownException } from '../exceptions';
import { DatabaseMapper } from '../utils';

export interface DynamoDBConfig {
	tableName: string;
}

export class DynamoDBRepository<DomainModel, DataModel>
	implements IRepository<DomainModel>
{
	private readonly dynamoDBClient: DynamoDBClient;
	protected dynamoDBDocClient: DynamoDBDocumentClient;

	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<DomainModel, DataModel>,
	) {
		this.config = config;
		this.dynamoDBClient = new DynamoDBClient({
			region: 'eu-central-1',
		});
		this.dynamoDBDocClient = DynamoDBDocumentClient.from(this.dynamoDBClient, {
			marshallOptions: {
				convertEmptyValues: false,
				removeUndefinedValues: true,
			},
		});
	}

	async create(domain: DomainModel): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(domain);
			const params: PutCommandInput = {
				TableName: this.config.tableName,
				Item: dataModel as any,
			};
			await this.dynamoDBDocClient.send(new PutCommand(params));
		} catch (error) {
			throw new UnknownException(error);
		}
	}

	async update(domain: DomainModel): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(domain);

			const params: UpdateCommandInput = {
				TableName: this.config.tableName,
				Key: dataModel,
			};

			await this.dynamoDBDocClient.send(new UpdateCommand(params));
		} catch (error) {
			throw new UnknownException(error);
		}
	}
}
