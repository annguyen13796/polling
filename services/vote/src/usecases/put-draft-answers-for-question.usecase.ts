import { BadRequestException } from '@libs/common';
import {
	DraftAnswersForQuestion,
	IDraftRepository,
	PutDraftAnswersForQuestionDto,
	PutDraftAnswersForQuestionResponseDto,
} from '../domains';

export class PutDraftAnswersForQuestionUseCaseInput {
	constructor(
		public readonly dto: PutDraftAnswersForQuestionDto,
		public readonly pollId: string,
		public readonly pollVersion: string,
		public readonly startDate: string,
		public readonly endDate: string,
		public readonly voterEmail: string,
		public readonly questionId: string,
	) {}
}

export class PutDraftAnswersForQuestionUseCase {
	constructor(private readonly draftRepository: IDraftRepository) {}

	async execute(
		input: PutDraftAnswersForQuestionUseCaseInput,
	): Promise<PutDraftAnswersForQuestionResponseDto> {
		const {
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
			questionId,
		} = input;
		const { answers, question } = dto;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}
		if (!pollVersion) {
			throw new BadRequestException('Poll Version is missing');
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

		if (!questionId) {
			throw new BadRequestException('Question Id is missing');
		}

		if (!question) {
			throw new BadRequestException('Question is missing');
		}

		if (!answers) {
			throw new BadRequestException('Answers List is missing');
		}

		const newDraftAnswersForQuestion = new DraftAnswersForQuestion({
			pollId: pollId,
			pollVersion: pollVersion,
			startDate: startDate,
			endDate: endDate,
			voterEmail: voterEmail,
			questionId: questionId,
			question: question,
			answers: answers,
		});

		await this.draftRepository.putDraftAnswersForQuestion(
			newDraftAnswersForQuestion,
		);
		return { message: 'put draft answers for question successfully' };
	}
}
