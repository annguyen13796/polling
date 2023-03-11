export interface Question {
	content: string;
	questionId: string;
	answers: string[];
}
export interface CreateOverviewReportDto {
	startDate: string;
	endDate: string;
	questions: Question[];
}
