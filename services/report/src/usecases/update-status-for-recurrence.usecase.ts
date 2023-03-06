import { BadRequestException, NotFoundException } from '@libs/common';
import {
	IOverviewReportRepository,
	UpdateStatusForRecurrenceDto,
	UpdateStatusForRecurrenceResponseDto,
} from '../domains';

export class UpdateStatusForRecurrenceUseCaseInput {
	constructor(
		public readonly dto: UpdateStatusForRecurrenceDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly pollRecurrence: string,
	) {}
}

export class UpdateStatusForRecurrenceUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: UpdateStatusForRecurrenceUseCaseInput,
	): Promise<UpdateStatusForRecurrenceResponseDto> {
		const { dto, pollId, pollVersion, pollRecurrence } = input;
		const { status } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!pollVersion) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!pollRecurrence) {
			throw new BadRequestException('Poll Recurrence is required');
		}

		if (!status) {
			throw new BadRequestException('New Status is required');
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

		existedOverviewReportForRecurrence.updateStatus(status);
		await this.overviewReportRepository.updateStatusForOverviewReport(
			existedOverviewReportForRecurrence,
		);

		return {
			message: 'update overview report successfully',
		};
	}
}
