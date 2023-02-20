import { PollDynamoDBMapper, PollDynamoRepository } from '../data';
import { QuestionDynamoDBMapper, QuestionDynamoRepository } from '../data';

export const pollDomainMapper = new PollDynamoDBMapper();
export const questionDomainMaper = new QuestionDynamoDBMapper();

export const questionRepository = new QuestionDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	questionDomainMaper,
);

export const pollRepository = new PollDynamoRepository(
	{
		tableName: 'khoa.pham_polling_poll',
	},
	pollDomainMapper,
	questionRepository,
);
