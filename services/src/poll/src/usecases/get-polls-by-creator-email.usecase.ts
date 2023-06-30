import { BadRequestException, NotFoundException } from '@libs/common';
import {
	GetPollsByCreatorEmailDto,
	GetPollsByCreatorEmailResponseDto,
} from '../domains';
import { IPollRepository } from '../domains/repositories';

export class GetPollsByCreatorEmailUseCaseInput {
	constructor(public readonly dto: GetPollsByCreatorEmailDto) {}
}

export class GetPollsByCreatorEmailUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: GetPollsByCreatorEmailUseCaseInput,
	): Promise<GetPollsByCreatorEmailResponseDto> {
		const { dto } = input;

		const { creatorEmail, limit, lastPollId } = dto;

		if (!creatorEmail) {
			throw new BadRequestException('Email is required');
		}

		if (!limit) {
			throw new BadRequestException('Limit is required for pagination');
		}

		if (lastPollId) {
			const isLastPollExisted = await this.pollRepository.findPollById(
				lastPollId,
			);

			if (isLastPollExisted === null) {
				throw new NotFoundException(
					`Last Poll with id ${lastPollId} is not existed`,
				);
			}
		}

		const result = await this.pollRepository.getPollsByCreatorEmail(
			creatorEmail,
			limit,
			lastPollId,
		);

		return result;
	}
}
