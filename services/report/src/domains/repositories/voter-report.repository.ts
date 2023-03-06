import { IRepository } from '@libs/common';
import { VoterReport } from '../models';

export interface IVoterReportRepository extends IRepository<VoterReport> {
	putVoterReports(voterReports: VoterReport[]): Promise<void>;
}
