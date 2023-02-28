import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, IVersionPollRepository, Version } from '../domains';

export class GetLatestVersionUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class GetLatestVersionUseCase {
	constructor(
		private readonly pollRepository: IPollRepository,
		private readonly versionPollRepository: IVersionPollRepository,
	) {}

	async execute(input: GetLatestVersionUseCaseInput): Promise<Version> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('PollId is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);
		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		const versionInformation =
			await this.versionPollRepository.getLatestVersionInformation(
				existedPoll.id,
				existedPoll.version,
			);

		if (versionInformation === null) {
			throw new BadRequestException(
				'This Poll that have not been published yet',
			);
		}

		const questionsByLatestVersion =
			await this.versionPollRepository.getQuestionsByLatestVersion(
				existedPoll.id,
				existedPoll.version,
			);

		if (questionsByLatestVersion === null) {
			throw new BadRequestException('Invalid Poll with no questions');
		}

		const version = new Version({
			pollId: versionInformation.pollId,
			version: versionInformation.version,
			activeDate: versionInformation.activeDate,
			createdAt: versionInformation.createdAt,
			recurrenceType: versionInformation.recurrenceType,
			questions: questionsByLatestVersion,
		});

		return version;
	}
}
