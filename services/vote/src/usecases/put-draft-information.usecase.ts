import { BadRequestException } from '@libs/common';
import {
	Draft,
	IDraftRepository,
	PutDraftDto,
	PutDraftResponseDto,
} from '../domains';

export class PutDraftUseCaseInput {
	constructor(
		public readonly dto: PutDraftDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly voterEmail: string,
	) {}
}

export class PutDraftUseCase {
	constructor(private readonly draftRepository: IDraftRepository) {}

	async execute(input: PutDraftUseCaseInput): Promise<PutDraftResponseDto> {
		const { dto, pollId, pollVersion, startDate, endDate, voterEmail } = input;
		const { hasBeenSubmitted } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}
		if (!pollVersion) {
			throw new BadRequestException('Version is missing');
		}

		if (!startDate) {
			throw new BadRequestException('Start Date is missing');
		}

		if (!endDate) {
			throw new BadRequestException('End Date is missing');
		}
		if (!voterEmail) {
			throw new BadRequestException('Voter Email is missing');
		}
		const newDraftInformation = new Draft({
			pollId: pollId,
			pollVersion: pollVersion,
			startDate: startDate,
			endDate: endDate,
			voterEmail: voterEmail,
			hasBeenSubmitted: hasBeenSubmitted,
		});
		await this.draftRepository.putDraft(newDraftInformation);
		return { message: 'put draft information successfully' };
	}
}
