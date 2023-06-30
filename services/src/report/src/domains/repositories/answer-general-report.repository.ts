import { IRepository } from '@libs/common';
import { QueryCommandReturnType } from '../../data';
import { AnswerReport, VoterReport } from '../models';

export interface IAnswerGeneralReportRepository
	extends IRepository<AnswerReport> {
	getAnswerReports(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>>;

	getAnswerReport(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport>;

	getVotersOfSpecificAnswer(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null>;

	putAnswerReports(answerReports: AnswerReport[]): Promise<void>;

	createVoterReports(newVoterReports: VoterReport[]): Promise<void>;
}
