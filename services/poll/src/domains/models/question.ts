import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';
import moment from 'moment';
import { QUESTION_TYPE } from '../../constants';

export interface QuestionProps {
	pollId: string | null | undefined;
	questionId?: string;
	content: string | null | undefined;
	questionType: QUESTION_TYPE | null | undefined;
	isRequired: boolean;
	answers: string[];
}

export class Question {
	public get content() {
		return this.props.content;
	}
	public get questionType() {
		return this.props.questionType;
	}

	public get isRequired() {
		return this.props.isRequired;
	}

	public get answers() {
		return this.props.answers;
	}

	public get questionId() {
		return this.props.questionId;
	}

	public get pollId() {
		return this.props.pollId;
	}

	constructor(private readonly props: QuestionProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const { questionId, pollId, questionType, answers, content, isRequired } =
			props;

		if (isStringEmptyOrUndefined(pollId)) {
			throw new BadRequestException('PollId is null/undefined');
		}

		if (isStringEmptyOrUndefined(questionType)) {
			throw new BadRequestException('Question type is null/undefined');
		}

		if (!answers.length && questionType !== 'TEXT_BOX') {
			throw new BadRequestException('Answer list is empty');
		}

		if (isStringEmptyOrUndefined(content)) {
			throw new BadRequestException('Question content is null/undefined');
		}

		if (typeof isRequired !== 'boolean') {
			throw new BadRequestException('isRequired must be in boolean type');
		}

		if (!questionId) {
			this.props.questionId = String(moment().valueOf());
		}
	}

	public updateContent(newContent: string): void {
		if (newContent) {
			this.props.content = newContent;
		}
	}
	public updateQuestionType(newQuestionType: QUESTION_TYPE): void {
		if (newQuestionType) {
			this.props.questionType = newQuestionType;
		}
	}
	public updateIsRequired(newIsRequiredValue: boolean): void {
		this.props.isRequired = newIsRequiredValue;
	}
	public updateAnswers(newAnswers: string[]): void {
		if (newAnswers) {
			this.props.answers = newAnswers;
		}
	}
}
