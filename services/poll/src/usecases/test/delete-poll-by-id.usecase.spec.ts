import { BadRequestException, NotFoundException } from '@libs/common';
import { IPollRepository, Poll, DeletePollDto } from '../../domains';
import {
	DeletePollByIdUseCaseInput,
	DeletePollByIdUseCase,
} from '../delete-poll-by-id.usecase';

describe('delete poll by id usecase test', () => {
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
	};

	it('Should throw error when pollId is missing', async () => {
		const pollIdDto: DeletePollDto = {
			pollId: undefined,
		};

		const deletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			pollIdDto,
		);

		const deletePollByIdUseCaseMock = new DeletePollByIdUseCase(
			pollRepositoryMock,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			deletePollByIdUseCaseMock.execute(deletePollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deletePollById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const pollIdDto: DeletePollDto = {
			pollId: '1234',
		};

		const deletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			pollIdDto,
		);

		const deletePollByIdUseCaseMock = new DeletePollByIdUseCase(
			pollRepositoryMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException('Poll is not existed');

		await expect(
			deletePollByIdUseCaseMock.execute(deletePollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deletePollById).not.toBeCalled();
	});

	it('Should execute successfully with valid pollId and the poll is existed on the DB', async () => {
		const pollIdDto: DeletePollDto = {
			pollId: '1234',
		};

		const deletePollByIdUseCaseInput = new DeletePollByIdUseCaseInput(
			pollIdDto,
		);

		const deletePollByIdUseCaseMock = new DeletePollByIdUseCase(
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

		const result = await deletePollByIdUseCaseMock.execute(
			deletePollByIdUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Successfully Delete Poll',
			pollId: '1234',
		});
		expect(pollRepositoryMock);
		expect(pollRepositoryMock.deletePollById).toBeCalledWith('1234');
	});
});
