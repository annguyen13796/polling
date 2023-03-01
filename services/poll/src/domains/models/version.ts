import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { RECURRENCE_TYPE } from '../../constants';
import { Question } from './question';

export interface VersionProps {
	pollId: string | null | undefined;
	version: string | null | undefined;
	questions?: Question[] | null | undefined;
	createdAt?: string;
	recurrenceType?: RECURRENCE_TYPE;
	activeDate: string;
}

export class Version {
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

	public get recurrenceType() {
		return this.props.recurrenceType;
	}

	public get activeDate() {
		return this.props.activeDate;
	}

	constructor(private readonly props: VersionProps) {
		const {
			createdAt,
			pollId,
			questions,
			version,
			recurrenceType,
			activeDate,
		} = props;

		if (!pollId) {
			throw new BadRequestException(`PollId is null/undefined`);
		}

		if (!questions) {
			this.props.questions = [];
		}

		if (!activeDate) {
			throw new BadRequestException('Active date is null/undefined');
		}

		if (!version) {
			throw new BadRequestException('Version is null/undefined');
		}

		const timestampToMilisecond = moment().valueOf();

		if (!createdAt) {
			this.props.createdAt = moment(timestampToMilisecond).toISOString(true);
		}

		if (!recurrenceType) {
			this.props.recurrenceType = 'NONE';
		}
	}
}
