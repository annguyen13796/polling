import { isStringEmptyOrUndefined, BadRequestException } from '@libs/common';
import moment from 'moment';
import { POLL_STATUS } from '../../constants';
import { Question } from './question';
import { ReleasedPoll } from './released-poll';

export interface PollProps {
	// TODO: creatorEmail should be owner/ type can be a sub entity
	creatorEmail: string | null | undefined;
	title: string | null | undefined;
	description: string | null | undefined;
	createdAt?: string;
	id?: string;
	latestVersion?: string;
	// TODO: change the naming convention of line bellow
	status?: POLL_STATUS;
	voteLink?: string;
	questions?: Question[];
	// TODO: remove this line bellow
	releases?: ReleasedPoll[];
	// TODO: add meta data (updateAt and version)
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

	public get latestVersion() {
		return this.props.latestVersion;
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
			latestVersion,
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
			// TODO: compare this with toString
			this.props.id = String(timestampToMillisecond);
		}

		if (!latestVersion) {
			this.props.latestVersion = '0';
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

	public updateTitle(newTitle: string) {
		this.props.title = newTitle;
	}
	public updateDescription(newDescription: string) {
		this.props.description = newDescription;
	}

	public updateLatestVersion(newLatestVersion: string) {
		this.props.latestVersion = newLatestVersion;
	}

	public generateVoteLink(pollId: string): string {
		const encodePollId = Buffer.from(pollId).toString('base64');

		return encodePollId;
	}

	public setVoteLink(url: string) {
		this.props.voteLink = url;
	}
}
