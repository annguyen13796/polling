import { OverviewReport } from '../models';

export interface GetOverviewReportsForPollResponseDto {
	message: string;
	overviewReports: OverviewReport[] | null;
}
