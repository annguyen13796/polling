import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetQuestionsByLatestVersionResponse,
	IPollRepository,
	IVersionPollRepository,
} from '../domains';

export class GetQuestionByLatestVersionUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class GetQuestionByLatestVersionUseCase {
	constructor(
		private readonly pollRepository: IPollRepository,
		private readonly versionPollRepository: IVersionPollRepository,
	) {}

	async execute(
		input: GetQuestionByLatestVersionUseCaseInput,
	): Promise<GetQuestionsByLatestVersionResponse> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('PollId is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);
		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		const questions =
			await this.versionPollRepository.getQuestionsByLatestVersion(
				existedPoll.id,
				existedPoll.version,
			);

		if (questions === null) {
			throw new NotFoundException('Invalid Poll with no questions');
		}

		return {
			questions: questions,
			version: existedPoll.version,
		};
	}
}
