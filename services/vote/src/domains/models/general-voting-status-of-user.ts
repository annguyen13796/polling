import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';

export interface GeneralVotingStatusOfUserProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	pollRecurrence: string | null | undefined;
	voterEmail: string | null | undefined;
	finishVoting: boolean | null | undefined;
}

export class GeneralVotingStatusOfUser {
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

	public get finishVoting() {
		return this.props.finishVoting;
	}

	constructor(private readonly props: GeneralVotingStatusOfUserProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const { pollId, pollVersion, pollRecurrence, voterEmail, finishVoting } =
			props;

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

		if (typeof finishVoting !== 'boolean') {
			throw new BadRequestException('FinishVoting status is null/undefined');
		}
	}
}
