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
} from '../../domains';
import {
	GetQuestionByLatestVersionUseCase,
	GetQuestionByLatestVersionUseCaseInput,
} from '../get-question-by-latest-version.usecase';

describe('get question with latest version test suite', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const pollRepositoryMock: jest.Mocked<IPollRepository> = {
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

	const versionPollRepositoryMock: jest.Mocked<IVersionPollRepository> = {
		create: jest.fn(),
		createPollVersion: jest.fn(),
		getAllPollVersions: jest.fn(),
		packageQuestionsWithVersion: jest.fn(),
		update: jest.fn(),
		getQuestionsByLatestVersion: jest.fn(),
	};

	it('should throw error when pollId is null/undefined', async () => {
		const pollId = undefined;
		const getQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const getQuestionsByLatestVersionUseCase =
			new GetQuestionByLatestVersionUseCase(
				pollRepositoryMock,
				versionPollRepositoryMock,
			);

		const expectedError = new BadRequestException('PollId is missing');

		await expect(
			getQuestionsByLatestVersionUseCase.execute(
				getQuestionsByLatestVersionUseCaseInput,
			),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(
			versionPollRepositoryMock.getQuestionsByLatestVersion,
		).not.toBeCalled();
	});

	it('should throw error when poll is not existed', async () => {
		const pollId = '123';
		const getQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const getQuestionsByLatestVersionUseCase =
			new GetQuestionByLatestVersionUseCase(
				pollRepositoryMock,
				versionPollRepositoryMock,
			);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException('Poll is not existed');

		await expect(
			getQuestionsByLatestVersionUseCase.execute(
				getQuestionsByLatestVersionUseCaseInput,
			),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.getQuestionsByLatestVersion,
		).not.toBeCalled();
	});

	it('should throw error when no questions found', async () => {
		const pollId = '123';
		const getQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const getQuestionsByLatestVersionUseCase =
			new GetQuestionByLatestVersionUseCase(
				pollRepositoryMock,
				versionPollRepositoryMock,
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

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		versionPollRepositoryMock.getQuestionsByLatestVersion.mockResolvedValueOnce(
			null,
		);

		const expectedError = new BadRequestException(
			'Invalid Poll with no questions',
		);

		await expect(
			getQuestionsByLatestVersionUseCase.execute(
				getQuestionsByLatestVersionUseCaseInput,
			),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
	});

	it('should throw error when getQuestionsByLatestVersion execute fail', async () => {
		const pollId = '123';
		const getQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const getQuestionsByLatestVersionUseCase =
			new GetQuestionByLatestVersionUseCase(
				pollRepositoryMock,
				versionPollRepositoryMock,
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

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		versionPollRepositoryMock.getQuestionsByLatestVersion.mockRejectedValueOnce(
			new UnknownException('some error'),
		);

		const expectedError = new UnknownException('some error');

		await expect(
			getQuestionsByLatestVersionUseCase.execute(
				getQuestionsByLatestVersionUseCaseInput,
			),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
	});

	it('should execute successfully', async () => {
		const pollId = '123';
		const getQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const getQuestionsByLatestVersionUseCase =
			new GetQuestionByLatestVersionUseCase(
				pollRepositoryMock,
				versionPollRepositoryMock,
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

		jest.spyOn<any, string>(moment, 'valueOf').mockReturnValueOnce(555);

		const quesitonsMock: Question[] = [
			new Question({
				pollId: pollMock.id,
				answers: ['yes', 'no'],
				content: 'are you ready',
				isRequired: true,
				questionType: 'MULTIPLE',
				questionId: '555',
			}),
		];

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		versionPollRepositoryMock.getQuestionsByLatestVersion.mockResolvedValueOnce(
			quesitonsMock,
		);

		const result = await getQuestionsByLatestVersionUseCase.execute(
			getQuestionsByLatestVersionUseCaseInput,
		);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.getQuestionsByLatestVersion,
		).toBeCalledWith(pollMock.id, pollMock.version);
		expect(result).toEqual({
			questions: quesitonsMock,
			version: pollMock.version,
		});
	});
});
