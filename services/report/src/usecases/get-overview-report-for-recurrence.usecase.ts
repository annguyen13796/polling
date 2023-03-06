import { BadRequestException, NotFoundException } from '@libs/common';
import { IOverviewReportRepository, OverviewReport } from '../domains';

export class GetOverviewReportForRecurrenceUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly pollRecurrence: string,
	) {}
}

export class GetOverviewReportForRecurrenceUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: GetOverviewReportForRecurrenceUseCaseInput,
	): Promise<OverviewReport> {
		const { pollId, pollVersion, pollRecurrence } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		if (!pollVersion) {
			throw new BadRequestException('Poll Version is required');
		}

		if (!pollRecurrence) {
			throw new BadRequestException('Poll Recurrence is required');
		}

		const result =
			await this.overviewReportRepository.getOverviewReportForRecurrence(
				pollId,
				pollVersion,
				pollRecurrence,
			);
		if (result) {
			return result;
		} else {
			throw new NotFoundException('overview report not found');
		}
	}
}
