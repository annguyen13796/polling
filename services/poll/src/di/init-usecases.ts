import {
	CreatePollUseCase,
	CreateQuestionUseCase,
	DeletePollByIdUseCase,
	GetPollsByCreatorEmailUseCase,
	GetPollByIdUseCase,
	GetQuestionsByPollIdUseCase,
	EditQuestionUseCase,
} from '../usecases';

import { pollRepository } from './init-repositories';

export const createPollUseCase = new CreatePollUseCase(pollRepository);

export const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
	pollRepository,
);

export const getQuestionsUseCase = new GetQuestionsByPollIdUseCase(
	pollRepository,
);

export const createQuestionUseCase = new CreateQuestionUseCase(pollRepository);

export const deletePollByIdUseCase = new DeletePollByIdUseCase(pollRepository);
export const getPollByIdUseCase = new GetPollByIdUseCase(pollRepository);

export const editQuestionUseCase = new EditQuestionUseCase(pollRepository);
