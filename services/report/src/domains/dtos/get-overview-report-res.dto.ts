import { OverviewReport } from '../models';

export interface GetOverviewReportResponseDto {
	message: string;
	overviewReport: OverviewReport | null;
}
