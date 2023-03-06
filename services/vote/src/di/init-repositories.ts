import {
	DraftAnswersForQuestionDynamoDBMapper,
	DraftAnswersForQuestionDynamoRepository,
	GeneralVotingStatusOfUserDynamoDBMapper,
	GeneralVotingStatusOfUserDynamoRepository,
} from '../data';

export const generalVotingStatusOfUserMapper =
	new GeneralVotingStatusOfUserDynamoDBMapper();

export const generalVotingStatusOfUserRepository =
	new GeneralVotingStatusOfUserDynamoRepository(
		{
			tableName: 'khoa.pham_polling_draftVote',
		},
		generalVotingStatusOfUserMapper,
	);

export const draftAnswersForQuestionMapper =
	new DraftAnswersForQuestionDynamoDBMapper();

export const draftAnswersForQuestionRepository =
	new DraftAnswersForQuestionDynamoRepository(
		generalVotingStatusOfUserRepository,
		{
			tableName: 'khoa.pham_polling_draftVote',
		},
		draftAnswersForQuestionMapper,
	);
