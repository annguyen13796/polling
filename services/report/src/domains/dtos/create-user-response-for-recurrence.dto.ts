export interface SingleQuestionResponse {
	questionId: string;
	question: string;
	userAnswers: string[];
}
export interface CreateUserResponseForRecurrenceDto {
	pollRecurrence: string;
	participantEmail: string;
	userResponse: SingleQuestionResponse[];
}
