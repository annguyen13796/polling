import { Question } from '../models';

export interface GetQuestionsByLatestVersionResponse {
	questions: Question[];
	version: string;
}
