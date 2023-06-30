import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, Poll } from '../domains';

export class GetPollByIdUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class GetPollByIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(input: GetPollByIdUseCaseInput): Promise<Poll> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);

		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		return existedPoll;
	}
}
