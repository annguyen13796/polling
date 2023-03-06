import { IRepository } from '@libs/common';
import { DraftAnswersForQuestion, GeneralVotingStatusOfUser } from '../models';

export interface IDraftAnswersForQuestionRepository
	extends IRepository<DraftAnswersForQuestion> {
	getDraftAnswersForUser(
		pollId: string,
		pollVersion: string,
		recurrence: string,
		voterEmail: string,
	): Promise<DraftAnswersForQuestion[] | null>;
	putDraftAnswersForQuestion(
		draftAnswers: DraftAnswersForQuestion,
	): Promise<void>;
	getGeneralVotingStatusOfUser(
		pollId: string,
		pollVersion: string,
		recurrence: string,
		voterEmail: string,
	): Promise<GeneralVotingStatusOfUser | null>;
	putGeneralVotingStatusOfUser(
		newGeneralVotingStatusOfUserObj: GeneralVotingStatusOfUser,
	): Promise<void>;
}
