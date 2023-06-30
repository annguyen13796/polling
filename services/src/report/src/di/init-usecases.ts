import {
	CreateOverviewReportUseCase,
	CreateUserResponseUseCase,
	GetAnswerReportsUseCase,
	GetOverviewReportsForPollUseCase,
	GetOverviewReportUseCase,
	GetVoterOfAnswerReportsUseCase,
	UpdateOverviewReportUseCase,
} from '../usecases';
import { overviewReportRepository } from './init-repositories';

export const createOverviewReportUseCase = new CreateOverviewReportUseCase(
	overviewReportRepository,
);

export const getOverviewReportUseCase = new GetOverviewReportUseCase(
	overviewReportRepository,
);

export const getOverviewReportsForPollUseCase =
	new GetOverviewReportsForPollUseCase(overviewReportRepository);

export const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
	overviewReportRepository,
);

export const createUserResponseUseCase = new CreateUserResponseUseCase(
	overviewReportRepository,
);

export const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
	overviewReportRepository,
);

export const getVoterOfAnswerReportsUseCase =
	new GetVoterOfAnswerReportsUseCase(overviewReportRepository);
