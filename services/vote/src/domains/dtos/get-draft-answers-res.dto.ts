import { DraftAnswersForQuestion } from '../models';

export interface GetDraftAnswersResponseDto {
	message: string;
	draftAnswers: DraftAnswersForQuestion[] | null;
}
