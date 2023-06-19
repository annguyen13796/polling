import { BadRequestException, NotFoundException } from '@libs/common';
import {
	CreateQuestionDto,
	IPollRepository,
	Poll,
	Question,
} from '../../domains';
import {
	GetQuestionsByPollIdUseCase,
	GetQuestionsByPollIdUseCaseInput,
} from '../get-questions-by-poll-id.usecase';

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
		updatePoll: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
	};

	it('Should throw error when pollId is missing', async () => {
		const pollId = undefined;

		const getQuestionsByPollIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(pollId);

		const getQuestionByPollIdUseCaseMock = new GetQuestionsByPollIdUseCase(
			pollRepositoryMock,
		);

		const expectedError = new BadRequestException('Poll ID is required');

		await expect(
			getQuestionByPollIdUseCaseMock.execute(getQuestionsByPollIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const pollId = '222';

		const getQuestionsByPollIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(pollId);

		const getQuestionByPollIdUseCaseMock = new GetQuestionsByPollIdUseCase(
			pollRepositoryMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);
		const expectedError = new BadRequestException(
			'Poll with id 222 is not existed',
		);

		await expect(
			getQuestionByPollIdUseCaseMock.execute(getQuestionsByPollIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should get questions by poll id successfully with existed poll and valid pollId', async () => {
		const pollId = '222';

		const getQuestionsByPollIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(pollId);

		const getQuestionByPollIdUseCaseMock = new GetQuestionsByPollIdUseCase(
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
		const questionsMock = [
			new Question({
				pollId: '222',
				answers: ['a'],
				content: 'question',
				isRequired: false,
				questionId: '222',
				questionType: 'CHECKBOX',
			}),
		];

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);
		pollRepositoryMock.getQuestionsByPollId.mockResolvedValueOnce(
			questionsMock,
		);

		const result = await getQuestionByPollIdUseCaseMock.execute(
			getQuestionsByPollIdUseCaseInput,
		);

		expect(result).toEqual(questionsMock);
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalledWith(pollId);
	});
});
