import { OverviewReport } from '../models';

export interface GetOverviewReportForRecurrenceResponseDto {
	message: string;
	overviewReport: OverviewReport | null;
}
