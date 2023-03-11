import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetOverviewReportResponseDto,
	IOverviewReportRepository,
} from '../domains';

export class GetOverviewReportUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
	) {}
}
/* Return to the vote page to check whether the form is still opened or not */
export class GetOverviewReportUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: GetOverviewReportUseCaseInput,
	): Promise<GetOverviewReportResponseDto> {
		const { pollId, pollVersion, startDate, endDate } = input;

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

		const result =
			await this.overviewReportRepository.getOverviewReportForOccurrence(
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		if (!result) {
			throw new NotFoundException('Overview Report not found');
		}
		return {
			message: 'get overview report successfully',
			overviewReport: result,
		};
	}
}
