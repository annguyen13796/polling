import { isStringEmptyOrUndefined, BadRequestException } from '@libs/common';
import moment from 'moment';
import { POLL_STATUS } from '../../constants';
import { Question } from './question';

export interface PollProps {
	creatorEmail: string | null | undefined;
	title: string | null | undefined;
	description: string | null | undefined;
	createdAt?: string;
	questions?: Question[];
	id?: string;
	version?: string;
	status?: POLL_STATUS;
	voteLink?: string;
}

export class Poll {
	public get creatorEmail() {
		return this.props.creatorEmail;
	}
	public get title() {
		return this.props.title;
	}
	public get description() {
		return this.props.description;
	}
	public get createdAt() {
		return this.props.createdAt;
	}

	public get version() {
		return this.props.version;
	}

	public set version(ver) {
		this.props.version = ver;
	}

	public get questions() {
		return this.props.questions;
	}

	public set questions(listQuestion: Question[]) {
		this.props.questions = listQuestion;
	}

	public get id() {
		return this.props.id;
	}

	public get status() {
		return this.props.status;
	}

	public get voteLink() {
		return this.props.voteLink;
	}

	public set voteLink(url: string) {
		this.props.voteLink = url;
	}

	constructor(private readonly props: PollProps) {
		if (!props) {
			throw new BadRequestException('Props of poll is null/undefined');
		}
		const {
			creatorEmail,
			description,
			title,
			createdAt,
			id,
			version,
			status,
			questions,
			voteLink,
		} = props;

		if (isStringEmptyOrUndefined(creatorEmail)) {
			throw new BadRequestException('Creator email is null/undefined');
		}

		if (isStringEmptyOrUndefined(title)) {
			throw new BadRequestException('Poll title is null/undefined');
		}

		if (isStringEmptyOrUndefined(description)) {
			this.props.description = null;
		}

		const timestampToMillisecond = moment().valueOf();

		if (isStringEmptyOrUndefined(createdAt)) {
			this.props.createdAt = moment(timestampToMillisecond).toISOString(true);
		}

		if (!id) {
			this.props.id = String(timestampToMillisecond);
		}

		if (!version) {
			this.props.version = '0';
		}

		if (!questions) {
			this.props.questions = [];
		}

		if (!status) {
			this.props.status = 'IDLE';
		}

		if (!voteLink) {
			this.props.voteLink = '';
		}
	}
}
