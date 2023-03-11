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

		const isMissingFields = !creatorEmail || !title;

		if (isMissingFields) {
			const missingFields: string[] = [];
			if (!creatorEmail) {
				missingFields.push('creatorEmail');
			}

			if (!title) {
				missingFields.push('title');
			}

			throw new BadRequestException(`Missing ${missingFields.join(', ')}`);
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
