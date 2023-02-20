import { BadRequestException, NotFoundException } from '@libs/common';
import { GetPollByIdDto, Question } from '../domains';
import { IPollRepository } from '../domains/repositories';

export class GetQuestionsByPollIdUseCaseInput {
	constructor(public readonly dto: GetPollByIdDto) {}
}

export class GetQuestionsByPollIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(input: GetQuestionsByPollIdUseCaseInput): Promise<Question[]> {
		const {
			dto: { pollId: pollId },
		} = input;
		if (!pollId) {
			throw new BadRequestException('Poll ID is required');
		}

		const isPollExisted = await this.pollRepository.findPollById(pollId);
		if (isPollExisted === null) {
			throw new NotFoundException(`Poll with id ${pollId} is not existed`);
		}

		const result = await this.pollRepository.getQuestionsByPollId(pollId);

		return result;
	}
}
