import { Poll } from '../models';

export interface GetPollsByCreatorEmailResponseDto {
	polls: Poll[];
	lastPollId?: string;
}
