import { BadRequestException } from '@libs/common';
import {
	AnswerReport,
	CreateOverviewReportForRecurrenceDto,
	CreateOverviewReportForRecurrenceResponseDto,
	IOverviewReportRepository,
	OverviewReport,
} from '../domains';

export class CreateOverviewReportForRecurrenceUseCaseInput {
	constructor(
		public readonly dto: CreateOverviewReportForRecurrenceDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
	) {}
}

export class CreateOverviewReportForRecurrenceUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: CreateOverviewReportForRecurrenceUseCaseInput,
	): Promise<CreateOverviewReportForRecurrenceResponseDto> {
		const { dto, pollId, pollVersion } = input;
		const { pollDescription, pollName, pollRecurrence, questions } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!pollVersion) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!pollRecurrence) {
			throw new BadRequestException('Poll Recurrence is required');
		}

		if (!questions || questions.length === 0) {
			throw new BadRequestException('Questions List cant be null/empty');
		}

		const existedOverviewReportForRecurrence =
			await this.overviewReportRepository.getOverviewReportForRecurrence(
				pollId,
				pollVersion,
				pollRecurrence,
			);
		if (existedOverviewReportForRecurrence) {
			throw new BadRequestException('Overview Report For Recurrence Existed');
		}

		const newOverviewReportForRecurrence = new OverviewReport({
			pollId: pollId,
			pollVersion: pollVersion,
			pollRecurrence: pollRecurrence,
			pollName: pollName,
			pollDescription: pollDescription,
			status: null,
			participants: null,
		});

		const newAnswerReports = [];
		for (const question of questions) {
			for (const answer of question.answers) {
				const newAnswerGeneralReport = new AnswerReport({
					pollId: pollId,
					pollVersion: pollVersion,
					pollRecurrence: pollRecurrence,
					question: question.content,
					questionId: question.questionId,
					numberOfVoter: 0,
					answer: answer,
				});
				newAnswerReports.push(newAnswerGeneralReport);
			}
		}

		await this.overviewReportRepository.createOverload(
			newOverviewReportForRecurrence,
			newAnswerReports,
		);

		return {
			message: 'create overview report successfully',
		};
	}
}
