import { BadRequestException, NotFoundException } from '@libs/common';
import { DeleteQuestionResponseDto, IPollRepository } from '../domains';

export class DeleteQuestionByIdUseCaseInput {
	constructor(
		public readonly pollId: string,
		public readonly questionId: string,
	) {}
}

export class DeleteQuestionByIdUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: DeleteQuestionByIdUseCaseInput,
	): Promise<DeleteQuestionResponseDto> {
		const { pollId, questionId } = input;

		if (!pollId) {
			throw new BadRequestException('Poll Id is missing');
		}
		if (!questionId) {
			throw new BadRequestException('Question Id is missing');
		}

		const existedPoll = await this.pollRepository.findPollById(pollId);

		if (existedPoll === null) {
			throw new NotFoundException('Poll is not existed');
		}

		const isDeleted = await this.pollRepository.deleteQuestionById(
			pollId,
			questionId,
		);

		if (isDeleted === false) {
			throw new NotFoundException('Question is not existed');
		}

		return {
			message: `Successfully Delete Question`,
			questionId: questionId,
		};
	}
}
