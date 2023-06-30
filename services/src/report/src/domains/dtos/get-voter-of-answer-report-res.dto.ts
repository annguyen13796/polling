import { VoterReport } from '../models';

export interface GetVotersOfAnswerReportsResponseDto {
	message: string;
	voterReports: VoterReport[];
}
