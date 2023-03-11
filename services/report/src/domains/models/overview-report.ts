import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';
import { STATUS_TYPE } from '../../constants';
import { AnswerReport } from './answer-report';

export interface OverviewReportProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	startDate: string | null | undefined;
	endDate: string | null | undefined;
	status: STATUS_TYPE | null | undefined;
	participants: string[] | null | undefined;
	answerReports?: AnswerReport[];
}

export class OverviewReport {
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

	public get status() {
		return this.props.status;
	}
	public get participants() {
		return this.props.participants;
	}

	public updateStatus(status: STATUS_TYPE) {
		if (status !== 'CLOSED' && status !== 'IN PROGRESS') {
			throw new BadRequestException('new status type is invalid');
		}
		this.props.status = status;
	}
	public updateParticipants(participantEmail: string) {
		if (isStringEmptyOrUndefined(participantEmail)) {
			throw new BadRequestException('Participant Email is null/undefined');
		}
		const isExistedEmail =
			this.props.participants.findIndex(
				(element) => element === participantEmail,
			) !== -1;
		if (isExistedEmail) {
			throw new BadRequestException('Participant Email is existed');
		}
		this.props.participants.push(participantEmail);
	}

	constructor(private readonly props: OverviewReportProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const { pollId, pollVersion, startDate, endDate, status, participants } =
			props;

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

		if (!status) {
			this.props.status = 'IN PROGRESS';
		}
		if (!participants) {
			this.props.participants = [];
		}
	}
}
