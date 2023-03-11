import { IRepository } from '@libs/common';
import { DraftAnswersForQuestion } from '../models';

export interface IDraftAnswersForQuestionRepository
	extends IRepository<DraftAnswersForQuestion> {
	getDraftAnswers(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<DraftAnswersForQuestion[] | null>;
	putDraftAnswersForQuestion(
		draftAnswers: DraftAnswersForQuestion,
	): Promise<void>;
}
