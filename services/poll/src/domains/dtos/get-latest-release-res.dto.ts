import { ReleasedPoll } from '../models';

export interface GetLatestReleaseResponseDto {
	message: string;
	latestRelease: ReleasedPoll | null;
}
