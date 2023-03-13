import { BadRequestException } from '@libs/common';
import {
	AnswerReport,
	CreateOverviewReportDto,
	IOverviewReportRepository,
	OverviewReport,
} from '../../domains';
import {
	CreateOverviewReportUseCase,
	CreateOverviewReportUseCaseInput,
} from '../create-overview-report.usecase';

describe('CreateOverviewReportUseCase', () => {
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
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should throw poll id missing when pollId is undefined`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = undefined;

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should throw start date missing when startDate in dto is undefined`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: undefined,
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should throw end date missing when endDate in dto is undefined`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: undefined,
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should throw question list missing when questions in dto is undefined/null`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: null,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException(
			'Questions List cant be null/empty',
		);

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should throw bad request exception when overview report is existed`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const expectedError = new BadRequestException(
			'Overview Report is already existed',
		);

		const mockReturnOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateOverviewReportDto.startDate,
			endDate: mockCreateOverviewReportDto.endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockReturnOverviewReport,
		);

		await expect(
			createOverviewReportUseCase.execute(createOverviewReportUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateOverviewReportDto.startDate,
			mockCreateOverviewReportDto.endDate,
		);
		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).not.toBeCalled();
	});

	it(`should execute successfully when have no old report`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const mockReturnOverviewReport: OverviewReport = null;
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockReturnOverviewReport,
		);
		const mockReturnOldOverviewReports: OverviewReport[] = [];
		mockOverviewReportRepository.getOverviewReportsForPoll.mockResolvedValue(
			mockReturnOldOverviewReports,
		);

		const expectedNewOverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateOverviewReportDto.startDate,
			endDate: mockCreateOverviewReportDto.endDate,
			participants: null,
			status: null,
		});
		const expectedNewAnswerReports: AnswerReport[] = [
			new AnswerReport({
				pollId: pollId,
				pollVersion: pollVersion,
				startDate: mockCreateOverviewReportDto.startDate,
				endDate: mockCreateOverviewReportDto.endDate,
				question: mockCreateOverviewReportDto.questions[0].content,
				questionId: mockCreateOverviewReportDto.questions[0].questionId,
				numberOfVoter: 0,
				answer: mockCreateOverviewReportDto.questions[0].answers[0],
			}),
			new AnswerReport({
				pollId: pollId,
				pollVersion: pollVersion,
				startDate: mockCreateOverviewReportDto.startDate,
				endDate: mockCreateOverviewReportDto.endDate,
				question: mockCreateOverviewReportDto.questions[0].content,
				questionId: mockCreateOverviewReportDto.questions[0].questionId,
				numberOfVoter: 0,
				answer: mockCreateOverviewReportDto.questions[0].answers[1],
			}),
		];

		const result = await createOverviewReportUseCase.execute(
			createOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'create overview report successfully',
		});
		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateOverviewReportDto.startDate,
			mockCreateOverviewReportDto.endDate,
		);

		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).toBeCalledWith(pollId, 1);
		expect(mockOverviewReportRepository.updateOverviewReport).not.toBeCalled();
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).toBeCalledWith(expectedNewOverviewReport, expectedNewAnswerReports);
	});

	it(`should execute successfully when have old reports`, async () => {
		const createOverviewReportUseCase = new CreateOverviewReportUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateOverviewReportDto: CreateOverviewReportDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			questions: [
				{
					questionId: 'questionId',
					content: 'questionContent',
					answers: ['answer1', 'answer2'],
				},
			],
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createOverviewReportUseCaseInput =
			new CreateOverviewReportUseCaseInput(
				mockCreateOverviewReportDto,
				pollId,
				pollVersion,
			);

		const mockReturnOverviewReport: OverviewReport = null;
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockReturnOverviewReport,
		);
		const mockReturnOldOverviewReports: OverviewReport[] = [
			new OverviewReport({
				pollId,
				pollVersion,
				startDate: mockCreateOverviewReportDto.startDate,
				endDate: mockCreateOverviewReportDto.endDate,
				participants: [],
				status: 'IN PROGRESS',
			}),
		];
		mockOverviewReportRepository.getOverviewReportsForPoll.mockResolvedValue(
			mockReturnOldOverviewReports,
		);

		const expectedNewOverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateOverviewReportDto.startDate,
			endDate: mockCreateOverviewReportDto.endDate,
			participants: null,
			status: null,
		});
		const expectedNewAnswerReports: AnswerReport[] = [
			new AnswerReport({
				pollId: pollId,
				pollVersion: pollVersion,
				startDate: mockCreateOverviewReportDto.startDate,
				endDate: mockCreateOverviewReportDto.endDate,
				question: mockCreateOverviewReportDto.questions[0].content,
				questionId: mockCreateOverviewReportDto.questions[0].questionId,
				numberOfVoter: 0,
				answer: mockCreateOverviewReportDto.questions[0].answers[0],
			}),
			new AnswerReport({
				pollId: pollId,
				pollVersion: pollVersion,
				startDate: mockCreateOverviewReportDto.startDate,
				endDate: mockCreateOverviewReportDto.endDate,
				question: mockCreateOverviewReportDto.questions[0].content,
				questionId: mockCreateOverviewReportDto.questions[0].questionId,
				numberOfVoter: 0,
				answer: mockCreateOverviewReportDto.questions[0].answers[1],
			}),
		];

		const result = await createOverviewReportUseCase.execute(
			createOverviewReportUseCaseInput,
		);
		expect(result).toEqual({
			message: 'create overview report successfully',
		});
		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateOverviewReportDto.startDate,
			mockCreateOverviewReportDto.endDate,
		);

		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).toBeCalledWith(pollId, 1);
		expect(mockOverviewReportRepository.updateOverviewReport).toBeCalledWith(
			mockReturnOldOverviewReports[0],
		);
		expect(
			mockOverviewReportRepository.createOverviewReportAndAnswerReports,
		).toBeCalledWith(expectedNewOverviewReport, expectedNewAnswerReports);
	});
});
