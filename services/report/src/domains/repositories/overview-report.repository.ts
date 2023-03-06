import { IRepository } from '@libs/common';
import { QueryCommandReturnType } from '../../data';
import { AnswerReport, OverviewReport, VoterReport } from '../models';

export interface IOverviewReportRepository extends IRepository<OverviewReport> {
	getOverviewReportsForPoll(pollId: string): Promise<OverviewReport[] | null>;
	getOverviewReportForRecurrence(
		pollId: string,
		pollVersion: string,
		pollRecurrence: string,
	): Promise<OverviewReport>;
	updateStatusForOverviewReport(
		modifiedOverviewReport: OverviewReport,
	): Promise<void>;
	updateUserResponseForRecurrence(
		modifiedOverviewReport: OverviewReport,
	): Promise<void>;
	createOverload(
		newOverviewReport: OverviewReport,
		newAnswerReports: AnswerReport[],
	): Promise<void>;
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
	updateAnswerReportsForRecurrence(
		modifiedAnswerReports: AnswerReport[],
	): Promise<void>;
	createVoterReportsForRecurrence(
		newVoterReports: VoterReport[],
	): Promise<void>;
}
