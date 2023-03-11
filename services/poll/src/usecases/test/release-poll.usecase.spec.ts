import {
	ReleasePollDto,
	IPollRepository,
	IReleasedPollRepository,
	Poll,
	Question,
	ReleasedPoll,
} from '../../domains';
import {
	ReleasePollUseCase,
	ReleasePollUseCaseInput,
} from '../release-poll.usecase';
import {
	BadRequestException,
	NotFoundException,
	UnknownException,
} from '@libs/common';

describe('create vote link test suite', () => {
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
		deleteQuestionById: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		updatePoll: jest.fn(),
	};

	const mockReleasedPollRepository: jest.Mocked<IReleasedPollRepository> = {
		create: jest.fn(),
		createPollRelease: jest.fn(),
		getAllPollReleases: jest.fn(),
		getLatestReleaseInformation: jest.fn(),
		getQuestionsOfLatestRelease: jest.fn(),
		packageQuestionsWithReleasedPoll: jest.fn(),
		update: jest.fn(),
	};

	it('Should throw error when pollId is missing', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = undefined;
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const expectedError = new BadRequestException('pollId is missing');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.getQuestionsByPollId).not.toBeCalled();
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).not.toBeCalled();
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when start date is missing', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: undefined,
			endDate: 'end date',
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const expectedError = new BadRequestException('Missing startDate');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.getQuestionsByPollId).not.toBeCalled();
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).not.toBeCalled();
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when end date is missing', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: undefined,
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const expectedError = new BadRequestException('Missing endDate');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.getQuestionsByPollId).not.toBeCalled();
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).not.toBeCalled();
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(mockPollRepository.getQuestionsByPollId).not.toBeCalled();
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).not.toBeCalled();
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when poll is existed but no question provided for releasing', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);
		mockPollRepository.getQuestionsByPollId.mockReturnValueOnce(null);

		const expectedError = new BadRequestException('No questions provided');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(mockPollRepository.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).not.toBeCalled();
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should throw error when packageQuestionsWithVersion failed', async () => {
		const mockReleasePollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasePollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		const mockQuestions = [
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

		const mockReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: '1',
			questions: mockQuestions,
			startDate: mockReleasePollDto.startDate,
			endDate: mockReleasePollDto.endDate,
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockPollRepository.getQuestionsByPollId.mockResolvedValueOnce(
			mockQuestions,
		);

		mockReleasedPollRepository.packageQuestionsWithReleasedPoll.mockRejectedValueOnce(
			new UnknownException('Unknown Exception'),
		);

		const expectedError = new UnknownException('Unknown Exception');

		await expect(
			mockReleasePollUseCase.execute(mockReleasePollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(mockPollRepository.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).toBeCalledWith(mockReleasedPoll);
		expect(mockPollRepository.updatePollGeneralInformation).not.toBeCalled();
	});

	it('Should execute successfully with valid data and generate url when poll does not have url yet', async () => {
		const mockReleasedPollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasedPollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		const mockQuestions = [
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

		const mockReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: String(Number(mockPoll.version) + 1),
			questions: mockQuestions,
			startDate: mockReleasePollDto.startDate,
			endDate: mockReleasePollDto.endDate,
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockPollRepository.getQuestionsByPollId.mockResolvedValueOnce(
			mockQuestions,
		);

		mockReleasedPollRepository.packageQuestionsWithReleasedPoll.mockResolvedValueOnce();

		mockPollRepository.updatePollGeneralInformation.mockResolvedValueOnce();

		mockPollRepository.generateVoteURL.mockReturnValueOnce(
			'a-random-string-as-url',
		);

		const result = await mockReleasedPollUseCase.execute(
			mockReleasedPollUseCaseInput,
		);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(mockPollRepository.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).toBeCalledWith(mockReleasedPoll);
		expect(mockPollRepository.updatePollGeneralInformation).toBeCalledWith(
			mockPoll.id,
			mockPoll.version,
			mockPoll.voteLink,
		);
		expect(result).toEqual({
			message: 'Successfully publish poll',
			voteLink: mockPoll.voteLink,
			version: mockReleasedPoll.version,
			startDate: mockReleasedPoll.startDate,
			endDate: mockReleasedPoll.endDate,
		});
	});
	it('Should execute successfully when update to new version and poll already has the vote url', async () => {
		const mockReleasedPollUseCase = new ReleasePollUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const mockPollId = '123';
		const mockReleasePollDto: ReleasePollDto = {
			startDate: 'start date',
			endDate: 'end date',
		};

		const mockReleasedPollUseCaseInput = new ReleasePollUseCaseInput(
			mockPollId,
			mockReleasePollDto,
		);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			description: 'somedesc',
			title: 'sometitle',
			id: '123',
		});

		const mockQuestions = [
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

		const mockReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: String(Number(mockPoll.version) + 1),
			questions: mockQuestions,
			startDate: mockReleasePollDto.startDate,
			endDate: mockReleasePollDto.endDate,
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockPollRepository.getQuestionsByPollId.mockResolvedValueOnce(
			mockQuestions,
		);

		mockReleasedPollRepository.packageQuestionsWithReleasedPoll.mockResolvedValueOnce();

		mockPollRepository.updatePollGeneralInformation.mockResolvedValueOnce();

		const result = await mockReleasedPollUseCase.execute(
			mockReleasedPollUseCaseInput,
		);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(mockPollRepository.getQuestionsByPollId).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.packageQuestionsWithReleasedPoll,
		).toBeCalledWith(mockReleasedPoll);
		expect(mockPollRepository.updatePollGeneralInformation).toBeCalledWith(
			mockPoll.id,
			mockPoll.version,
		);
		expect(result).toEqual({
			message: 'Successfully publish poll',
			voteLink: mockPoll.voteLink,
			version: mockReleasedPoll.version,
			startDate: mockReleasedPoll.startDate,
			endDate: mockReleasedPoll.endDate,
		});
	});
});
