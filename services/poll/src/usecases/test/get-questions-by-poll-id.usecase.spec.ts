import { BadRequestException, NotFoundException } from '@libs/common';
import { GetQuestionsDto, IPollRepository, Question } from '../../domains';
import {
	GetQuestionsByPollIdUseCaseInput,
	GetQuestionsByPollIdUseCase,
} from '../get-questions-by-poll-id.usecase';

describe('GetQuestionsByPollIdUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const pollRepositoryMock: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		update: jest.fn(),
		deletePollById: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		findPollById: jest.fn(),
	};

	test(`Get poll's list question failed when pollId is blank`, async () => {
		const getQuestionsByPollIdUseCase = new GetQuestionsByPollIdUseCase(
			pollRepositoryMock,
		);

		const getQuestionDto: GetQuestionsDto = {
			pollId: '',
		};
		const getPollQuestionsByIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(getQuestionDto);

		const expectedError = new BadRequestException('Poll ID is required');

		await expect(
			getQuestionsByPollIdUseCase.execute(getPollQuestionsByIdUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.getQuestionsByPollId).not.toBeCalled();
	});

	test('Should throw error when poll is not existed', async () => {
		const getQuestionDto: GetQuestionsDto = {
			pollId: '123',
		};

		const getPollQuestionsByIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(getQuestionDto);

		const getQuestionsByPollIdUseCase = new GetQuestionsByPollIdUseCase(
			pollRepositoryMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException(
			'Poll with id 123 is not existed',
		);

		await expect(
			getQuestionsByPollIdUseCase.execute(getPollQuestionsByIdUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(pollRepositoryMock.getQuestionsByPollId).not.toBeCalled();
	});

	test(`Get poll's list question successfully with a pollId`, async () => {
		const getQuestionsByPollIdUseCase = new GetQuestionsByPollIdUseCase(
			pollRepositoryMock,
		);

		const questionMock = new Question({
			content: 'a question',
			answers: ['a', 'b'],
			isRequired: true,
			pollId: '123',
			questionType: 'CHECKBOX',
		});
		pollRepositoryMock.getQuestionsByPollId.mockResolvedValueOnce([
			questionMock,
		]);

		const getQuestionDto: GetQuestionsDto = {
			pollId: '123',
		};
		const getPollQuestionsByIdUseCaseInput =
			new GetQuestionsByPollIdUseCaseInput(getQuestionDto);

		const result = await getQuestionsByPollIdUseCase.execute(
			getPollQuestionsByIdUseCaseInput,
		);

		expect(result).toEqual([questionMock]);
		expect(pollRepositoryMock.getQuestionsByPollId).toBeCalled();
	});
});
