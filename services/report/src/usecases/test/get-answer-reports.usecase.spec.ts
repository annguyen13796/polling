import { BadRequestException } from '@libs/common';
import { AnswerReport, IOverviewReportRepository } from '../../domains';
import {
	GetAnswerReportsUseCase,
	GetAnswerReportsUseCaseInput,
} from '../get-answer-reports.usecase';

describe('GetAnswerReportsUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockOverviewReportRepository: jest.Mocked<IOverviewReportRepository> = {
		create: jest.fn(),
		createOverviewReportAndAnswerReports: jest.fn(),
		createVoterReports: jest.fn(),
		getAnswerReport: jest.fn(),
		getAnswerReportsForOccurrence: jest.fn(),
		getOverviewReportForOccurrence: jest.fn(),
		getOverviewReportsForPoll: jest.fn(),
		getVoterReportsOfAnswer: jest.fn(),
		updateAnswerReports: jest.fn(),
		updateOverviewReport: jest.fn(),
		updateUserResponse: jest.fn(),
		update: jest.fn(),
	};

	it(`should throw poll id missing when pollId is undefined`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			getAnswerReportsUseCase.execute(getAnswerReportsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			getAnswerReportsUseCase.execute(getAnswerReportsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			getAnswerReportsUseCase.execute(getAnswerReportsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw end date missing when endDate is undefined`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			getAnswerReportsUseCase.execute(getAnswerReportsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw exception when not found any report`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException(
			'Can not find any report for this version',
		);

		const mockReturnedAnswerReports: AnswerReport[] = null;
		const mockLastEvaluatedKey = null;
		mockOverviewReportRepository.getAnswerReportsForOccurrence.mockResolvedValue(
			{
				data: mockReturnedAnswerReports,
				lastEvaluatedKey: mockLastEvaluatedKey,
			},
		);

		await expect(
			getAnswerReportsUseCase.execute(getAnswerReportsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate, null);
	});

	it(`should execute successfully with empty lastEvaluatedKey`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const mockReturnedAnswerReports: AnswerReport[] = [];
		const mockLastEvaluatedKey = null;
		mockOverviewReportRepository.getAnswerReportsForOccurrence.mockResolvedValue(
			{
				data: mockReturnedAnswerReports,
				lastEvaluatedKey: mockLastEvaluatedKey,
			},
		);

		const result = await getAnswerReportsUseCase.execute(
			getAnswerReportsUseCaseInput,
		);
		expect(result).toEqual({
			nextToken: null,
			answerReports: mockReturnedAnswerReports,
		});

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate, null);
	});

	it(`should execute successfully`, async () => {
		const getAnswerReportsUseCase = new GetAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getAnswerReportsUseCaseInput = new GetAnswerReportsUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const mockReturnedAnswerReports: AnswerReport[] = [];
		const mockLastEvaluatedKey = {
			PK: 'PK',
		};
		mockOverviewReportRepository.getAnswerReportsForOccurrence.mockResolvedValue(
			{
				data: mockReturnedAnswerReports,
				lastEvaluatedKey: mockLastEvaluatedKey,
			},
		);
		jest
			.spyOn(Buffer.prototype, 'toString')
			.mockImplementationOnce(() => 'base64Key');

		const result = await getAnswerReportsUseCase.execute(
			getAnswerReportsUseCaseInput,
		);
		expect(result).toEqual({
			nextToken: 'base64Key',
			answerReports: mockReturnedAnswerReports,
		});

		expect(
			mockOverviewReportRepository.getAnswerReportsForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate, null);
	});
});
