import {
	CreatePollUseCase,
	CreateQuestionUseCase,
	DeletePollByIdUseCase,
	GetPollsByCreatorEmailUseCase,
	GetPollByIdUseCase,
	GetQuestionsByPollIdUseCase,
	CreateVoteURLUseCase,
	EditQuestionUseCase,
	GetLatestVersionUseCase,
	DeleteQuestionByIdUseCase,
} from '../usecases';

import { pollRepository, versionPollRepository } from './init-repositories';

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

export const createVoteLinkUseCase = new CreateVoteURLUseCase(
	pollRepository,
	versionPollRepository,
);

export const editQuestionUseCase = new EditQuestionUseCase(pollRepository);
export const deleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
	pollRepository,
);

export const getLatestVersionUseCase = new GetLatestVersionUseCase(
	pollRepository,
	versionPollRepository,
);
