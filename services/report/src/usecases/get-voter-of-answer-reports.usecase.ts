import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetVotersOfAnswerReportsResponseDto,
	IOverviewReportRepository,
} from '../domains';

export class GetVoterOfAnswerReportsUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly questionId: string,
		public readonly answer: string,
	) {}
}

export class GetVoterOfAnswerReportsUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: GetVoterOfAnswerReportsUseCaseInput,
	): Promise<GetVotersOfAnswerReportsResponseDto> {
		const { questionId, answer, startDate, endDate, pollId, pollVersion } =
			input;

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

		if (!questionId) {
			throw new BadRequestException('Question ID is required');
		}

		if (!answer) {
			throw new BadRequestException('Answer is required');
		}

		const voterReports =
			await this.overviewReportRepository.getVoterReportsOfAnswer(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		if (voterReports === null) {
			throw new NotFoundException('Report is not existed');
		}

		return {
			message: 'Successfully get voter of answer',
			voterReports: voterReports,
		};
	}
}
