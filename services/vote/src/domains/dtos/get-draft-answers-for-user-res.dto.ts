import { DraftAnswerForQuestionProps } from '../models';

export interface GetDraftAnswersForUserResponseDto {
	message: string;
	draftAnswers: DraftAnswerForQuestionProps[] | null;
}
