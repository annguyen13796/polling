import { BadRequestException, NotFoundException } from '@libs/common';
import {
	DeletePollByIdResponseDto,
	DeletePollDto,
	IPollRepository,
} from '../domains';

export class DeletePollByIdUseCaseInput {
	constructor(public readonly dto: DeletePollDto) {}
}

export class DeletePollByIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: DeletePollByIdUseCaseInput,
	): Promise<DeletePollByIdResponseDto> {
		const { dto } = input;
		const { pollId } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}

		const isPollExisted = await this.pollRepository.findPollById(pollId);

		if (isPollExisted === null) {
			throw new NotFoundException('Poll is not existed');
		}

		await this.pollRepository.deletePollById(pollId);

		return { message: `Successfully Delete Poll`, pollId: pollId };
	}
}
