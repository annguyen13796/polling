import { BadRequestException, NotFoundException } from '@libs/common';
import {
	EditPollInformationDto,
	EditPollInformationResponseDto,
	IPollRepository,
} from '..';

export class EditPollInformationUseCaseInput {
	constructor(
		public readonly dto: EditPollInformationDto,
		public readonly pollId: string,
	) {}
}

export class EditPollInformationUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: EditPollInformationUseCaseInput,
	): Promise<EditPollInformationResponseDto> {
		const { dto, pollId } = input;
		const { title, description } = dto;

		const isMissingPollId = !pollId;
		if (isMissingPollId) {
			throw new BadRequestException(`Missing pollId`);
		}

		const isNoThingToUpdate = !title && !description;
		if (isNoThingToUpdate) {
			throw new BadRequestException(`Nothing to update`);
		}

		if (!title) {
			throw new BadRequestException(`Title cannot be blanked`);
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);
		if (!existedPoll) {
			throw new NotFoundException(`Poll with id ${pollId} is not existed`);
		}

		await this.pollRepository.updatePoll(pollId, title, description);

		return { message: 'Update Poll Information successfully' };
	}
}
