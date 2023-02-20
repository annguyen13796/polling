export interface CreateQuestionDto {
	pollId: string | null | undefined;
	content: string | null | undefined;
	questionType: 'MULTIPLE' | 'CHECKBOX' | null | undefined;
	isRequired: boolean;
	answers: string[];
}
