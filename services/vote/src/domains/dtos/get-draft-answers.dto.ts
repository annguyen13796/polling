export interface GetDraftAnswersForUserDto {
	pollId: string;
	pollVersion: string;
	startDate: string;
	endDate: string;
	voterEmail: string;
}
