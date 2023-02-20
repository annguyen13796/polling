import { BadRequestException, NotFoundException } from '@libs/common';
import {
	CreateQuestionDto,
	CreateQuestionResponseDto,
	Question,
	IQuestionRepository,
	IPollRepository,
} from '../domains';

export class CreateQuestionUseCaseInput {
	constructor(public readonly dto: CreateQuestionDto) {}
}

export class CreateQuestionUseCase {
	constructor(
		private readonly questionRepository: IQuestionRepository,
		private readonly pollRepository: IPollRepository,
	) {}

	async execute(
		input: CreateQuestionUseCaseInput,
	): Promise<CreateQuestionResponseDto> {
		const { dto } = input;
		const { pollId, content, questionType, isRequired, answers } = dto;

		const isFieldMissing = !pollId || !content || !questionType;

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

			throw new BadRequestException(`Missing ${missingFields.join(', ')}`);
		}

		const isIsRequiredTypeNotMatched = typeof isRequired !== 'boolean';
		if (isIsRequiredTypeNotMatched) {
			throw new BadRequestException('isRequired must be boolean type');
		}

		const isAnswerListEmpty = !answers.length;
		if (isAnswerListEmpty) {
			throw new BadRequestException(`Answer list can not be empty`);
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

		await this.questionRepository.create(newQuestion);

		return { message: 'Create Question successfully' };
	}
}
