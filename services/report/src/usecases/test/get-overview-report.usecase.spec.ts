import { BadRequestException, NotFoundException } from '@libs/common';
import { IOverviewReportRepository, OverviewReport } from '../../domains';
import {
	GetOverviewReportUseCase,
	GetOverviewReportUseCaseInput,
} from '../get-overview-report.usecase';

describe('GetOverviewReportUseCase', () => {
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
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			getOverviewReportUseCase.execute(getOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			getOverviewReportUseCase.execute(getOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			getOverviewReportUseCase.execute(getOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw end date missing when endDate is undefined`, async () => {
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			getOverviewReportUseCase.execute(getOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
	});

	it(`should throw exception when overview report not found`, async () => {
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const mockReturnedOverviewReport: OverviewReport = null;
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockReturnedOverviewReport,
		);

		const expectError = new NotFoundException('Overview Report not found');
		await expect(
			getOverviewReportUseCase.execute(getOverviewReportUseCaseInput),
		).rejects.toThrowError(expectError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
	});

	it(`should execute successfully`, async () => {
		const getOverviewReportUseCase = new GetOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const getOverviewReportUseCaseInput = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);

		const mockReturnedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate,
			endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockReturnedOverviewReport,
		);
		const result = await getOverviewReportUseCase.execute(
			getOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'get overview report successfully',
			overviewReport: mockReturnedOverviewReport,
		});

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
	});
});
