import {
	AnswerGeneralReportDynamoDBMapper,
	AnswerGeneralReportDynamoRepository,
	VoterReportDynamoDBMapper,
	VoterReportDynamoRepository,
	OverviewReportDynamoDBMapper,
	OverviewReportDynamoRepository,
} from '../data';

export const voterReportDomainMapper = new VoterReportDynamoDBMapper();
export const voterReportRepository = new VoterReportDynamoRepository(
	{
		tableName: 'khoa.pham_polling_report',
	},
	voterReportDomainMapper,
);

export const answerReportDomainMapper = new AnswerGeneralReportDynamoDBMapper();
export const answerGeneralReportRepository =
	new AnswerGeneralReportDynamoRepository(
		{
			tableName: 'khoa.pham_polling_report',
		},
		answerReportDomainMapper,
		voterReportRepository,
	);

export const overviewReportDomainMapper = new OverviewReportDynamoDBMapper();
export const overviewReportRepository = new OverviewReportDynamoRepository(
	{
		tableName: 'khoa.pham_polling_report',
	},
	overviewReportDomainMapper,
	voterReportRepository,
	answerGeneralReportRepository,
);
