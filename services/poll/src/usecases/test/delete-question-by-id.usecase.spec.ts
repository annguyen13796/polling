import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, Poll } from '../../domains';
import {
	DeleteQuestionByIdUseCase,
	DeleteQuestionByIdUseCaseInput,
} from '../delete-question-by-id.usecase';

describe('delete question by id use case test', () => {
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

	it('Should throw error when questionId is missing', async () => {
		const mockPollId = '1234';
		const mockQuestionId = undefined;

		const mockDeleteQuestionByIdUseCaseInput =
			new DeleteQuestionByIdUseCaseInput(mockPollId, mockQuestionId);

		const mockDeleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Question Id is missing');

		await expect(
			mockDeleteQuestionByIdUseCase.execute(mockDeleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when pollId is missing', async () => {
		const mockPollId = undefined;
		const questionId = '1234';

		const mockDeleteQuestionByIdUseCaseInput =
			new DeleteQuestionByIdUseCaseInput(mockPollId, questionId);

		const mockDeleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			mockDeleteQuestionByIdUseCase.execute(mockDeleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const mockPollId = '2323';
		const mockQuestionId = '1234';

		const mockDeleteQuestionByIdUseCaseInput =
			new DeleteQuestionByIdUseCaseInput(mockPollId, mockQuestionId);

		const mockDeleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
			mockPollRepository,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			mockDeleteQuestionByIdUseCase.execute(mockDeleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith(mockPollId);
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question is not existed', async () => {
		const mockPollId = '1234';
		const mockQuestionId = '1234';

		const mockDeleteQuestionByIdUseCaseInput =
			new DeleteQuestionByIdUseCaseInput(mockPollId, mockQuestionId);

		const mockDeleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
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
		mockPollRepository.deleteQuestionById.mockResolvedValueOnce(false);

		const expectedError = new NotFoundException('Question is not existed');

		await expect(
			mockDeleteQuestionByIdUseCase.execute(mockDeleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith(mockPollId);
		expect(mockPollRepository.deleteQuestionById).toBeCalledWith(
			mockPollId,
			mockQuestionId,
		);
	});

	it('Should execute successfully with valid pollId and questionId, the poll and question is existed on the DB', async () => {
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockDeleteQuestionByIdUseCaseInput =
			new DeleteQuestionByIdUseCaseInput(mockPollId, mockQuestionId);

		const mockDeleteQuestionByIdUseCase = new DeleteQuestionByIdUseCase(
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
		mockPollRepository.deleteQuestionById.mockResolvedValueOnce(true);

		const result = await mockDeleteQuestionByIdUseCase.execute(
			mockDeleteQuestionByIdUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Successfully Delete Question',
			questionId: mockQuestionId,
		});

		expect(mockPollRepository.findPollById).toBeCalledWith(mockPollId);
		expect(mockPollRepository.deleteQuestionById).toBeCalledWith(
			mockPollId,
			mockQuestionId,
		);
	});
});
