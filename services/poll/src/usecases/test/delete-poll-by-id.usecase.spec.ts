import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, Poll } from '../../domains';
import {
	DeletePollByIdUseCaseInput,
	DeletePollByIdUseCase,
} from '../delete-poll-by-id.usecase';

describe('delete poll by id use case test', () => {
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

	it('Should throw error when pollId is missing', async () => {
		const mockPollId = undefined;

		const mockDeletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			mockPollId,
		);

		const mockDeletePollByIdUseCase = new DeletePollByIdUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			mockDeletePollByIdUseCase.execute(mockDeletePollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.deletePollById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const mockPollId = '1234';

		const mockDeletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			mockPollId,
		);

		const mockDeletePollByIdUseCaseMock = new DeletePollByIdUseCase(
			mockPollRepository,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			mockDeletePollByIdUseCaseMock.execute(mockDeletePollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.deletePollById).not.toBeCalled();
	});

	it('Should execute successfully with valid pollId and the poll is existed on the DB', async () => {
		const mockPollId = '1234';

		const mockDeletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			mockPollId,
		);

		const mockDeletePollByIdUseCaseMock = new DeletePollByIdUseCase(
			mockPollRepository,
		);

		const mockExistedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockExistedPoll);

		const result = await mockDeletePollByIdUseCaseMock.execute(
			mockDeletePollByIdUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Successfully Delete Poll',
			pollId: '1234',
		});
		expect(mockPollRepository);
		expect(mockPollRepository.deletePollById).toBeCalledWith('1234');
	});
});
