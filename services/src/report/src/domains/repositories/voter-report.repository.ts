import { IRepository } from '@libs/common';
import { VoterReport } from '../models';

export interface IVoterReportRepository extends IRepository<VoterReport> {
	putVoterReports(voterReports: VoterReport[]): Promise<void>;
	getVoterReports(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null>;
}
