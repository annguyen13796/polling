import { BadRequestException } from '@libs/common';
import {
	AnswerReport,
	CreateOverviewReportDto,
	CreateOverviewReportResponseDto,
	IOverviewReportRepository,
	OverviewReport,
} from '../domains';

export class CreateOverviewReportUseCaseInput {
	constructor(
		public readonly dto: CreateOverviewReportDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
	) {}
}

export class CreateOverviewReportUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: CreateOverviewReportUseCaseInput,
	): Promise<CreateOverviewReportResponseDto> {
		const { dto, pollId, pollVersion } = input;
		const { startDate, endDate, questions } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!pollVersion) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!startDate) {
			throw new BadRequestException('Start Date is required');
		}

		if (!endDate) {
			throw new BadRequestException('End Date is required');
		}
		if (!questions || questions.length === 0) {
			throw new BadRequestException('Questions List cant be null/empty');
		}

		const existedOverviewReport =
			await this.overviewReportRepository.getOverviewReportForOccurrence(
				pollId,
				pollVersion,
				startDate,
				endDate,
			);
		if (existedOverviewReport) {
			throw new BadRequestException('Overview Report is already existed');
		}

		const newOverviewReport = new OverviewReport({
			pollId: pollId,
			pollVersion: pollVersion,
			startDate: startDate,
			endDate: endDate,
			status: null,
			participants: null,
		});

		const newAnswerReports: AnswerReport[] = [];
		for (const question of questions) {
			for (const answer of question.answers) {
				const newAnswerGeneralReport = new AnswerReport({
					pollId: pollId,
					pollVersion: pollVersion,
					startDate: startDate,
					endDate: endDate,
					question: question.content,
					questionId: question.questionId,
					numberOfVoter: 0,
					answer: answer,
					questionType: question.questionType,
				});
				newAnswerReports.push(newAnswerGeneralReport);
			}
		}

		const oldOverviewReports =
			await this.overviewReportRepository.getOverviewReportsForPoll(pollId, 1);
		if (oldOverviewReports.length > 0) {
			const lastOverviewReport = oldOverviewReports[0];
			lastOverviewReport.updateStatus('CLOSED');
			await this.overviewReportRepository.updateOverviewReport(
				lastOverviewReport,
			);
		}

		await this.overviewReportRepository.createOverviewReportAndAnswerReports(
			newOverviewReport,
			newAnswerReports,
		);

		return {
			message: 'create overview report successfully',
		};
	}
}
