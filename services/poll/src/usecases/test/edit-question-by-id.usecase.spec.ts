import { BadRequestException, NotFoundException } from '@libs/common';
import {
	CreateQuestionDto,
	IPollRepository,
	Poll,
	Question,
} from '../../domains';
import {
	EditQuestionUseCase,
	EditQuestionUseCaseInput,
} from '../edit-question.usecase';

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

	it('Should throw error when pollId is missing', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = undefined;
		const questionId = '1234';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question id is missing', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = undefined;

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException('Missing questionId');

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question content is missing', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: '',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException('Missing content');

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question answers is missing', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: undefined,
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException('Missing answers');

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question answers is empty with type is not TextBox', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const expectedError = new BadRequestException(
			'Answer list of this question type can not be empty',
		);

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);
		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);
		const expectedError = new BadRequestException(
			'Poll with id 1234 is not existed',
		);

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(pollRepositoryMock.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question is not existed', async () => {
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);
		pollRepositoryMock.findQuestionByPollIdAndQuestionId.mockResolvedValueOnce(
			null,
		);

		const expectedError = new NotFoundException(
			'Question with id 222 is not existed',
		);

		await expect(
			editQuestionUseCaseMock.execute(editQuestionUseCaseInput),
		).rejects.toThrow(expectedError);
	});

	it('Should edit question successfully with pollId, questionId, questionDto; poll and question are existed in DB', async () => {
		const questionMock: Question = new Question({
			pollId: '1234',
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		});
		const questionDtoMock: CreateQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};
		const pollId = '1234';
		const questionId = '222';

		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			questionDtoMock,
			pollId,
			questionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(pollRepositoryMock);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(existedPoll);
		pollRepositoryMock.findQuestionByPollIdAndQuestionId.mockResolvedValueOnce(
			questionMock,
		);
		pollRepositoryMock.updateQuestionGeneralInformation.mockResolvedValueOnce();

		const result = await editQuestionUseCaseMock.execute(
			editQuestionUseCaseInput,
		);

		expect(result).toEqual({ message: 'Edit Question successfully' });
		expect(pollRepositoryMock.updateQuestionGeneralInformation).toBeCalledWith(
			questionMock,
		);
	});
});
