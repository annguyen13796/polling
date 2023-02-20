import { BadRequestException, NotFoundException } from '@libs/common';
import { GetPollByIdDto, IPollRepository, Poll } from '../../domains';
import {
	GetPollByIdUseCaseInput,
	GetPollByIdUseCase,
} from '../get-poll-by-id.usecase';

describe('get Poll by Id usecase test', () => {
	beforeAll(() => {
		jest.clearAllMocks;
	});

	const pollRepositoryMock: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		deletePollById: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		update: jest.fn(),
		findPollById: jest.fn(),
	};

	it('Should throw error when poll Id is missing', async () => {
		const pollIdDto: GetPollByIdDto = {
			pollId: undefined,
		};

		const getPollByIdUseCaseInput = new GetPollByIdUseCaseInput(pollIdDto);

		const getPollByIdUseCaseMock = new GetPollByIdUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			getPollByIdUseCaseMock.execute(getPollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deletePollById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const pollIdDto: GetPollByIdDto = {
			pollId: '1234',
		};

		const getPollByIdUseCaseInput = new GetPollByIdUseCaseInput(pollIdDto);

		const deletePollByIdUseCaseMock = new GetPollByIdUseCase(
			pollRepositoryMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException('Poll is not existed');

		await expect(
			deletePollByIdUseCaseMock.execute(getPollByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deletePollById).not.toBeCalled();
	});

	it('Should execute successfully with valid pollId and the poll is existed on the DB', async () => {
		const pollIdDto: GetPollByIdDto = {
			pollId: '1234',
		};

		const getPollByIdUseCaseInput = new GetPollByIdUseCaseInput(pollIdDto);

		const getPollByIdUseCaseMock = new GetPollByIdUseCase(pollRepositoryMock);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);

		const result = await getPollByIdUseCaseMock.execute(
			getPollByIdUseCaseInput,
		);

		expect(pollRepositoryMock.findPollById).toBeCalledWith(pollIdDto.pollId);
		expect(result).toEqual(existedPoll);
	});
});
