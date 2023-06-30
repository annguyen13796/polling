import { IRepository } from '@libs/common';
import { CurrentAnswersForQuestion } from '../models';

export interface ICurrentAnswersForQuestionRepository
	extends IRepository<CurrentAnswersForQuestion> {
	getCurrentAnswersForDraft(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<CurrentAnswersForQuestion[] | null>;
	putCurrentAnswersForQuestion(
		draftAnswers: CurrentAnswersForQuestion,
	): Promise<void>;
}
