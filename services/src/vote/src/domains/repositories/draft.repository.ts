import { IRepository } from '@libs/common';
import { Draft, CurrentAnswersForQuestion } from '../models';

export interface IDraftRepository extends IRepository<Draft> {
	getDraft(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<Draft | null>;
	putDraft(newDraftObject: Draft): Promise<void>;
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
