import { BadRequestException, NotFoundException } from '@libs/common';
import {
	IOverviewReportRepository,
	OverviewReport,
	UpdateOverviewReportDto,
} from '../../domains';
import {
	UpdateOverviewReportUseCase,
	UpdateOverviewReportUseCaseInput,
} from '../update-overview-report.usecase';

describe('UpdateOverviewReportUseCase', () => {
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
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'IN PROGRESS',
		};
		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			updateOverviewReportUseCase.execute(updateOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});

	it(`should throw poll version missing when pollId is undefined`, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'IN PROGRESS',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			updateOverviewReportUseCase.execute(updateOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'IN PROGRESS',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			updateOverviewReportUseCase.execute(updateOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});
	it(`should throw end date missing when startDate is undefined`, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'IN PROGRESS',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			updateOverviewReportUseCase.execute(updateOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});

	it(`should throw bad request exception when overview report is not found`, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'IN PROGRESS',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const expectedError = new NotFoundException('Overview Report Not Found');
		const mockExistedOverviewReport: OverviewReport = null;
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);

		await expect(
			updateOverviewReportUseCase.execute(updateOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});

	it(`should update status successfully `, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'CLOSED',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate,
			endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);

		const result = await updateOverviewReportUseCase.execute(
			updateOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'update overview report status successfully',
		});

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
		expect(mockOverviewReportRepository.updateOverviewReport).toBeCalledWith(
			mockExistedOverviewReport,
		);
	});

	it(`should update status and blockDate successfully `, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {
			status: 'CLOSED',
			blockedDate: 'blockDate',
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate,
			endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);

		const result = await updateOverviewReportUseCase.execute(
			updateOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'update overview report status successfully',
		});

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
		expect(mockOverviewReportRepository.updateOverviewReport).toBeCalledWith(
			mockExistedOverviewReport,
		);
	});

	it(`should execute successfully when nothing is updated`, async () => {
		const updateOverviewReportUseCase = new UpdateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockUpdateOverviewReportDto: UpdateOverviewReportDto = {};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';

		const updateOverviewReportUseCaseInput =
			new UpdateOverviewReportUseCaseInput(
				mockUpdateOverviewReportDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
			);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate,
			endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);

		const result = await updateOverviewReportUseCase.execute(
			updateOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'nothing to update',
		});

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(pollId, pollVersion, startDate, endDate);
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
	});
});
