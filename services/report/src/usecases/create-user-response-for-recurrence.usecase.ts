import { BadRequestException, NotFoundException } from '@libs/common';
import {
	AnswerReport,
	CreateUserResponseForRecurrenceDto,
	CreateUserResponseForRecurrenceResponseDto,
	IOverviewReportRepository,
	VoterReport,
} from '../domains';

export class CreateUserResponseForRecurrenceUseCaseInput {
	constructor(
		public readonly dto: CreateUserResponseForRecurrenceDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
	) {}
}

export class CreateUserResponseForRecurrenceUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: CreateUserResponseForRecurrenceUseCaseInput,
	): Promise<CreateUserResponseForRecurrenceResponseDto> {
		const { dto, pollId, pollVersion } = input;
		const { participantEmail, userResponse, pollRecurrence } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!pollVersion) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!pollRecurrence) {
			throw new BadRequestException('Poll Recurrence is required');
		}

		if (!participantEmail) {
			throw new BadRequestException('Participant Email is required');
		}

		if (!userResponse) {
			throw new BadRequestException('Response is required');
		}

		const existedOverviewReportForRecurrence =
			await this.overviewReportRepository.getOverviewReportForRecurrence(
				pollId,
				pollVersion,
				pollRecurrence,
			);

		if (!existedOverviewReportForRecurrence) {
			throw new NotFoundException('Overview Report For Recurrence Not Found');
		}

		if (existedOverviewReportForRecurrence.status === 'CLOSED') {
			throw new BadRequestException('Recurrence is closed');
		}

		const newVoterReports: VoterReport[] = [];
		const modifiedAnswerReports: AnswerReport[] = [];
		for (const question of userResponse) {
			for (const answer of question.userAnswers) {
				const newVoterReport = new VoterReport({
					pollId: pollId,
					pollVersion: pollVersion,
					pollRecurrence: pollRecurrence,
					questionId: question.questionId,
					voterEmail: participantEmail,
					answer: answer,
				});
				const existedAnswerReport =
					await this.overviewReportRepository.getAnswerReport(
						pollId,
						pollVersion,
						pollRecurrence,
						question.questionId,
						answer,
					);
				if (!existedAnswerReport) {
					throw new BadRequestException(
						"The answer in the list can't be found",
					);
				}
				existedAnswerReport.increaseNumberOfVoterBy(1);
				modifiedAnswerReports.push(existedAnswerReport);
				newVoterReports.push(newVoterReport);
			}
		}

		existedOverviewReportForRecurrence.updateParticipants(participantEmail);
		await this.overviewReportRepository.updateUserResponseForRecurrence(
			existedOverviewReportForRecurrence,
		);
		await this.overviewReportRepository.updateAnswerReportsForRecurrence(
			modifiedAnswerReports,
		);
		await this.overviewReportRepository.createVoterReportsForRecurrence(
			newVoterReports,
		);

		return {
			message: 'update overview report successfully',
		};
	}
}
