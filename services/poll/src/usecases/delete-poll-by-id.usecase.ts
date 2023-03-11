import { BadRequestException, NotFoundException } from '@libs/common';
import { DeletePollByIdResponseDto, IPollRepository } from '../domains';

export class DeletePollByIdUseCaseInput {
	constructor(public readonly pollId: string) {}
}

export class DeletePollByIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: DeletePollByIdUseCaseInput,
	): Promise<DeletePollByIdResponseDto> {
		const { pollId } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);

		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		await this.pollRepository.deletePollById(pollId);

		return { message: `Successfully Delete Poll`, pollId: pollId };
	}
}
