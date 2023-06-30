import {
	CurrentAnswersForQuestionDynamoDBMapper,
	CurrentAnswersForQuestionDynamoRepository,
	DraftDynamoDBMapper,
	DraftDynamoRepository,
} from '../data';

export const currentAnswersForQuestionMapper =
	new CurrentAnswersForQuestionDynamoDBMapper();

export const currentAnswersForQuestionRepository =
	new CurrentAnswersForQuestionDynamoRepository(
		{
			tableName: 'khoa.pham_polling_draftVote',
		},
		currentAnswersForQuestionMapper,
	);

export const draftDynamoDBMapper = new DraftDynamoDBMapper();

export const draftRepository = new DraftDynamoRepository(
	currentAnswersForQuestionRepository,
	{
		tableName: 'khoa.pham_polling_draftVote',
	},
	draftDynamoDBMapper,
);
