import { QUESTION_TYPE } from '../../constants';

export interface EditQuestionDto {
	answers: string[] | null;
	content: string | null | undefined;
	isRequired: boolean | null;
	questionType: QUESTION_TYPE | null | undefined;
}
