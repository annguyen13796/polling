import { IRepository } from '@libs/common';
import { Question, Version } from '../models';

export interface IVersionPollRepository extends IRepository<Version> {
	createPollVersion(version: Version): Promise<void>;
	getLatestVersionInformation(
		pollId: string,
		version: string,
	): Promise<Version | null>;
	getAllPollVersions(pollId: string): Promise<Version[]>;
	packageQuestionsWithVersion(version: Version): Promise<void>;
	getQuestionsByLatestVersion(
		pollId: string,
		latestVersion: string,
	): Promise<Question[] | null>;
}
