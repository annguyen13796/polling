export interface GetCurrentAnswersForDraftDto {
	pollId: string;
	pollVersion: string;
	startDate: string;
	endDate: string;
	voterEmail: string;
}
