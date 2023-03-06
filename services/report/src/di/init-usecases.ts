import {
	CreateOverviewReportForRecurrenceUseCase,
	CreateUserResponseForRecurrenceUseCase,
	GetOverviewReportForRecurrenceUseCase,
	GetOverviewReportsForPollUseCase,
	UpdateStatusForRecurrenceUseCase,
} from '../usecases';
import { overviewReportRepository } from './init-repositories';

export const createOverviewReportForRecurrenceUseCase =
	new CreateOverviewReportForRecurrenceUseCase(overviewReportRepository);

export const getOverviewReportForRecurrenceUseCase =
	new GetOverviewReportForRecurrenceUseCase(overviewReportRepository);

export const getOverviewReportsForPollUseCase =
	new GetOverviewReportsForPollUseCase(overviewReportRepository);

export const updateStatusForRecurrenceUseCase =
	new UpdateStatusForRecurrenceUseCase(overviewReportRepository);

export const createUserResponseForRecurrenceUseCase =
	new CreateUserResponseForRecurrenceUseCase(overviewReportRepository);
