import { BadRequestException } from '@libs/common';
import {
	Draft,
	IDraftRepository,
	PutDraftAnswersForQuestionResponseDto,
	PutDraftInformationDto,
} from '../domains';

export class PutDraftInformationUseCaseInput {
	constructor(
		public readonly dto: PutDraftInformationDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly voterEmail: string,
	) {}
}

export class PutDraftInformationUseCase {
	constructor(private readonly draftRepository: IDraftRepository) {}

	async execute(
		input: PutDraftInformationUseCaseInput,
	): Promise<PutDraftAnswersForQuestionResponseDto> {
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
		await this.draftRepository.putDraftInformation(newDraftInformation);
		return { message: 'put draft information successfully' };
	}
}
