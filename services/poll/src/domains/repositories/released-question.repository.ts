import { IRepository } from '@libs/common';
import { Question } from '../models';

export interface IReleasedQuestionRepository extends IRepository<Question> {
	packageQuestionsWithReleasedPoll(
		questions: Question[],
		version: string,
	): Promise<void>;

	getAllQuestionsOfLatestRelease(
		pollId: string,
		latestRelease: string,
	): Promise<Question[]>;
}
