import { BadRequestException, NotFoundException } from '@libs/common';
import {
	CreateQuestionDto,
	CreateQuestionResponseDto,
	Question,
	IPollRepository,
} from '../domains';

export class CreateQuestionUseCaseInput {
	constructor(
		public readonly dto: CreateQuestionDto,
		public readonly pollId: string,
	) {}
}

export class CreateQuestionUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: CreateQuestionUseCaseInput,
	): Promise<CreateQuestionResponseDto> {
		const { dto, pollId } = input;
		const { content, questionType, isRequired, answers } = dto;

		const isFieldMissing = !pollId || !content || !questionType || !answers;

		if (isFieldMissing) {
			const missingFields: string[] = [];

			if (!pollId) {
				missingFields.push('pollId');
			}

			if (!content) {
				missingFields.push('content');
			}

			if (!questionType) {
				missingFields.push('questionType');
			}

			if (!answers) {
				missingFields.push('answers');
			}

			throw new BadRequestException(`Missing ${missingFields.join(', ')}`);
		}

		const isIsRequiredTypeNotMatched = typeof isRequired !== 'boolean';
		if (isIsRequiredTypeNotMatched) {
			throw new BadRequestException('isRequired must be boolean type');
		}

		const isAnswerListEmpty = !answers.length;
		const notHasTextBoxType = !(questionType === 'TEXT_BOX');

		if (isAnswerListEmpty && notHasTextBoxType) {
			throw new BadRequestException(
				`Answer list of this question type can not be empty`,
			);
		}

		const isPollExisted = await this.pollRepository.findPollById(pollId);
		if (isPollExisted === null) {
			throw new NotFoundException(`Poll with id ${pollId} is not existed`);
		}

		const newQuestion = new Question({
			pollId,
			content,
			questionType,
			isRequired,
			answers,
		});

		await this.pollRepository.createQuestion(newQuestion);
		return {
			message: 'Create Question successfully',
			questionId: newQuestion.questionId,
		};
	}
}
