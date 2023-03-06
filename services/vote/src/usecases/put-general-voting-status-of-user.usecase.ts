import { BadRequestException } from '@libs/common';
import {
	GeneralVotingStatusOfUser,
	IDraftAnswersForQuestionRepository,
	PutDraftAnswersForQuestionResponseDto,
	PutGeneralVotingStatusOfUserDto,
} from '../domains';

export class PutGeneralVotingStatusOfUserUseCaseInput {
	constructor(
		public readonly dto: PutGeneralVotingStatusOfUserDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly pollRecurrence: string,
		public readonly voterEmail: string,
	) {}
}

export class PutGeneralVotingStatusOfUserUseCase {
	constructor(
		private readonly draftAnswersForQuestionRepository: IDraftAnswersForQuestionRepository,
	) {}

	async execute(
		input: PutGeneralVotingStatusOfUserUseCaseInput,
	): Promise<PutDraftAnswersForQuestionResponseDto> {
		const { dto, pollId, pollVersion, pollRecurrence, voterEmail } = input;
		const { finishVoting } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}
		if (!pollVersion) {
			throw new BadRequestException('Version is missing');
		}

		if (!pollRecurrence) {
			throw new BadRequestException('Date is missing');
		}

		if (!voterEmail) {
			throw new BadRequestException('Voter Email is missing');
		}
		const newGeneralVotingStatusOfUser = new GeneralVotingStatusOfUser({
			pollId: pollId,
			pollVersion: pollVersion,
			pollRecurrence: pollRecurrence,
			voterEmail: voterEmail,
			finishVoting: finishVoting,
		});
		await this.draftAnswersForQuestionRepository.putGeneralVotingStatusOfUser(
			newGeneralVotingStatusOfUser,
		);
		return { message: 'put general voting status of user successfully' };
	}
}
