import { IRepository } from '@libs/common';
import { Draft, DraftAnswersForQuestion } from '../models';

export interface IDraftRepository extends IRepository<Draft> {
	getDraftInformation(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		voterEmail: string,
	): Promise<Draft | null>;
	putDraftInformation(newDraftObject: Draft): Promise<void>;
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
