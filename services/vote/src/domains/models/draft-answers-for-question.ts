import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';

export interface DraftAnswerForQuestionProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	pollRecurrence: string | null | undefined;
	voterEmail: string | null | undefined;
	questionId: string | null | undefined;
	question: string | null | undefined;
	answers: string[] | null | undefined;
}

export class DraftAnswersForQuestion {
	public get pollId() {
		return this.props.pollId;
	}
	public get pollVersion() {
		return this.props.pollVersion;
	}
	public get pollRecurrence() {
		return this.props.pollRecurrence;
	}

	public get voterEmail() {
		return this.props.voterEmail;
	}

	public get questionId() {
		return this.props.questionId;
	}

	public get question() {
		return this.props.question;
	}

	public get answers() {
		return this.props.answers;
	}

	constructor(private readonly props: DraftAnswerForQuestionProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const {
			pollId,
			pollVersion,
			pollRecurrence,
			voterEmail,
			questionId,
			question,
			answers,
		} = props;

		if (isStringEmptyOrUndefined(pollId)) {
			throw new BadRequestException('Poll Id is null/undefined');
		}

		if (isStringEmptyOrUndefined(pollVersion)) {
			throw new BadRequestException('Poll Version is null/undefined');
		}

		if (isStringEmptyOrUndefined(pollRecurrence)) {
			throw new BadRequestException('Poll Recurrence is null/undefined');
		}

		if (isStringEmptyOrUndefined(voterEmail)) {
			throw new BadRequestException('Voter Email is null/undefined');
		}

		if (isStringEmptyOrUndefined(questionId)) {
			throw new BadRequestException('Question Id is null/undefined');
		}

		if (isStringEmptyOrUndefined(question)) {
			throw new BadRequestException('Question is null/undefined');
		}

		if (!answers) {
			throw new BadRequestException('Answers List is null/undefined');
		}
	}
}
