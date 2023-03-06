import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { CreatePollDto, IPollRepository, Poll } from '../../domains';
import {
	CreatePollUseCase,
	CreatePollUseCaseInput,
} from '../create-poll.usecase';

describe('CreatePollUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const pollRepositoryMock: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		update: jest.fn(),
		deletePollById: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		findPollById: jest.fn(),
		generateVoteURL: jest.fn(),
		updatePollGeneralInformation: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
	};

	it('should throw error when creator email is null/undefined', async () => {
		const createPollUseCase = new CreatePollUseCase(pollRepositoryMock);

		const pollDtoMock: CreatePollDto = {
			creatorEmail: undefined,
			title: 'sometitle',
			description: 'somedsc',
		};

		const createPollUseCaseInput = new CreatePollUseCaseInput(pollDtoMock);

		const expectedError = new BadRequestException(
			'Creator Email cannot be null',
		);

		await expect(
			createPollUseCase.execute(createPollUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.create).not.toBeCalled();
	});

	it('should throw error when title is null/undefined', async () => {
		const createPollUseCase = new CreatePollUseCase(pollRepositoryMock);

		const pollDtoMock: CreatePollDto = {
			creatorEmail: 'td@gmail.com',
			title: undefined,
			description: 'somedsc',
		};

		const createPollUseCaseInput = new CreatePollUseCaseInput(pollDtoMock);

		const expectedError = new BadRequestException('Title cannot be null');

		await expect(
			createPollUseCase.execute(createPollUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.create).not.toBeCalled();
	});

	it('should create Poll successfully with valid dto', async () => {
		const createPollUseCase = new CreatePollUseCase(pollRepositoryMock);

		const pollDtoMock: CreatePollDto = {
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		};

		const createPollUseCaseInput = new CreatePollUseCaseInput(pollDtoMock);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const pollMock = new Poll({
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		});

		pollRepositoryMock.create.mockResolvedValueOnce();

		const result = await createPollUseCase.execute(createPollUseCaseInput);
		expect(result).toEqual({
			message: 'Create Poll successfully',
			pollId: pollMock.id,
		});
		expect(pollRepositoryMock.create).toBeCalledWith(pollMock);
	});
});
