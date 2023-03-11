import { AnswerReport } from '../models';

export interface GetAnswerReportsResponseDto {
	nextToken: string | null;
	answerReports: AnswerReport[];
}
