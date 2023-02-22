import { BadRequestException, NotFoundException } from '@libs/common';
import {
	IPollRepository,
	EditQuestionResponseDto,
	EditQuestionDto,
} from '../domains';

export class EditQuestionUseCaseInput {
	constructor(
		public readonly dto: EditQuestionDto,
		public readonly pollId: string,
		public readonly questionId: string,
	) {}
}

export class EditQuestionUseCase {
	constructor(private readonly pollRepository: IPollRepository) {}

	async execute(
		input: EditQuestionUseCaseInput,
	): Promise<EditQuestionResponseDto> {
		const { dto, pollId, questionId } = input;
		const { content, questionType, isRequired, answers } = dto;

		const isMissingFields = !pollId || !content || !questionType || !answers;

		if (isMissingFields) {
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

		const isEmptyAnswers = !answers.length;
		const isNotTextBoxType = !(questionType === 'TEXT_BOX');

		if (isEmptyAnswers && isNotTextBoxType) {
			throw new BadRequestException(
				`Answer list of this question type can not be empty`,
			);
		}

		const hasNoPollMatchPollId = !(await this.pollRepository.findPollById(
			pollId,
		));
		if (hasNoPollMatchPollId) {
			throw new NotFoundException(`Poll with id ${pollId} is not existed`);
		}
		const question =
			await this.pollRepository.findQuestionByPollIdAndQuestionId(
				pollId,
				questionId,
			);
		if (!question) {
			throw new NotFoundException(
				`Question with id ${questionId} is not existed`,
			);
		}
		question.updateContent(content);
		question.updateQuestionType(questionType);
		question.updateAnswers(answers);
		question.updateIsRequired(isRequired);

		await this.pollRepository.updateQuestionGeneralInformation(question);

		return { message: 'Edit Question successfully' };
	}
}
