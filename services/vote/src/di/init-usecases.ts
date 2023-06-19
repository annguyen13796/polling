import {
	GetCurrentAnswersForDraftUseCase,
	PutCurrentAnswersForQuestionUseCase,
	PutDraftUseCase,
} from '../usecases';
import { draftRepository } from './init-repositories';

export const getCurrentAnswersForDraftUseCase =
	new GetCurrentAnswersForDraftUseCase(draftRepository);
export const putCurrentAnswersForQuestionUseCase =
	new PutCurrentAnswersForQuestionUseCase(draftRepository);

export const putDraftUseCase = new PutDraftUseCase(draftRepository);
