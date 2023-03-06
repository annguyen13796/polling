import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';

export interface AnswerReportProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	pollRecurrence: string | null | undefined;
	questionId: string | null | undefined;
	question: string | null | undefined;
	answer: string | null | undefined;
	numberOfVoter: number | null | undefined;
}
export class AnswerReport {
	public get pollId() {
		return this.props.pollId;
	}
	public get pollVersion() {
		return this.props.pollVersion;
	}
	public get pollRecurrence() {
		return this.props.pollRecurrence;
	}

	public get numberOfVoter() {
		return this.props.numberOfVoter;
	}

	public get questionId() {
		return this.props.questionId;
	}

	public get question() {
		return this.props.question;
	}

	public get answer() {
		return this.props.answer;
	}

	public increaseNumberOfVoterBy(value: number) {
		this.props.numberOfVoter = this.props.numberOfVoter + value;
	}
	constructor(private readonly props: AnswerReportProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const {
			pollId,
			pollVersion,
			pollRecurrence,
			questionId,
			question,
			answer,
			numberOfVoter,
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

		if (typeof numberOfVoter !== 'number') {
			throw new BadRequestException('Number Of Voter is null/undefined');
		}
		if (numberOfVoter < 0) {
			throw new BadRequestException("Number Of Voter can't be negative");
		}

		if (isStringEmptyOrUndefined(questionId)) {
			throw new BadRequestException('Question Id is null/undefined');
		}

		if (isStringEmptyOrUndefined(question)) {
			throw new BadRequestException('Question is null/undefined');
		}

		if (isStringEmptyOrUndefined(answer)) {
			throw new BadRequestException('Answer is null/undefined');
		}
	}
}
