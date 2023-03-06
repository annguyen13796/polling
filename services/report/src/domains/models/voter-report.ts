import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';

export interface VoterReportProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	pollRecurrence: string | null | undefined;
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
	public get pollRecurrence() {
		return this.props.pollRecurrence;
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
			pollRecurrence,
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

		if (isStringEmptyOrUndefined(pollRecurrence)) {
			throw new BadRequestException('Poll Recurrence is null/undefined');
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
