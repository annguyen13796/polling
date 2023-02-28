import {
	BadRequestException,
	NotFoundException,
	UnknownException,
} from '@libs/common';
import moment from 'moment';
import {
	IPollRepository,
	IVersionPollRepository,
	Poll,
	Question,
	Version,
} from '../../domains';
import {
	GetLatestVersionUseCase,
	GetLatestVersionUseCaseInput,
} from '../get-latest-version.usecase';

describe('get question with latest version test suite', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockPollRepository: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		deletePollById: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		update: jest.fn(),
		findPollById: jest.fn(),
		generateVoteURL: jest.fn(),
		updatePollGeneralInformation: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
	};

	const mockVersionPollRepository: jest.Mocked<IVersionPollRepository> = {
		create: jest.fn(),
		createPollVersion: jest.fn(),
		getAllPollVersions: jest.fn(),
		packageQuestionsWithVersion: jest.fn(),
		update: jest.fn(),
		getQuestionsByLatestVersion: jest.fn(),
		getLatestVersionInformation: jest.fn(),
	};

	it('should throw error when pollId is null/undefined', async () => {
		const pollId = undefined;
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		const expectedError = new BadRequestException('PollId is missing');

		await expect(
			getLatestVersionUseCase.execute(getLatestVersionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockVersionPollRepository.getLatestVersionInformation,
		).not.toBeCalled();
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).not.toBeCalled();
	});

	it('should throw error when poll is not existed', async () => {
		const pollId = '123';
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException('Poll is not existed');

		await expect(
			getLatestVersionUseCase.execute(getLatestVersionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockVersionPollRepository.getLatestVersionInformation,
		).not.toBeCalled();
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).not.toBeCalled();
	});

	it('should throw error when no information of version found', async () => {
		const pollId = '123';
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			version: '0',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(pollMock);

		mockVersionPollRepository.getLatestVersionInformation.mockResolvedValueOnce(
			null,
		);

		const expectedError = new BadRequestException(
			'This Poll that have not been published yet',
		);

		await expect(
			getLatestVersionUseCase.execute(getLatestVersionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).not.toBeCalled();
	});
	it('should throw error when no questions found', async () => {
		const pollId = '123';
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			version: '2',
		});

		const versionMock = new Version({
			pollId: '123',
			version: '2',
			recurrenceType: 'NONE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(pollMock);

		mockVersionPollRepository.getLatestVersionInformation.mockResolvedValueOnce(
			versionMock,
		);

		mockVersionPollRepository.getQuestionsByLatestVersion.mockResolvedValueOnce(
			null,
		);

		const expectedError = new BadRequestException(
			'Invalid Poll with no questions',
		);

		await expect(
			getLatestVersionUseCase.execute(getLatestVersionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockVersionPollRepository.getLatestVersionInformation,
		).toBeCalledWith(pollMock.id, pollMock.version);
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
	});

	it('should throw error when getQuestionsByLatestVersion execute fail', async () => {
		const pollId = '123';
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			version: '0',
		});

		const versionMock = new Version({
			pollId: '123',
			version: '2',
			recurrenceType: 'NONE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(pollMock);

		mockVersionPollRepository.getLatestVersionInformation.mockResolvedValueOnce(
			versionMock,
		);

		mockVersionPollRepository.getQuestionsByLatestVersion.mockRejectedValueOnce(
			new UnknownException('some error'),
		);

		const expectedError = new UnknownException('some error');

		await expect(
			getLatestVersionUseCase.execute(getLatestVersionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
	});

	it('should execute successfully', async () => {
		const pollId = '123';
		const getLatestVersionUseCaseInput = new GetLatestVersionUseCaseInput(
			pollId,
		);

		const getLatestVersionUseCase = new GetLatestVersionUseCase(
			mockPollRepository,
			mockVersionPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			version: '1',
		});

		const versionMock = new Version({
			pollId: '123',
			version: '1',
			recurrenceType: 'NONE',
		});

		jest.spyOn<any, string>(moment, 'valueOf').mockReturnValueOnce(555);

		const mockQuestions: Question[] = [
			new Question({
				pollId: pollMock.id,
				answers: ['yes', 'no'],
				content: 'are you ready',
				isRequired: true,
				questionType: 'MULTIPLE',
				questionId: '555',
			}),
		];

		mockPollRepository.findPollById.mockResolvedValueOnce(pollMock);

		mockVersionPollRepository.getLatestVersionInformation.mockResolvedValueOnce(
			versionMock,
		);

		mockVersionPollRepository.getQuestionsByLatestVersion.mockResolvedValueOnce(
			mockQuestions,
		);

		const result = await getLatestVersionUseCase.execute(
			getLatestVersionUseCaseInput,
		);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockVersionPollRepository.getLatestVersionInformation,
		).toBeCalledWith(pollMock.id, pollMock.version);
		expect(
			mockVersionPollRepository.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
		expect(result).toEqual(
			new Version({
				pollId: versionMock.pollId,
				version: versionMock.version,
				activeDate: versionMock.activeDate,
				createdAt: versionMock.createdAt,
				recurrenceType: versionMock.recurrenceType,
				questions: mockQuestions,
			}),
		);
	});
});
