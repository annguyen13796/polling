import { BadRequestException, UnknownException } from '@libs/common';
import moment from 'moment';
import {
	GetLatestReleaseResponseDto,
	IPollRepository,
	IReleasedPollRepository,
	Poll,
	Question,
	ReleasedPoll,
} from '../../domains';
import {
	GetLatestReleaseUseCase,
	GetLatestReleaseUseCaseInput,
} from '../get-latest-release.usecase';

describe('get latest release test suite', () => {
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
		updatePoll: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
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

	it('should throw error when pollId is null/undefined', async () => {
		const mockPollId = undefined;
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		const expectedError = new BadRequestException('PollId is missing');

		await expect(
			mockGetLatestReleaseUseCase.execute(mockGetLatestReleaseUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockReleasedPollRepository.getLatestReleaseInformation,
		).not.toBeCalled();
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).not.toBeCalled();
	});

	it('should throw error when poll is not existed', async () => {
		const mockPollId = '123';
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException('Poll is not existed');

		await expect(
			mockGetLatestReleaseUseCase.execute(mockGetLatestReleaseUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.getLatestReleaseInformation,
		).not.toBeCalled();
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).not.toBeCalled();
	});

	it('should throw error when no information of version found', async () => {
		const mockPollId = '123';
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			latestVersion: '0',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockReleasedPollRepository.getLatestReleaseInformation.mockResolvedValueOnce(
			null,
		);

		const expectedError = new BadRequestException(
			'This Poll that have not been published yet',
		);

		await expect(
			mockGetLatestReleaseUseCase.execute(mockGetLatestReleaseUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).not.toBeCalled();
	});

	it('should throw error when no questions found', async () => {
		const mockPollId = '123';
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			latestVersion: '2',
		});

		const newReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: '2',
			startDate: 'start date',
			endDate: 'end date',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockReleasedPollRepository.getLatestReleaseInformation.mockResolvedValueOnce(
			newReleasedPoll,
		);

		mockReleasedPollRepository.getQuestionsOfLatestRelease.mockResolvedValueOnce(
			null,
		);

		const expectedError = new BadRequestException(
			'Invalid Poll with no questions',
		);

		await expect(
			mockGetLatestReleaseUseCase.execute(mockGetLatestReleaseUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.getLatestReleaseInformation,
		).toBeCalledWith(mockPoll.id, mockPoll.latestVersion);
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).toBeCalledWith(mockPoll.id, mockPoll.latestVersion);
	});

	it('should throw error when getQuestionsByLatestRelease execute fail', async () => {
		const mockPollId = '123';
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			latestVersion: '2',
		});

		const mockReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: '2',
			startDate: 'start date',
			endDate: 'end date',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockReleasedPollRepository.getLatestReleaseInformation.mockResolvedValueOnce(
			mockReleasedPoll,
		);

		mockReleasedPollRepository.getQuestionsOfLatestRelease.mockRejectedValueOnce(
			new UnknownException('some error'),
		);

		const expectedError = new UnknownException('some error');

		await expect(
			mockGetLatestReleaseUseCase.execute(mockGetLatestReleaseUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).toBeCalledWith(mockPoll.id, mockPoll.latestVersion);
	});

	it('should execute successfully', async () => {
		const mockPollId = '123';
		const mockGetLatestReleaseUseCaseInput = new GetLatestReleaseUseCaseInput(
			mockPollId,
		);

		const mockGetLatestReleaseUseCase = new GetLatestReleaseUseCase(
			mockPollRepository,
			mockReleasedPollRepository,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const mockPoll = new Poll({
			creatorEmail: 'an@gmail.com',
			title: 'sometitle',
			description: 'somedescription',
			latestVersion: '2',
		});

		const mockReleasedPoll = new ReleasedPoll({
			pollId: '123',
			version: '2',
			startDate: 'start date',
			endDate: 'end date',
		});

		jest.spyOn<any, string>(moment, 'valueOf').mockReturnValueOnce(555);

		const mockQuestions: Question[] = [
			new Question({
				pollId: mockPoll.id,
				answers: ['yes', 'no'],
				content: 'are you ready',
				isRequired: true,
				questionType: 'MULTIPLE',
				questionId: '555',
			}),
		];

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		mockReleasedPollRepository.getLatestReleaseInformation.mockResolvedValueOnce(
			mockReleasedPoll,
		);

		mockReleasedPollRepository.getQuestionsOfLatestRelease.mockResolvedValueOnce(
			mockQuestions,
		);

		const result = await mockGetLatestReleaseUseCase.execute(
			mockGetLatestReleaseUseCaseInput,
		);

		expect(mockPollRepository.findPollById).toBeCalledWith('123');
		expect(
			mockReleasedPollRepository.getLatestReleaseInformation,
		).toBeCalledWith(mockPoll.id, mockPoll.latestVersion);
		expect(
			mockReleasedPollRepository.getQuestionsOfLatestRelease,
		).toBeCalledWith(mockPoll.id, mockPoll.latestVersion);
		expect(result).toEqual<GetLatestReleaseResponseDto>({
			message: 'Successfully get latest release',
			latestRelease: new ReleasedPoll({
				pollId: mockReleasedPoll.pollId,
				version: mockReleasedPoll.version,
				createdAt: mockReleasedPoll.createdAt,
				startDate: mockReleasedPoll.startDate,
				endDate: mockReleasedPoll.endDate,
				questions: mockQuestions,
			}),
		});
	});
});
