export interface CreatePollDto {
	creatorEmail: string | undefined | null;
	title: string | null | undefined;
	description: string | null | undefined;
}
