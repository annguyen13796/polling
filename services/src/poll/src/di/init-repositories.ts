import {
	PollDynamoDBMapper,
	QuestionDynamoDBMapper,
	ReleasedQuestionDynamoDBMapper,
	QuestionDynamoRepository,
	ReleasedQuestionDynamoRepository,
	ReleasedPollDynamoDBMapper,
	ReleasedPollDynamoRepository,
	PollDynamoRepository,
} from '../data';

export const pollDynamoDBMapper = new PollDynamoDBMapper();

export const questionDynamoDBMapper = new QuestionDynamoDBMapper();

export const releasedPollDynamoDBMapper = new ReleasedPollDynamoDBMapper();

export const releasedQuestionDynamoDBMapper =
	new ReleasedQuestionDynamoDBMapper();

export const questionRepository = new QuestionDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	questionDynamoDBMapper,
);

export const pollRepository = new PollDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	pollDynamoDBMapper,
	questionRepository,
);

export const releasedQuestionRepository = new ReleasedQuestionDynamoRepository(
	{ tableName: 'khoa.pham_polling_version' },
	releasedQuestionDynamoDBMapper,
);

export const releasedPollRepository = new ReleasedPollDynamoRepository(
	{
		tableName: 'khoa.pham_polling_version',
	},
	releasedPollDynamoDBMapper,
	releasedQuestionRepository,
);
