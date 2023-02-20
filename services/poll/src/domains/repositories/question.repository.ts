import { IRepository } from '@libs/common';
import { Question } from '../models';

export interface IQuestionRepository extends IRepository<Question> {
	getQuestionsByPollId(pollId: string): Promise<Question[]>;
}
