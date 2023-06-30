import { BadRequestException } from '@libs/common';
import moment from 'moment';
import { CreatePollDto, IPollRepository, Poll } from '../../domains';
import {
	CreatePollUseCase,
	CreatePollUseCaseInput,
} from '../create-poll.usecase';

describe('Create Poll Use Case Test', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockPollRepository: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		update: jest.fn(),
		deletePollById: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		findPollById: jest.fn(),
		updatePoll: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
	};

	it('should throw error when creator email is null/undefined', async () => {
		const mockCreatePollUseCase = new CreatePollUseCase(mockPollRepository);

		const mockCreatePollDto: CreatePollDto = {
			creatorEmail: undefined,
			title: 'sometitle',
			description: 'somedsc',
		};

		const mockCreatePollUseCaseInput = new CreatePollUseCaseInput(
			mockCreatePollDto,
		);

		const expectedError = new BadRequestException('Missing creatorEmail');

		await expect(
			mockCreatePollUseCase.execute(mockCreatePollUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.create).not.toBeCalled();
	});

	it('should throw error when title is null/undefined', async () => {
		const mockCreatePollUseCase = new CreatePollUseCase(mockPollRepository);

		const mockCreatePollDto: CreatePollDto = {
			creatorEmail: 'td@gmail.com',
			title: undefined,
			description: 'somedsc',
		};

		const mockCreatePollUseCaseInput = new CreatePollUseCaseInput(
			mockCreatePollDto,
		);

		const expectedError = new BadRequestException('Missing title');

		await expect(
			mockCreatePollUseCase.execute(mockCreatePollUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.create).not.toBeCalled();
	});

	it('should throw error when both creator email and title is null/undefined', async () => {
		const mockCreatePollUseCase = new CreatePollUseCase(mockPollRepository);

		const mockCreatePollDto: CreatePollDto = {
			creatorEmail: undefined,
			title: undefined,
			description: 'somedsc',
		};

		const mockCreatePollUseCaseInput = new CreatePollUseCaseInput(
			mockCreatePollDto,
		);

		const expectedError = new BadRequestException(
			'Missing creatorEmail, title',
		);

		await expect(
			mockCreatePollUseCase.execute(mockCreatePollUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.create).not.toBeCalled();
	});

	it('should create Poll successfully with valid dto', async () => {
		const mockCreatePollUseCase = new CreatePollUseCase(mockPollRepository);

		const mockCreatePollDto: CreatePollDto = {
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		};

		const mockCreatePollUseCaseInput = new CreatePollUseCaseInput(
			mockCreatePollDto,
		);

		jest
			.spyOn<any, string>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const mockPoll = new Poll({
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		});

		mockPollRepository.create.mockResolvedValueOnce();

		const result = await mockCreatePollUseCase.execute(
			mockCreatePollUseCaseInput,
		);
		expect(result).toEqual({
			message: 'Create Poll successfully',
			pollId: mockPoll.id,
		});
		expect(mockPollRepository.create).toBeCalledWith(mockPoll);
	});
});
