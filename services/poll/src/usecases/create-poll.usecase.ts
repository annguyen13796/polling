import { BadRequestException } from '@libs/common';
import { CreatePollDto, CreatePollResponseDto } from '../domains/dtos';
import { Poll } from '../domains/models';
import { IPollRepository } from '../domains/repositories';

export class CreatePollUseCaseInput {
	constructor(public readonly dto: CreatePollDto) {}
}

export class CreatePollUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(input: CreatePollUseCaseInput): Promise<CreatePollResponseDto> {
		const { dto } = input;
		const { creatorEmail, title, description } = dto;

		if (!creatorEmail) {
			throw new BadRequestException('Creator Email cannot be null');
		}

		if (!title) {
			throw new BadRequestException('Title cannot be null');
		}

		const poll = new Poll({
			creatorEmail,
			title,
			description,
		});

		await this.pollRepository.create(poll);

		return { message: 'Create Poll successfully', pollId: poll.id };
	}
}
