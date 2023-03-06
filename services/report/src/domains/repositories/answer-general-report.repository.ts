import { IRepository } from '@libs/common';
import { QueryCommandReturnType } from '../../data';
import { AnswerReport, VoterReport } from '../models';

export interface IAnswerGeneralReportRepository
	extends IRepository<AnswerReport> {
	getAnswerReportsForRecurrence(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>>;
	getAnswerReport(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport>;
	getVotersOfSpecificAnswer(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null>;
	putAnswerReports(answerReports: AnswerReport[]): Promise<void>;

	createVoterReportsForRecurrence(
		newVoterReports: VoterReport[],
	): Promise<void>;
}
