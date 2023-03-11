import { BadRequestException, NotFoundException } from '@libs/common';
import {
	AnswerReport,
	CreateUserResponseDto,
	CreateUserResponseResponseDto,
	IOverviewReportRepository,
	VoterReport,
} from '../domains';

export class CreateUserResponseUseCaseInput {
	constructor(
		public readonly dto: CreateUserResponseDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
	) {}
}

export class CreateUserResponseUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: CreateUserResponseUseCaseInput,
	): Promise<CreateUserResponseResponseDto> {
		const { dto, pollId, pollVersion } = input;
		const { participantEmail, userResponse, startDate, endDate } = dto;

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

		if (!participantEmail) {
			throw new BadRequestException('Participant Email is required');
		}

		if (!userResponse) {
			throw new BadRequestException('Response is required');
		}

		const existedOverviewReportForOccurrence =
			await this.overviewReportRepository.getOverviewReportForOccurrence(
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		if (!existedOverviewReportForOccurrence) {
			throw new NotFoundException('Overview Report For Occurrence Not Found');
		}

		if (existedOverviewReportForOccurrence.status === 'CLOSED') {
			throw new BadRequestException('Voting Event is closed');
		}

		const newVoterReports: VoterReport[] = [];
		const modifiedAnswerReports: AnswerReport[] = [];
		for (const question of userResponse) {
			for (const answer of question.userAnswers) {
				const newVoterReport = new VoterReport({
					pollId: pollId,
					pollVersion: pollVersion,
					startDate: startDate,
					endDate: endDate,
					questionId: question.questionId,
					voterEmail: participantEmail,
					answer: answer,
				});
				const existedAnswerReport =
					await this.overviewReportRepository.getAnswerReport(
						pollId,
						pollVersion,
						startDate,
						endDate,
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

		existedOverviewReportForOccurrence.updateParticipants(participantEmail);
		await this.overviewReportRepository.updateUserResponse(
			existedOverviewReportForOccurrence,
		);
		await this.overviewReportRepository.updateAnswerReports(
			modifiedAnswerReports,
		);
		await this.overviewReportRepository.createVoterReports(newVoterReports);

		return {
			message: 'create user response successfully',
		};
	}
}
