import {
	DraftAnswersForQuestionDynamoDBMapper,
	DraftAnswersForQuestionDynamoRepository,
	DraftDynamoDBMapper,
	DraftDynamoRepository,
} from '../data';

export const draftAnswersForQuestionMapper =
	new DraftAnswersForQuestionDynamoDBMapper();

export const draftAnswersForQuestionRepository =
	new DraftAnswersForQuestionDynamoRepository(
		{
			tableName: 'khoa.pham_polling_draftVote',
		},
		draftAnswersForQuestionMapper,
	);

export const draftDynamoDBMapper = new DraftDynamoDBMapper();

export const draftRepository = new DraftDynamoRepository(
	draftAnswersForQuestionRepository,
	{
		tableName: 'khoa.pham_polling_draftVote',
	},
	draftDynamoDBMapper,
);
