import {
	CreatePollUseCase,
	CreateQuestionUseCase,
	DeletePollByIdUseCase,
	GetPollsByCreatorEmailUseCase,
	GetPollByIdUseCase,
	GetQuestionsByPollIdUseCase,
	ReleasePollUseCase,
	EditQuestionUseCase,
	DeleteQuestionByIdUseCase,
	EditPollInformationUseCase,
	GetLatestReleaseUseCase,
} from '../usecases';

import { pollRepository, releasedPollRepository } from './init-repositories';

export const createPollUseCase = new CreatePollUseCase(pollRepository);
export const editPollInformationUseCase = new EditPollInformationUseCase(
	pollRepository,
);

export const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
	pollRepository,
);

export const getQuestionsUseCase = new GetQuestionsByPollIdUseCase(
	pollRepository,
);

export const createQuestionUseCase = new CreateQuestionUseCase(pollRepository);

export const deletePollByIdUseCase = new DeletePollByIdUseCase(pollRepository);

export const getPollByIdUseCase = new GetPollByIdUseCase(pollRepository);

export const releasePollUseCase = new ReleasePollUseCase(
	pollRepository,
	releasedPollRepository,
);

export const editQuestionUseCase = new EditQuestionUseCase(pollRepository);

export const deleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
	pollRepository,
);

export const getLatestReleaseUseCase = new GetLatestReleaseUseCase(
	pollRepository,
	releasedPollRepository,
);
