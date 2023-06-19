import { CurrentAnswersForQuestion } from '../models';

export interface GetCurrentAnswersForDraftResponseDto {
	message: string;
	draftAnswers: CurrentAnswersForQuestion[] | null;
}
