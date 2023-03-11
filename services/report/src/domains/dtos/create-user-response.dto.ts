export interface SingleQuestionResponse {
	questionId: string;
	question: string;
	userAnswers: string[];
}
export interface CreateUserResponseDto {
	startDate: string;
	endDate: string;
	participantEmail: string;
	userResponse: SingleQuestionResponse[];
}
