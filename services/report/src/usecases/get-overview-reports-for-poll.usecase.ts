import { BadRequestException } from '@libs/common';
import {
	GetOverviewReportsForPollResponseDto,
	IOverviewReportRepository,
} from '../domains';
export class GetOverviewReportsForPollUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class GetOverviewReportsForPollUseCase {
	constructor(
		private readonly overviewReportRepository: IOverviewReportRepository,
	) {}

	async execute(
		input: GetOverviewReportsForPollUseCaseInput,
	): Promise<GetOverviewReportsForPollResponseDto> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is required');
		}

		const result =
			await this.overviewReportRepository.getOverviewReportsForPoll(pollId);

		return {
			message: 'get overview reports successfully',
			overviewReports: result,
		};
	}
}
