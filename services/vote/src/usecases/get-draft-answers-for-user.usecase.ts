import { BadRequestException } from '@libs/common';
import {
	DraftAnswersForQuestion,
	IDraftAnswersForQuestionRepository,
} from '../domains';

export class GetDraftAnswersForUserUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly pollRecurrence: string,
		public readonly voterEmail: string,
	) {}
}

export class GetDraftAnswersForUserUseCase {
	constructor(
		private readonly draftAnswersForQuestionRepository: IDraftAnswersForQuestionRepository,
	) {}

	async execute(
		input: GetDraftAnswersForUserUseCaseInput,
	): Promise<DraftAnswersForQuestion[]> {
		const { pollId, pollVersion, pollRecurrence, voterEmail } = input;

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

		const finishedVotingObject =
			await this.draftAnswersForQuestionRepository.getGeneralVotingStatusOfUser(
				pollId,
				pollVersion,
				pollRecurrence,
				voterEmail,
			);
		if (finishedVotingObject && finishedVotingObject.finishVoting) {
			throw new BadRequestException('You have already voted');
		}
		const draftAnswersForUser =
			await this.draftAnswersForQuestionRepository.getDraftAnswersForUser(
				pollId,
				pollVersion,
				pollRecurrence,
				voterEmail,
			);
		return draftAnswersForUser;
	}
}
