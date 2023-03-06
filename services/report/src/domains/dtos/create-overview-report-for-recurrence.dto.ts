export interface Question {
	content: string;
	questionId: string;
	answers: string[];
}
export interface CreateOverviewReportForRecurrenceDto {
	pollName: string;
	pollDescription: string;
	pollRecurrence: string;
	questions: Question[];
}
