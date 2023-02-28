import { Version } from '../models';

export interface GetLatestVersionResponseDto {
	message: string;
	version: Version | null;
}
