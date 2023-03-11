import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetLatestReleaseResponseDto,
	IPollRepository,
	IReleasedPollRepository,
	ReleasedPoll,
} from '../domains';

export class GetLatestReleaseUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class GetLatestReleaseUseCase {
	constructor(
		private readonly pollRepository: IPollRepository,
		private readonly releasedPollRepository: IReleasedPollRepository,
	) {}

	async execute(
		input: GetLatestReleaseUseCaseInput,
	): Promise<GetLatestReleaseResponseDto> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('PollId is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);
		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		const latestReleasedPollInformation =
			await this.releasedPollRepository.getLatestReleaseInformation(
				existedPoll.id,
				existedPoll.version,
			);

		if (latestReleasedPollInformation === null) {
			throw new BadRequestException(
				'This Poll that have not been published yet',
			);
		}

		const questionsByLatestReleasesPoll =
			await this.releasedPollRepository.getQuestionsOfLatestRelease(
				existedPoll.id,
				existedPoll.version,
			);

		if (questionsByLatestReleasesPoll === null) {
			throw new BadRequestException('Invalid Poll with no questions');
		}

		const releasedPoll = new ReleasedPoll({
			pollId: latestReleasedPollInformation.pollId,
			version: latestReleasedPollInformation.version,
			createdAt: latestReleasedPollInformation.createdAt,
			startDate: latestReleasedPollInformation.startDate,
			endDate: latestReleasedPollInformation.endDate,
			questions: questionsByLatestReleasesPoll,
		});

		return {
			message: 'Successfully get latest release',
			latestRelease: releasedPoll,
		};
	}
}
