import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { Question } from './question';

export interface VersionProps {
	pollId: string | null | undefined;
	version: string | null | undefined;
	questions?: Question[] | null | undefined;
	createdAt?: string;
	recurrence: string[] | null | undefined;
}

export class Version {
	public get version() {
		return this.props.version;
	}

	public get questions() {
		return this.props.questions;
	}

	public get createdAt() {
		return this.props.createdAt;
	}

	public get pollId() {
		return this.props.pollId;
	}

	public get recurrence() {
		return this.props.recurrence;
	}

	constructor(private readonly props: VersionProps) {
		const { createdAt, pollId, questions, version, recurrence } = props;

		if (!pollId) {
			throw new BadRequestException(`PollId is null/undefined`);
		}

		if (!questions.length) {
			throw new BadRequestException(`Questions is empty`);
		}

		if (!version) {
			throw new BadRequestException('Version is null/undefined');
		}

		const timestampToMilisecond = moment().valueOf();
		if (!createdAt) {
			this.props.createdAt = moment(timestampToMilisecond).toISOString(true);
		}

		if (!recurrence) {
			throw new BadRequestException('Recurrence is null/undefined');
		}

		if (!recurrence.length) {
			throw new BadRequestException('Recurrence list is empty');
		}
	}
}
