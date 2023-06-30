import { BadRequestException } from '@libs/common';
import { IOverviewReportRepository, VoterReport } from '../../domains';
import {
	GetVoterOfAnswerReportsUseCase,
	GetVoterOfAnswerReportsUseCaseInput,
} from '../get-voter-of-answer-reports.usecase';

describe('GetVoterOfAnswerReportsReportUseCase', () => {
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
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw end date missing when endDate is undefined`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw question Id missing when questionId is undefined`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = undefined;
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Question ID is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw answer missing when answer is undefined`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = undefined;

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Answer is required');

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getVoterReportsOfAnswer,
		).not.toBeCalled();
	});

	it(`should throw not found exception when report not exists`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const expectedError = new BadRequestException('Report is not existed');

		const mockReturnVoterReports: VoterReport[] = null;
		mockOverviewReportRepository.getVoterReportsOfAnswer.mockResolvedValue(
			mockReturnVoterReports,
		);

		await expect(
			getVoterOfAnswerReportsUseCase.execute(
				getVoterOfAnswerReportsUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockOverviewReportRepository.getVoterReportsOfAnswer).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			questionId,
			answer,
		);
	});
	it(`should execute successfully`, async () => {
		const getVoterOfAnswerReportsUseCase = new GetVoterOfAnswerReportsUseCase(
			mockOverviewReportRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const questionId: string = 'questionId';
		const answer: string = 'answer';

		const getVoterOfAnswerReportsUseCaseInput =
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
			);

		const mockReturnVoterReports: VoterReport[] = [
			new VoterReport({
				pollId,
				pollVersion,
				startDate,
				endDate,
				questionId,
				answer,
				voterEmail: 'khoa.pham@zoi.tech',
			}),
		];
		mockOverviewReportRepository.getVoterReportsOfAnswer.mockResolvedValue(
			mockReturnVoterReports,
		);

		const result = await getVoterOfAnswerReportsUseCase.execute(
			getVoterOfAnswerReportsUseCaseInput,
		);
		expect(result).toEqual({
			message: 'Successfully get voter of answer',
			voterReports: mockReturnVoterReports,
		});

		expect(mockOverviewReportRepository.getVoterReportsOfAnswer).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			questionId,
			answer,
		);
	});
});
