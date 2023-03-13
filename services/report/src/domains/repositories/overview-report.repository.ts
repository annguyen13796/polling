import { IRepository } from '@libs/common';
import { LastEvaluatedKeyType, QueryCommandReturnType } from '../../data';
import { AnswerReport, OverviewReport, VoterReport } from '../models';

export interface IOverviewReportRepository extends IRepository<OverviewReport> {
	getOverviewReportsForPoll(
		pollId: string,
		limit?: number | null | undefined,
		lastEvaluatedKey?: LastEvaluatedKeyType | null | undefined,
	): Promise<OverviewReport[] | null>;
	getOverviewReportForOccurrence(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
	): Promise<OverviewReport>;
	updateOverviewReport(modifiedOverviewReport: OverviewReport): Promise<void>;
	updateUserResponse(modifiedOverviewReport: OverviewReport): Promise<void>;
	createOverviewReportAndAnswerReports(
		newOverviewReport: OverviewReport,
		newAnswerReports: AnswerReport[],
	): Promise<void>;
	getAnswerReportsForOccurrence(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		startItem: { PK: string; SK?: string } | null,
	): Promise<QueryCommandReturnType<AnswerReport>>;

	/*
		getAnswerReport is used to check the existence of answer when updating number of voter
	*/
	getAnswerReport(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<AnswerReport>;
	updateAnswerReports(modifiedAnswerReports: AnswerReport[]): Promise<void>;
	createVoterReports(newVoterReports: VoterReport[]): Promise<void>;
	getVoterReportsOfAnswer(
		pollId: string,
		pollVersion: string,
		startDate: string,
		endDate: string,
		questionId: string,
		answer: string,
	): Promise<VoterReport[] | null>;
}
