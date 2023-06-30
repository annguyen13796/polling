import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';
import { QUESTION_TYPE } from '../../constants';
import { VoterReport } from './voter-report';

export interface AnswerReportProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	startDate: string | null | undefined;
	endDate: string | null | undefined;
	questionId: string | null | undefined;
	question: string | null | undefined;
	answer: string | null | undefined;
	numberOfVoter: number | null | undefined;
	voterReports?: VoterReport[];
	questionType: QUESTION_TYPE | null | undefined;
}
export class AnswerReport {
	public get pollId() {
		return this.props.pollId;
	}

	public get pollVersion() {
		return this.props.pollVersion;
	}

	public get startDate() {
		return this.props.startDate;
	}
	public get endDate() {
		return this.props.endDate;
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

	public get questionType() {
		return this.props.questionType;
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
			startDate,
			endDate,
			questionId,
			question,
			answer,
			numberOfVoter,
			questionType,
		} = props;

		if (isStringEmptyOrUndefined(pollId)) {
			throw new BadRequestException('Poll Id is null/undefined');
		}

		if (isStringEmptyOrUndefined(pollVersion)) {
			throw new BadRequestException('Poll Version is null/undefined');
		}

		if (isStringEmptyOrUndefined(startDate)) {
			throw new BadRequestException('Start Date is null/undefined');
		}

		if (isStringEmptyOrUndefined(endDate)) {
			throw new BadRequestException('End Date is null/undefined');
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
		if (!questionType) {
			throw new BadRequestException('Question Type is null/undefined');
		}
	}
}
