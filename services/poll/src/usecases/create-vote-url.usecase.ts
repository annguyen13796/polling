import { BadRequestException, NotFoundException } from '@libs/common';
import {
	CreateVoteLinkDto,
	CreateVoteLinkResponseDto,
	IPollRepository,
	IVersionPollRepository,
	Version,
} from '../domains';

export class CreateVoteURLUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly dto: CreateVoteLinkDto,
	) {}
}

export class CreateVoteURLUseCase {
	constructor(
		private readonly pollRepository: IPollRepository,
		private readonly versionPollRepository: IVersionPollRepository,
	) {}

	async execute(
		input: CreateVoteURLUseCaseInput,
	): Promise<CreateVoteLinkResponseDto> {
		const { pollId, dto } = input;

		const { recurrence } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}

		if (!recurrence) {
			throw new BadRequestException('Recurrence is missing');
		}

		if (!recurrence.length) {
			throw new BadRequestException('Recurrence list cannot be empty');
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

		const pollVersion = new Version({
			pollId: existedPoll.id,
			version: String(Number(existedPoll.version) + 1),
			questions: questionsToPackage,
			recurrence: recurrence,
		});

		await this.versionPollRepository.packageQuestionsWithVersion(pollVersion);

		existedPoll.version = pollVersion.version;

		const isNotVoteURLGenerated = !existedPoll.voteLink;
		if (isNotVoteURLGenerated) {
			const voteURL = this.pollRepository.generateVoteURL(existedPoll.id);

			existedPoll.voteLink = voteURL;
			await this.pollRepository.updatePollGeneralInformation(
				existedPoll.id,
				existedPoll.version,
				existedPoll.voteLink,
			);
		}

		await this.pollRepository.updatePollGeneralInformation(
			existedPoll.id,
			existedPoll.version,
		);

		return {
			message: 'Successfully publish poll',
			voteLink: existedPoll.voteLink,
			createdAt: pollVersion.createdAt,
		};
	}
}
