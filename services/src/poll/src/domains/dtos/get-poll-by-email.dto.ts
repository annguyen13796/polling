export interface GetPollsByCreatorEmailDto {
	creatorEmail: string | undefined | null;
	limit: number | undefined | null;
	lastPollId?: string;
}
