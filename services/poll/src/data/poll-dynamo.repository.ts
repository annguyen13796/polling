import {
	QueryCommand,
	DeleteCommand,
	DeleteCommandInput,
	GetCommandInput,
	GetCommand,
	QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import {
	Poll,
	Question,
	IPollRepository,
	GetPollsByCreatorEmailResponseDto,
} from '../domains';
import { DynamoDBConfig } from '@libs/common';
import { DynamoDBRepository, DatabaseMapper } from '@libs/common';
import { QuestionDynamoRepository } from './question-dynamo.repository';
import { POLL_STATUS } from '../constants';

interface PollDataModel {
	PK: string | null | undefined;
	SK?: string;
	Title: string | null | undefined;
	Description: string | null | undefined;
	CreatedAt: string | null | undefined;
	CreatorEmail: string | null | undefined;
	Version: string | null | undefined;
	Status: POLL_STATUS;
	VoteLink: string | null | undefined;
}

export class PollDynamoDBMapper extends DatabaseMapper<Poll, PollDataModel> {
	toDomain(dataModel: PollDataModel): Poll {
		const poll = new Poll({
			id: dataModel.PK.split('#')[1],
			creatorEmail: dataModel.CreatorEmail,
			title: dataModel.Title,
			description: dataModel.Description,
			createdAt: dataModel.CreatedAt,
			version: dataModel.Version,
			status: dataModel.Status,
			voteLink: dataModel.VoteLink,
		});
		return poll;
	}
	fromDomain(domainModel: Poll): PollDataModel {
		const data: PollDataModel = {
			SK: `POLL#${domainModel.id}`,
			PK: `POLL#${domainModel.id}`,
			Title: domainModel.title,
			Description: domainModel.description,
			CreatedAt: domainModel.createdAt,
			Version: domainModel.version,
			CreatorEmail: domainModel.creatorEmail,
			Status: domainModel.status,
			VoteLink: domainModel.voteLink,
		};
		return data;
	}
}

export class PollDynamoRepository
	extends DynamoDBRepository<Poll, PollDataModel>
	implements IPollRepository
{
	constructor(
		protected readonly config: DynamoDBConfig,
		protected readonly mapper: DatabaseMapper<Poll, PollDataModel>,
		protected readonly questionRepository: QuestionDynamoRepository,
	) {
		super(config, mapper);
	}

	async getPollsByCreatorEmail(
		creatorEmail: string,
		limit: number,
		lastPollId: string,
	): Promise<GetPollsByCreatorEmailResponseDto> {
		const lastEvaluateValue = {
			PK: `POLL#${lastPollId}`,
			SK: `POLL#${lastPollId}`,
			CreatorEmail: creatorEmail,
		};

		const params: QueryCommandInput = {
			TableName: this.config.tableName,
			IndexName: 'CreatorEmail-SK-index',
			Limit: limit,
			KeyConditionExpression: 'CreatorEmail = :creatorEmail',
			ExpressionAttributeValues: { ':creatorEmail': creatorEmail },
			ScanIndexForward: false,
			ExclusiveStartKey: lastEvaluateValue,
			...(lastPollId ? { ExclusiveStartKey: lastEvaluateValue } : {}),
		};

		const { Items, LastEvaluatedKey } = await this.dynamoDBDocClient.send(
			new QueryCommand(params),
		);

		const listPoll = Items.map((element) =>
			this.mapper.toDomain(element as PollDataModel),
		);
		const result: GetPollsByCreatorEmailResponseDto = {
			polls: listPoll,
			lastPollId: LastEvaluatedKey?.PK.split('#')[1],
		};
		return result;
	}

	async getQuestionsByPollId(pollId: string): Promise<Question[]> {
		const listQuestion = await this.questionRepository.getQuestionsByPollId(
			pollId,
		);

		return listQuestion;
	}

	async createQuestion(questionObj: Question): Promise<void> {
		await this.questionRepository.create(questionObj);
	}

	async findPollById(pollId: string): Promise<Poll | null> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				SK: `POLL#${pollId}`,
				PK: `POLL#${pollId}`,
			},
		};

		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));

		if (Item) {
			const poll = this.mapper.toDomain(Item as PollDataModel);

			return poll;
		}

		return null;
	}

	async findQuestionByPollIdAndQuestionId(
		pollId: string,
		questionId: string,
	): Promise<Question | null> {
		const question =
			await this.questionRepository.getQuestionByPollIdAndQuestionId(
				pollId,
				questionId,
			);
		return question;
	}

	async updateQuestionGeneralInformation(
		modifiedQuestion: Question,
	): Promise<void> {
		await this.questionRepository.updateQuestionGeneralInformation(
			modifiedQuestion,
		);
	}

	async deletePollById(pollId: string): Promise<void> {
		const params: DeleteCommandInput = {
			TableName: this.config.tableName,
			Key: {
				SK: `POLL#${pollId}`,
				PK: `POLL#${pollId}`,
			},
		};

		await this.dynamoDBDocClient.send(new DeleteCommand(params));

		const questionsByPollId =
			await this.questionRepository.getQuestionsByPollId(pollId);

		if (questionsByPollId?.length) {
			await Promise.all(
				questionsByPollId.map(async (question: Question) => {
					const params: DeleteCommandInput = {
						TableName: this.config.tableName,
						Key: {
							PK: `POLL#${pollId}`,
							SK: `QUES#${question.questionId}`,
						},
					};

					return await this.dynamoDBDocClient.send(new DeleteCommand(params));
				}),
			);
		}
	}
}
