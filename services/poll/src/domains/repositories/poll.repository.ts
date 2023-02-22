import { IRepository } from '@libs/common';
import { GetPollsByCreatorEmailResponseDto } from '../dtos';
import { Poll, Question } from '../models';

export interface IPollRepository extends IRepository<Poll> {
	getPollsByCreatorEmail(
		creatorEmail: string,
		limit?: number,
		lastPollId?: string,
	): Promise<GetPollsByCreatorEmailResponseDto>;
	getQuestionsByPollId(pollId: string): Promise<Question[]>;
	deletePollById(pollId: string): Promise<void>;
	findPollById(pollId: string): Promise<Poll | null>;
	createQuestion(questionObj: Question): Promise<void>;
	findQuestionByPollIdAndQuestionId(
		pollId: string,
		questionId: string,
	): Promise<Question | null>;
	updateQuestionGeneralInformation(modifiedQuestion: Question): Promise<void>;
	deleteQuestionById(pollId: string, questionId: string): Promise<boolean>;
}
