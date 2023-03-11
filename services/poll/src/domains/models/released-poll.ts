import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { Question } from './question';

export interface ReleasedPollProps {
	pollId: string | null | undefined;
	version: string | null | undefined;
	questions?: Question[] | null | undefined;
	createdAt?: string;
	startDate: string | null | undefined;
	endDate: string | null | undefined;
}

export class ReleasedPoll {
	public get version() {
		return this.props.version;
	}

	public get questions() {
		return this.props.questions;
	}
	public set questions(questions: Question[]) {
		this.props.questions = questions;
	}

	public get createdAt() {
		return this.props.createdAt;
	}

	public get pollId() {
		return this.props.pollId;
	}

	public get startDate() {
		return this.props.startDate;
	}

	public get endDate() {
		return this.props.endDate;
	}

	constructor(private readonly props: ReleasedPollProps) {
		const { createdAt, pollId, questions, version, startDate, endDate } = props;

		if (!pollId) {
			throw new BadRequestException(`PollId is null/undefined`);
		}

		if (!questions) {
			this.props.questions = [];
		}

		if (!startDate) {
			throw new BadRequestException('Start date is null/undefined');
		}

		if (!endDate) {
			throw new BadRequestException('End date is null/undefined');
		}

		if (!version) {
			throw new BadRequestException('Version is null/undefined');
		}

		const timestampToMillisecond = moment().valueOf();

		if (!createdAt) {
			this.props.createdAt = moment(timestampToMillisecond).toISOString(true);
		}
	}
}
