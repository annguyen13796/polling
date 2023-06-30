import { QUESTION_TYPE } from '../../constants';

export interface CreateQuestionDto {
	answers: string[] | null;
	content: string | null | undefined;
	isRequired: boolean | null;
	questionType: QUESTION_TYPE | null | undefined;
	questionId: string | null | undefined;
}
