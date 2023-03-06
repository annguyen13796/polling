import { IRepository } from '@libs/common';
import { GeneralVotingStatusOfUser } from '../models';

export interface IGeneralVotingStatusOfUserRepository
	extends IRepository<GeneralVotingStatusOfUser> {
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
