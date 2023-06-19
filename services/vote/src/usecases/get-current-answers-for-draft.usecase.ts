import { BadRequestException } from '@libs/common';
import {
	GetCurrentAnswersForDraftResponseDto,
	IDraftRepository,
} from '../domains';

export class GetCurrentAnswersForDraftUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly voterEmail: string,
	) {}
}

export class GetCurrentAnswersForDraftUseCase {
	constructor(private readonly draftRepository: IDraftRepository) {}

	async execute(
		input: GetCurrentAnswersForDraftUseCaseInput,
	): Promise<GetCurrentAnswersForDraftResponseDto> {
		const { pollId, pollVersion, startDate, endDate, voterEmail } = input;

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

		const existedDraft = await this.draftRepository.getDraft(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		if (existedDraft && existedDraft.hasBeenSubmitted) {
			throw new BadRequestException('You have already voted');
		}
		const currentAnswersForDraft =
			await this.draftRepository.getCurrentAnswersForDraft(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);
		return {
			message: 'get draft answers successfully',
			draftAnswers: currentAnswersForDraft,
		};
	}
}
