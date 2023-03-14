import { QUESTION_TYPE } from '../../constants';

export interface SingleQuestionResponse {
	questionId: string;
	questionType: QUESTION_TYPE;
	userAnswers: string[];
}
export interface CreateUserResponseDto {
	startDate: string;
	endDate: string;
	participantEmail: string;
	userResponse: SingleQuestionResponse[];
}
