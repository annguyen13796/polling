import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, IQuestionRepository, Poll } from '../../domains';
import {
	DeleteQuestionByIdUseCase,
	DeleteQuestionByIdUseCaseInput,
} from '../delete-question-by-id.usecase';

describe('delete question by id usecase test', () => {
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

	it('Should throw error when questionId is missing', async () => {
		const pollId = '1234';
		const questionId = undefined;

		const deleteQuestionByIdUseCaseInput = new DeleteQuestionByIdUseCaseInput(
			pollId,
			questionId,
		);

		const deleteQuestionByIdUseCaseMock = new DeleteQuestionByIdUseCase(
			pollRepositoryMock,
		);

		const expectedError = new BadRequestException('Question Id is missing');

		await expect(
			deleteQuestionByIdUseCaseMock.execute(deleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when pollId is missing', async () => {
		const pollId = undefined;
		const questionId = '1234';

		const deleteQuestionByIdUseCaseInput = new DeleteQuestionByIdUseCaseInput(
			pollId,
			questionId,
		);

		const deleteQuestionByIdUseCaseMock = new DeleteQuestionByIdUseCase(
			pollRepositoryMock,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			deleteQuestionByIdUseCaseMock.execute(deleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const pollId = '2323';
		const questionId = '1234';

		const deleteQuestionByIdUseCaseInput = new DeleteQuestionByIdUseCaseInput(
			pollId,
			questionId,
		);

		const deleteQuestionByIdUseCaseMock = new DeleteQuestionByIdUseCase(
			pollRepositoryMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			deleteQuestionByIdUseCaseMock.execute(deleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deletePollById).not.toBeCalled();
	});

	it('Should throw error when question is not existed', async () => {
		const pollId = '1234';
		const questionId = '1234';

		const deleteQuestionByIdUseCaseInput = new DeleteQuestionByIdUseCaseInput(
			pollId,
			questionId,
		);

		const deleteQuestionByIdUseCaseMock = new DeleteQuestionByIdUseCase(
			pollRepositoryMock,
		);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);
		pollRepositoryMock.deletePollById.mockResolvedValueOnce();

		const expectedError = new NotFoundException('Question is not existed');

		await expect(
			deleteQuestionByIdUseCaseMock.execute(deleteQuestionByIdUseCaseInput),
		).rejects.toThrow(expectedError);
	});

	it('Should execute successfully with valid pollId and questionId, the poll and question is existed on the DB', async () => {
		const pollId = '1234';
		const questionId = '222';

		const deleteQuestionByIdUseCaseInput = new DeleteQuestionByIdUseCaseInput(
			pollId,
			questionId,
		);

		const deleteQuestionByIdUseCaseMock = new DeleteQuestionByIdUseCase(
			pollRepositoryMock,
		);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);
		pollRepositoryMock.deleteQuestionById.mockResolvedValueOnce(true);

		const result = await deleteQuestionByIdUseCaseMock.execute(
			deleteQuestionByIdUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Successfully Delete Question',
			questionId: '222',
		});
		expect(pollRepositoryMock);
	});
});
