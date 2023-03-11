import { IRepository } from '@libs/common';
import { Question, ReleasedPoll } from '../models';

export interface IReleasedPollRepository extends IRepository<ReleasedPoll> {
	createPollRelease(releasedPoll: ReleasedPoll): Promise<void>;
	getLatestReleaseInformation(
		pollId: string,
		latestRelease: string,
	): Promise<ReleasedPoll | null>;
	getAllPollReleases(pollId: string): Promise<ReleasedPoll[]>;
	packageQuestionsWithReleasedPoll(releasedPoll: ReleasedPoll): Promise<void>;
	getQuestionsOfLatestRelease(
		pollId: string,
		latestRelease: string,
	): Promise<Question[] | null>;
}
