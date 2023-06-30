import { BadRequestException, isStringEmptyOrUndefined } from '@libs/common';
import { CurrentAnswersForQuestion } from './current-answers-for-question';

export interface DraftProps {
	pollId: string | null | undefined;
	pollVersion: string | null | undefined;
	startDate: string | null | undefined;
	endDate: string | null | undefined;
	voterEmail: string | null | undefined;
	hasBeenSubmitted: boolean | null | undefined;
	currentAnswersForQuestions?: CurrentAnswersForQuestion[];
}

export class Draft {
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

	public get voterEmail() {
		return this.props.voterEmail;
	}

	public get hasBeenSubmitted() {
		return this.props.hasBeenSubmitted;
	}

	constructor(private readonly props: DraftProps) {
		if (!props) {
			throw new BadRequestException('Props of question is null/undefined');
		}

		const {
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
			hasBeenSubmitted,
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

		if (isStringEmptyOrUndefined(voterEmail)) {
			throw new BadRequestException('Voter Email is null/undefined');
		}

		if (typeof hasBeenSubmitted !== 'boolean') {
			throw new BadRequestException(
				'HasBeenSubmitted status is null/undefined',
			);
		}
	}
}
