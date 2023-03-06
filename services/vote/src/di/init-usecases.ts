import {
	GetDraftAnswersForUserUseCase,
	PutDraftAnswersForQuestionUseCase,
	PutGeneralVotingStatusOfUserUseCase,
} from '../usecases';
import { draftAnswersForQuestionRepository } from './init-repositories';

export const getDraftAnswersForUserUseCase = new GetDraftAnswersForUserUseCase(
	draftAnswersForQuestionRepository,
);
export const putDraftAnswersForQuestionUseCase =
	new PutDraftAnswersForQuestionUseCase(draftAnswersForQuestionRepository);

export const putGeneralVotingStatusOfUserUseCase =
	new PutGeneralVotingStatusOfUserUseCase(draftAnswersForQuestionRepository);
