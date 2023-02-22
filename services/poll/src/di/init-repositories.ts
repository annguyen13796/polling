import {
	PollDynamoDBMapper,
	PollDynamoRepository,
	VersionPollDynamoDBMapper,
} from '../data';
import {
	QuestionDynamoDBMapper,
	QuestionDynamoRepository,
	VersionPollDynamoRepository,
} from '../data';
import {
	VersionQuestionDynamoDBMapper,
	VersionQuestionDynamoRepository,
} from '../data/version-question.repository';

export const pollDomainMapper = new PollDynamoDBMapper();
export const questionDomainMaper = new QuestionDynamoDBMapper();

export const questionRepository = new QuestionDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	questionDomainMaper,
);

export const versionQuestionDomainMapper = new VersionQuestionDynamoDBMapper();

export const versionQuestionRepository = new VersionQuestionDynamoRepository(
	{ tableName: 'khoa.pham_polling_version' },
	versionQuestionDomainMapper,
);

export const versionPollDomainMapper = new VersionPollDynamoDBMapper();

export const versionPollRepository = new VersionPollDynamoRepository(
	{
		tableName: 'khoa.pham_polling_version',
	},
	versionPollDomainMapper,
	versionQuestionRepository,
);

export const pollRepository = new PollDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	pollDomainMapper,
	questionRepository,
);
