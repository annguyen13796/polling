import { BadRequestException, NotFoundException } from '@libs/common';
import moment from 'moment';
import {
	CreateQuestionDto,
	IPollRepository,
	Poll,
	Question,
} from '../../domains';
import {
	CreateQuestionUseCase,
	CreateQuestionUseCaseInput,
} from '../create-question.usecase';

const valueOfMock = jest.fn();
const toISOStringMock = jest.fn();
jest.mock('moment', () => {
	return function () {
		return {
			valueOf: () => valueOfMock(),
			toISOString: () => toISOStringMock(),
		};
	};
});

describe('CreatQuestionUsecase', () => {
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

	test('should throw error when content is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: '',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'12344322',
		);

		const expectedError = new BadRequestException('Missing content');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
	});

	test('should throw error when pollId is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			undefined,
		);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});

	test('should throw error when question type is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: null,
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'422343',
		);

		const expectedError = new BadRequestException('Missing questionType');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
	});
	test('should throw error when answers is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: undefined,
			questionType: 'CHECKBOX',
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'422343',
		);

		const expectedError = new BadRequestException('Missing answers');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
	});

	test('should throw error when provided empty answer list', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'422343',
		);

		const expectedError = new BadRequestException(
			'Answer list of this question type can not be empty',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});
	test('should throw error when isRequired type is not boolean', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: undefined,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'422343',
		);

		const expectedError = new BadRequestException(
			'isRequired must be boolean type',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});
	test('should throw error poll Id is not existed', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'422343',
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException(
			'Poll with id 422343 is not existed',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('422343');
		expect(pollRepositoryMock.createQuestion).not.toBeCalled();
	});

	test('Create Question successfully with valid dto', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(pollRepositoryMock);

		valueOfMock.mockReturnValue('555');
		toISOStringMock.mockReturnValue('23456789');

		const questionDtoMock: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const questionMock = new Question({
			pollId: '123',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		});

		const pollMock = new Poll({
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
			'123',
		);
		pollRepositoryMock.createQuestion.mockResolvedValue();

		const result = await creatQuestionUsecase.execute(
			createQuestionUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Create Question successfully',
			questionId: '1678076899515',
		});

		expect(pollRepositoryMock.createQuestion).toBeCalledWith(questionMock);
	});
});
