import { IRepository } from '@libs/common';
import { Question } from '../models';

export interface IVersionQuestionRepository extends IRepository<Question> {
	packageQuestionsWithVersion(
		questions: Question[],
		version: string,
	): Promise<void>;

	getAllQuestionsByLatestVersion(
		pollId: string,
		latestVersion: string,
	): Promise<Question[]>;
}
