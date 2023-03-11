import {
	GetDraftAnswersUseCase,
	PutDraftAnswersForQuestionUseCase,
	PutDraftInformationUseCase,
} from '../usecases';
import { draftRepository } from './init-repositories';

export const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
	draftRepository,
);
export const putDraftAnswersForQuestionUseCase =
	new PutDraftAnswersForQuestionUseCase(draftRepository);

export const putDraftInformationUseCase = new PutDraftInformationUseCase(
	draftRepository,
);
