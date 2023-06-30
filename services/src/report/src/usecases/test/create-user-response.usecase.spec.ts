import { BadRequestException } from '@libs/common';
import {
	AnswerReport,
	CreateUserResponseDto,
	IOverviewReportRepository,
	OverviewReport,
	VoterReport,
} from '../../domains';
import {
	CreateUserResponseUseCase,
	CreateUserResponseUseCaseInput,
} from '../create-user-response.usecase';

describe('CreateUserResponseUseCase', () => {
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
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('Poll Version is required');

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw start date missing when startDate in dto is undefined`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: undefined,
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('Start Date is required');

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw end date missing when endDate in dto is undefined`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: undefined,
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('End Date is required');

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw participant email missing when participantEmail in dto is undefined`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: undefined,
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException(
			'Participant Email is required',
		);

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw responses missing when userResponse in dto is undefined`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: null,
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('Response is required');

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).not.toBeCalled();
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw bad request exception when overview report is not existed `, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException(
			'Overview Report For Occurrence Not Found',
		);

		const mockExistedOverviewReport: OverviewReport = null;
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);
		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
		);
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw bad request exception when voting event is closed `, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException('Voting Event is closed');

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			participants: [],
			status: 'CLOSED',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);
		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
		);
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw bad request exception when questionType is null/undefined `, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: null,
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException(
			'Question Type for question is required in user response',
		);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
		);
		expect(mockOverviewReportRepository.getAnswerReport).not.toBeCalled();
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should throw bad request exception when answer in the dto cant be found in database`, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const expectedError = new BadRequestException(
			"The answer in the list can't be found",
		);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);
		const mockExistedAnswerReport: AnswerReport = new AnswerReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			questionId: mockCreateUserResponseDto.userResponse[0].questionId,
			answer: mockCreateUserResponseDto.userResponse[0].userAnswers[0],
			numberOfVoter: 0,
			question: 'question content',
			questionType: mockCreateUserResponseDto.userResponse[0].questionType,
		});
		const mockNotExistedAnswerReport: AnswerReport = null;
		mockOverviewReportRepository.getAnswerReport.mockResolvedValueOnce(
			mockExistedAnswerReport,
		);
		mockOverviewReportRepository.getAnswerReport.mockResolvedValueOnce(
			mockNotExistedAnswerReport,
		);

		await expect(
			createUserResponseUseCase.execute(createUserResponseUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
		);
		expect(
			mockOverviewReportRepository.getAnswerReport,
		).toHaveBeenNthCalledWith(
			1,
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
			mockCreateUserResponseDto.userResponse[0].questionId,
			mockCreateUserResponseDto.userResponse[0].userAnswers[0],
		);
		expect(
			mockOverviewReportRepository.getAnswerReport,
		).toHaveBeenNthCalledWith(
			2,
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
			mockCreateUserResponseDto.userResponse[0].questionId,
			mockCreateUserResponseDto.userResponse[0].userAnswers[1],
		);
		expect(mockOverviewReportRepository.updateUserResponse).not.toBeCalled();
		expect(mockOverviewReportRepository.updateAnswerReports).not.toBeCalled();
		expect(mockOverviewReportRepository.createVoterReports).not.toBeCalled();
	});

	it(`should execute successfully `, async () => {
		const createUserResponseUseCase = new CreateUserResponseUseCase(
			mockOverviewReportRepository,
		);

		const mockCreateUserResponseDto: CreateUserResponseDto = {
			startDate: 'startDate',
			endDate: 'endDate',
			participantEmail: 'khoa.pham@zoi.tech',
			userResponse: [
				{
					questionId: 'questionId',
					questionType: 'CHECKBOX',
					userAnswers: ['answer1', 'answer2'],
				},
				{
					questionId: 'questionId',
					questionType: 'TEXT_BOX',
					userAnswers: ['answer1'],
				},
			],
		};

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';

		const createUserResponseUseCaseInput = new CreateUserResponseUseCaseInput(
			mockCreateUserResponseDto,
			pollId,
			pollVersion,
		);

		const mockExistedOverviewReport: OverviewReport = new OverviewReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			participants: [],
			status: 'IN PROGRESS',
		});
		mockOverviewReportRepository.getOverviewReportForOccurrence.mockResolvedValue(
			mockExistedOverviewReport,
		);
		const mock1stExistedAnswerReport: AnswerReport = new AnswerReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			questionId: mockCreateUserResponseDto.userResponse[0].questionId,
			answer: mockCreateUserResponseDto.userResponse[0].userAnswers[0],
			numberOfVoter: 0,
			question: 'question content',
			questionType: mockCreateUserResponseDto.userResponse[0].questionType,
		});
		const mock2ndExistedAnswerReport: AnswerReport = new AnswerReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			questionId: mockCreateUserResponseDto.userResponse[0].questionId,
			answer: mockCreateUserResponseDto.userResponse[0].userAnswers[1],
			numberOfVoter: 0,
			question: 'question content',
			questionType: mockCreateUserResponseDto.userResponse[0].questionType,
		});
		const mock3rdExistedAnswerReport: AnswerReport = new AnswerReport({
			pollId,
			pollVersion,
			startDate: mockCreateUserResponseDto.startDate,
			endDate: mockCreateUserResponseDto.endDate,
			questionId: mockCreateUserResponseDto.userResponse[1].questionId,
			answer: 'Answer',
			numberOfVoter: 0,
			question: 'question content',
			questionType: mockCreateUserResponseDto.userResponse[1].questionType,
		});

		mockOverviewReportRepository.getAnswerReport.mockResolvedValueOnce(
			mock1stExistedAnswerReport,
		);
		mockOverviewReportRepository.getAnswerReport.mockResolvedValueOnce(
			mock2ndExistedAnswerReport,
		);
		mockOverviewReportRepository.getAnswerReport.mockResolvedValueOnce(
			mock3rdExistedAnswerReport,
		);

		const expectedNewVoterReports: VoterReport[] = [
			new VoterReport({
				pollId,
				pollVersion,
				startDate: mockCreateUserResponseDto.startDate,
				endDate: mockCreateUserResponseDto.endDate,
				questionId: mockCreateUserResponseDto.userResponse[0].questionId,
				answer: mockCreateUserResponseDto.userResponse[0].userAnswers[0],
				voterEmail: mockCreateUserResponseDto.participantEmail,
			}),
			new VoterReport({
				pollId,
				pollVersion,
				startDate: mockCreateUserResponseDto.startDate,
				endDate: mockCreateUserResponseDto.endDate,
				questionId: mockCreateUserResponseDto.userResponse[0].questionId,
				answer: mockCreateUserResponseDto.userResponse[0].userAnswers[1],
				voterEmail: mockCreateUserResponseDto.participantEmail,
			}),
			new VoterReport({
				pollId,
				pollVersion,
				startDate: mockCreateUserResponseDto.startDate,
				endDate: mockCreateUserResponseDto.endDate,
				questionId: mockCreateUserResponseDto.userResponse[0].questionId,
				answer: 'Answer',
				voterEmail: mockCreateUserResponseDto.participantEmail,
				shortAnswer: mockCreateUserResponseDto.userResponse[1].userAnswers[0],
			}),
		];
		const expectedModifiedAnswerReports: AnswerReport[] = [
			mock1stExistedAnswerReport,
			mock2ndExistedAnswerReport,
			mock3rdExistedAnswerReport,
		];

		const result = await createUserResponseUseCase.execute(
			createUserResponseUseCaseInput,
		);
		expect(result).toEqual({
			message: 'create user response successfully',
		});

		expect(
			mockOverviewReportRepository.getOverviewReportForOccurrence,
		).toBeCalledWith(
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
		);
		expect(
			mockOverviewReportRepository.getAnswerReport,
		).toHaveBeenNthCalledWith(
			1,
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
			mockCreateUserResponseDto.userResponse[0].questionId,
			mockCreateUserResponseDto.userResponse[0].userAnswers[0],
		);
		expect(
			mockOverviewReportRepository.getAnswerReport,
		).toHaveBeenNthCalledWith(
			2,
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
			mockCreateUserResponseDto.userResponse[0].questionId,
			mockCreateUserResponseDto.userResponse[0].userAnswers[1],
		);
		expect(
			mockOverviewReportRepository.getAnswerReport,
		).toHaveBeenNthCalledWith(
			3,
			pollId,
			pollVersion,
			mockCreateUserResponseDto.startDate,
			mockCreateUserResponseDto.endDate,
			mockCreateUserResponseDto.userResponse[0].questionId,
			'Answer',
		);
		expect(mockOverviewReportRepository.updateUserResponse).toBeCalledWith(
			mockExistedOverviewReport,
		);
		expect(mockOverviewReportRepository.updateAnswerReports).toBeCalledWith(
			expectedModifiedAnswerReports,
		);
		expect(mockOverviewReportRepository.createVoterReports).toBeCalledWith(
			expectedNewVoterReports,
		);
	});
});
