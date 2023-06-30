import { QUESTION_TYPE } from '../../constants';

export interface Question {
	content: string;
	questionId: string;
	answers: string[];
	questionType: QUESTION_TYPE;
}
export interface CreateOverviewReportDto {
	startDate: string;
	endDate: string;
	questions: Question[];
}
