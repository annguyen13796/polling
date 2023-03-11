import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetAnswerReportsResponseDto,
	IOverviewReportRepository,
} from '../domains';

export class GetAnswerReportsUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly version: string,
		public readonly startDate: string,
		public readonly endDate: string,
	) {}
}

export class GetAnswerReportsUseCase {
	constructor(private readonly reportRepository: IOverviewReportRepository) {}

	async execute(
		input: GetAnswerReportsUseCaseInput,
	): Promise<GetAnswerReportsResponseDto> {
		const { pollId, startDate, endDate, version } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!version) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!startDate) {
			throw new BadRequestException('Start Date is required');
		}

		if (!endDate) {
			throw new BadRequestException('End Date is required');
		}

		const answerReports =
			await this.reportRepository.getAnswerReportsForOccurrence(
				pollId,
				version,
				startDate,
				endDate,
				null,
			);

		const isNotExistedAnswersForReport =
			!answerReports.data && !answerReports.lastEvaluatedKey;
		if (isNotExistedAnswersForReport) {
			throw new NotFoundException('Can not find any report for this version');
		}

		let nextToken: string;
		if (answerReports.lastEvaluatedKey) {
			nextToken = Buffer.from(
				JSON.stringify(answerReports.lastEvaluatedKey),
			).toString('base64');
		} else {
			nextToken = null;
		}

		return {
			nextToken: nextToken,
			answerReports: answerReports.data,
		};
	}
}
