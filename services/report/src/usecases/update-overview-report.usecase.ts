import { BadRequestException, NotFoundException } from '@libs/common';
import {
	IOverviewReportRepository,
	UpdateOverviewReportDto,
	UpdateOverviewReportResponseDto,
} from '../domains';

export class UpdateOverviewReportUseCaseInput {
	constructor(
		public readonly dto: UpdateOverviewReportDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
	) {}
}

export class UpdateOverviewReportUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: UpdateOverviewReportUseCaseInput,
	): Promise<UpdateOverviewReportResponseDto> {
		const { dto, pollId, pollVersion, startDate, endDate } = input;
		const { status } = dto;

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
		if (!status) {
			throw new BadRequestException('New Status is required');
		}

		const existedOverviewReport =
			await this.overviewReportRepository.getOverviewReportForOccurrence(
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		if (!existedOverviewReport) {
			throw new NotFoundException('Overview Report Not Found');
		}

		existedOverviewReport.updateStatus(status);
		await this.overviewReportRepository.updateOverviewReport(
			existedOverviewReport,
		);

		return {
			message: 'update overview report successfully',
		};
	}
}
