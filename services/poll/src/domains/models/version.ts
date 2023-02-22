import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { Question } from './question';

export interface VersionProps {
	pollId: string | null | undefined;
	version: string | null | undefined;
	questions?: Question[] | null | undefined;
	createdAt?: string;
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

	constructor(private readonly props: VersionProps) {
		const { createdAt, pollId, questions, version } = props;

		if (!pollId) {
			throw new BadRequestException(`PollId is null/undefined`);
		}

		if (!questions.length) {
			throw new BadRequestException(`Questions is empty`);
		}

		if (!version) {
			throw new BadRequestException('Version is null/undefined');
		}

		if (!createdAt) {
			const timestampToMilisecond = moment().valueOf();

			this.props.createdAt = moment(timestampToMilisecond).toISOString(true);
		}
	}
}
