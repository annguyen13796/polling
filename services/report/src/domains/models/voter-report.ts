import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';

export interface VoterReportProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	startDate: string | null | undefined;
	endDate: string | null | undefined;
	questionId: string | null | undefined;
	answer: string | null | undefined;
	voterEmail: string | null | undefined;
}

export class VoterReport {
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
	public get questionId() {
		return this.props.questionId;
	}
	public get answer() {
		return this.props.answer;
	}
	public get voterEmail() {
		return this.props.voterEmail;
	}

	constructor(private readonly props: VoterReportProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const {
			pollId,
			pollVersion,
			startDate,
			endDate,
			questionId,
			answer,
			voterEmail,
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

		if (isStringEmptyOrUndefined(questionId)) {
			throw new BadRequestException('Question Id is null/undefined');
		}

		if (isStringEmptyOrUndefined(voterEmail)) {
			throw new BadRequestException('Voter Email is null/undefined');
		}

		if (isStringEmptyOrUndefined(answer)) {
			throw new BadRequestException('Answer is null/undefined');
		}
	}
}
