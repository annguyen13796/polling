import { BadRequestException, NotFoundException } from '@libs/common';
import {
	IPollRepository,
	IReleasedPollRepository,
	ReleasedPoll,
	ReleasePollDto,
	ReleasePollResponseDto,
} from '../domains';

export class ReleasePollUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly dto: ReleasePollDto,
	) {}
}

export class ReleasePollUseCase {
	constructor(
		private readonly pollRepository: IPollRepository,
		private readonly releasedPollRepository: IReleasedPollRepository,
	) {}

	async execute(
		input: ReleasePollUseCaseInput,
	): Promise<ReleasePollResponseDto> {
		const { pollId, dto } = input;
		const { startDate, endDate } = dto;

		if (!pollId) {
			throw new BadRequestException('PollId is missing');
		}

		const isMissingFields = !startDate || !endDate;

		if (isMissingFields) {
			const missingFields: string[] = [];

			if (!startDate) {
				missingFields.push('startDate');
			}

			if (!endDate) {
				missingFields.push('endDate');
			}

			throw new BadRequestException(`Missing ${missingFields.join(', ')}`);
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);
		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		const questionsToPackage = await this.pollRepository.getQuestionsByPollId(
			existedPoll.id,
		);
		if (questionsToPackage === null) {
			throw new BadRequestException('No questions provided');
		}

		const releasedPoll = new ReleasedPoll({
			pollId: existedPoll.id,
			version: String(Number(existedPoll.latestVersion) + 1),
			questions: questionsToPackage,
			startDate: startDate,
			endDate: endDate,
		});

		await this.releasedPollRepository.packageQuestionsWithReleasedPoll(
			releasedPoll,
		);

		existedPoll.updateLatestVersion(releasedPoll.version);

		// TODO: Check grammar
		const isNotVoteLinkGenerated = !existedPoll.voteLink;
		if (isNotVoteLinkGenerated) {
			const newVoteLink = existedPoll.generateVoteLink(existedPoll.id);

			existedPoll.setVoteLink(newVoteLink);
		}

		await this.pollRepository.updatePoll(existedPoll);

		return {
			message: 'Successfully release new version',
			voteLink: existedPoll.voteLink,
			version: existedPoll.latestVersion,
			startDate: releasedPoll.startDate,
			endDate: releasedPoll.endDate,
		};
	}
}
