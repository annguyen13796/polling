import { BadRequestException } from '@libs/common';
import {
	GetPollsByCreatorEmailDto,
	IPollRepository,
	Poll,
} from '../../domains';
import {
	GetPollsByCreatorEmailUseCase,
	GetPollsByCreatorEmailUseCaseInput,
} from '../get-polls-by-creator-email.usecase';

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
		updatePoll: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
	};

	test(`should throw error when creator email is null/undefined`, async () => {
		const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
			pollRepositoryMock,
		);
		const getPollDto: GetPollsByCreatorEmailDto = {
			creatorEmail: '',

			limit: 2,
		};

		const getAllPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(
			getPollDto,
		);
		const expectedError = new BadRequestException('Email is required');

		await expect(
			getAllPollsUseCase.execute(getAllPollsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(pollRepositoryMock.getPollsByCreatorEmail).not.toBeCalled();
	});

	test(`should throw error when limit is null/undefined`, async () => {
		const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
			pollRepositoryMock,
		);
		const getPollDto: GetPollsByCreatorEmailDto = {
			creatorEmail: 'an.nguyen@zoi.tech',
			limit: undefined,
		};

		const getAllPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(
			getPollDto,
		);
		const expectedError = new BadRequestException(
			'Limit is required for pagination',
		);

		await expect(
			getAllPollsUseCase.execute(getAllPollsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(pollRepositoryMock.getPollsByCreatorEmail).not.toBeCalled();
	});

	test(`should throw error when last poll id is not existed`, async () => {
		const getAllPollsUseCase = new GetPollsByCreatorEmailUseCase(
			pollRepositoryMock,
		);
		const getPollDto: GetPollsByCreatorEmailDto = {
			creatorEmail: 'an.nguyen@zoi.tech',
			limit: 2,
			lastPollId: '123',
		};

		const getAllPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(
			getPollDto,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException(
			`Last Poll with id 123 is not existed`,
		);

		await expect(
			getAllPollsUseCase.execute(getAllPollsUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getPollsByCreatorEmail).not.toBeCalled();
	});

	test('should get Polls successfully with valid email, limit', async () => {
		const getPollsUseCase = new GetPollsByCreatorEmailUseCase(
			pollRepositoryMock,
		);

		const getPollDtoMock: GetPollsByCreatorEmailDto = {
			creatorEmail: 'td@gmail.com',
			limit: 2,
		};

		const pollsMock = [
			new Poll({
				creatorEmail: 'td@gmail.com',
				title: 'sometitle1',
				description: 'somedsc1',
				id: '123',
			}),
			new Poll({
				creatorEmail: 'td@gmail.com',
				title: 'sometitle2',
				description: 'someds2',
				id: '456',
			}),
		];

		pollRepositoryMock.getPollsByCreatorEmail.mockResolvedValue({
			polls: pollsMock,
			lastPollId: '456',
		});

		const getPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(
			getPollDtoMock,
		);
		const result = await getPollsUseCase.execute(getPollsUseCaseInput);

		expect(result).toEqual({ lastPollId: '456', polls: pollsMock });
		expect(pollRepositoryMock.getPollsByCreatorEmail).toBeCalledWith(
			getPollDtoMock.creatorEmail,
			2,
			undefined,
		);
	});

	test('should get Polls successfully with valid email, limit, lastPollId', async () => {
		const getPollsUseCase = new GetPollsByCreatorEmailUseCase(
			pollRepositoryMock,
		);

		const getPollDtoMock: GetPollsByCreatorEmailDto = {
			creatorEmail: 'td@gmail.com',
			limit: 2,
			lastPollId: '111',
		};

		const pollsMock = [
			new Poll({
				creatorEmail: 'td@gmail.com',
				title: 'sometitle1',
				description: 'somedsc1',
				id: '123',
			}),
			new Poll({
				creatorEmail: 'td@gmail.com',
				title: 'sometitle2',
				description: 'someds2',
				id: '456',
			}),
		];

		pollRepositoryMock.getPollsByCreatorEmail.mockResolvedValue({
			polls: pollsMock,
			lastPollId: '456',
		});

		const getPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(
			getPollDtoMock,
		);
		const result = await getPollsUseCase.execute(getPollsUseCaseInput);

		expect(result).toEqual({ lastPollId: '456', polls: pollsMock });
		expect(pollRepositoryMock.getPollsByCreatorEmail).toBeCalledWith(
			getPollDtoMock.creatorEmail,
			2,
			'111',
		);
	});
});
