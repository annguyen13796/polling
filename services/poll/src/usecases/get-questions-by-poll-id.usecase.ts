import { BadRequestException, NotFoundException } from '@libs/common';
import { Question } from '../domains';
import { IPollRepository } from '../domains/repositories';

export class GetQuestionsByPollIdUseCaseInput {
	constructor(public readonly inputPollId: string) {}
}

export class GetQuestionsByPollIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(input: GetQuestionsByPollIdUseCaseInput): Promise<Question[]> {
		const { inputPollId } = input;
		if (!inputPollId) {
			throw new BadRequestException('Poll ID is required');
		}

		const isPollExisted = await this.pollRepository.findPollById(inputPollId);
		if (isPollExisted === null) {
			throw new NotFoundException(`Poll with id ${inputPollId} is not existed`);
		}

		const result = await this.pollRepository.getQuestionsByPollId(inputPollId);

		return result;
	}
}
