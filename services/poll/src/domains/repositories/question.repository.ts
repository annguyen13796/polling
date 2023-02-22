import { IRepository } from '@libs/common';
import { Question } from '../models';

export interface IQuestionRepository extends IRepository<Question> {
	getQuestionsByPollId(pollId: string): Promise<Question[]>;
	getQuestionByPollIdAndQuestionId(
		pollId: string,
		questionId: string,
	): Promise<Question>;
	updateQuestionGeneralInformation(modifiedQuestion: Question): Promise<void>;
	deleteQuestionById(pollId: string, questionId: string): Promise<boolean>;
}
