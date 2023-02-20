import {
	CreatePollUseCase,
	CreateQuestionUseCase,
	DeletePollByIdUseCase,
	GetPollsByCreatorEmailUseCase,
	GetPollByIdUseCase,
	GetQuestionsByPollIdUseCase,
} from '../usecases';

import { pollRepository, questionRepository } from './init-repositories';

export const createPollUseCase = new CreatePollUseCase(pollRepository);

export const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
	pollRepository,
);

export const getQuestionsUseCase = new GetQuestionsByPollIdUseCase(
	pollRepository,
);

export const createQuestionUseCase = new CreateQuestionUseCase(
	questionRepository,
	pollRepository,
);

export const deletePollByIdUseCase = new DeletePollByIdUseCase(pollRepository);

export const getPollByIdUseCase = new GetPollByIdUseCase(pollRepository);
