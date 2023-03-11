import { BadRequestException } from '@libs/common';
import { GetDraftAnswersResponseDto, IDraftRepository } from '../domains';

export class GetDraftAnswersUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly voterEmail: string,
	) {}
}

export class GetDraftAnswersUseCase {
	constructor(private readonly draftRepository: IDraftRepository) {}

	async execute(
		input: GetDraftAnswersUseCaseInput,
	): Promise<GetDraftAnswersResponseDto> {
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

		const draftInformationObject =
			await this.draftRepository.getDraftInformation(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);
		if (draftInformationObject && draftInformationObject.hasBeenSubmitted) {
			throw new BadRequestException('You have already voted');
		}
		const draftAnswersForUser = await this.draftRepository.getDraftAnswers(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		return {
			message: 'get draft answers successfully',
			draftAnswers: draftAnswersForUser,
		};
	}
}
