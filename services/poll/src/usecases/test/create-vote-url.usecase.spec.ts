import {
	IPollRepository,
	IVersionPollRepository,
	Poll,
	Question,
	Version,
} from '../../domains';
import {
	CreateVoteURLUseCase,
	CreateVoteURLUseCaseInput,
} from '../create-vote-url.usecase';
import {
	BadRequestException,
	NotFoundException,
	UnknownException,
} from '@libs/common';

describe('create vote link test suite', () => {
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
		deleteQuestionById: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
	};

	const versionPollRepositoryMock: jest.Mocked<IVersionPollRepository> = {
		create: jest.fn(),
		createPollVersion: jest.fn(),
		getAllPollVersions: jest.fn(),
		packageQuestionsWithVersion: jest.fn(),
		update: jest.fn(),
		getQuestionsByLatestVersion: jest.fn(),
	};

	it('Should throw error when pollId is missing', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = undefined;

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			createVoteURLUseCaseMock.execute(createVoteURLUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(pollRepositoryMock.getQuestionsByPollId).not.toBeCalled();
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).not.toBeCalled();
		expect(pollRepositoryMock.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = '123';

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			createVoteURLUseCaseMock.execute(createVoteURLUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).not.toBeCalled();
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).not.toBeCalled();
		expect(pollRepositoryMock.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when poll is existed but no question provided', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = '123';

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);
		pollRepositoryMock.getQuestionsByPollId.mockReturnValueOnce(null);

		const expectedError = new BadRequestException('No questions provided');

		await expect(
			createVoteURLUseCaseMock.execute(createVoteURLUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).not.toBeCalled();
		expect(pollRepositoryMock.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when packageQuestionsWithVersion failed', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = '123';

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		const questionsMock = [
			new Question({
				answers: ['yes', 'no'],
				content: 'some question',
				isRequired: true,
				pollId: '123',
				questionId: '555',
				questionType: 'MULTIPLE',
			}),
		];

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const versionMock = new Version({
			pollId: '123',
			version: '1',
			questions: questionsMock,
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		pollRepositoryMock.getQuestionsByPollId.mockResolvedValueOnce(
			questionsMock,
		);

		versionPollRepositoryMock.packageQuestionsWithVersion.mockRejectedValueOnce(
			new UnknownException('Unknown Exception'),
		);

		const expectedError = new UnknownException('Unknown Exception');

		await expect(
			createVoteURLUseCaseMock.execute(createVoteURLUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).toBeCalledWith(versionMock);
		expect(pollRepositoryMock.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should execute successfully with valid data and generate url when poll does not have url yet', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = '123';

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		const questionsMock = [
			new Question({
				answers: ['yes', 'no'],
				content: 'some question',
				isRequired: true,
				pollId: '123',
				questionId: '555',
				questionType: 'MULTIPLE',
			}),
		];

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const versionMock = new Version({
			pollId: '123',
			version: String(Number(pollMock.version) + 1),
			questions: questionsMock,
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		pollRepositoryMock.getQuestionsByPollId.mockResolvedValueOnce(
			questionsMock,
		);

		versionPollRepositoryMock.packageQuestionsWithVersion.mockResolvedValueOnce();

		pollRepositoryMock.updatePollGeneralInformation.mockResolvedValueOnce();

		pollRepositoryMock.generateVoteURL.mockReturnValueOnce(
			'somerandomstringasurl',
		);

		const result = await createVoteURLUseCaseMock.execute(
			createVoteURLUseCaseInput,
		);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).toBeCalledWith(versionMock);
		expect(pollRepositoryMock.updatePollGeneralInformation).toBeCalledWith(
			pollMock.id,
			pollMock.version,
			'somerandomstringasurl',
		);
		expect(result).toEqual({
			message: 'Successfully publish poll',
			voteLink: 'somerandomstringasurl',
		});
	});
	it('Should execute successfully when poll already has the vote url', async () => {
		const createVoteURLUseCaseMock = new CreateVoteURLUseCase(
			pollRepositoryMock,
			versionPollRepositoryMock,
		);

		const pollIdMock = '123';

		const createVoteURLUseCaseInput = new CreateVoteURLUseCaseInput(pollIdMock);

		const pollMock = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
			voteLink: 'somerandomstringasurl',
			version: '1',
		});

		const questionsMock = [
			new Question({
				answers: ['yes', 'no'],
				content: 'some question',
				isRequired: true,
				pollId: '123',
				questionId: '555',
				questionType: 'MULTIPLE',
			}),
		];

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const versionMock = new Version({
			pollId: '123',
			version: String(Number(pollMock.version) + 1),
			questions: questionsMock,
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		pollRepositoryMock.getQuestionsByPollId.mockResolvedValueOnce(
			questionsMock,
		);

		versionPollRepositoryMock.packageQuestionsWithVersion.mockResolvedValueOnce();

		pollRepositoryMock.updatePollGeneralInformation.mockResolvedValueOnce();

		const result = await createVoteURLUseCaseMock.execute(
			createVoteURLUseCaseInput,
		);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			versionPollRepositoryMock.packageQuestionsWithVersion,
		).toBeCalledWith(versionMock);
		expect(pollRepositoryMock.updatePollGeneralInformation).toBeCalledWith(
			pollMock.id,
			pollMock.version,
		);
		expect(result).toEqual({
			message: 'Successfully publish poll',
			voteLink: 'somerandomstringasurl',
		});
	});
});
