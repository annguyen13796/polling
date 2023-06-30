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

const mockValueOf = jest.fn();
const mockToISOString = jest.fn();
jest.mock('moment', () => {
	return function () {
		return {
			valueOf: () => mockValueOf(),
			toISOString: () => mockToISOString(),
		};
	};
});

describe('Create Question Use case Test', () => {
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

	test('should throw error when content is null or undefined', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: '',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'12344322',
		);

		const expectedError = new BadRequestException('Missing content');

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(mockPollRepository.createQuestion).not.toBeCalled();
	});

	test('should throw error when pollId is null or undefined', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			undefined,
		);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});

	test('should throw error when question id is null or undefined', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: undefined,
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		const expectedError = new BadRequestException('Missing questionId');

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
	});
	test('should throw error when question type is null or undefined', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: null,
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		const expectedError = new BadRequestException('Missing questionType');

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
	});
	test('should throw error when answers is null or undefined', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: undefined,
			questionType: 'CHECKBOX',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		const expectedError = new BadRequestException('Missing answers');

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
	});

	test('should throw error when provided empty answer list', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		const expectedError = new BadRequestException(
			'Answer list of this question type can not be empty',
		);

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});
	test('should throw error when isRequired type is not boolean', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: undefined,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		const expectedError = new BadRequestException(
			'isRequired must be boolean type',
		);

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.createQuestion).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});
	test('should throw error poll Id is not existed', async () => {
		const mockCreateQuestionUseCase = new CreateQuestionUseCase(
			mockPollRepository,
		);

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'422343',
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException(
			'Poll with id 422343 is not existed',
		);

		await expect(
			mockCreateQuestionUseCase.execute(mockCreateQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockPollRepository.findPollById).toBeCalledWith('422343');
		expect(mockPollRepository.createQuestion).not.toBeCalled();
	});

	test('Create Question successfully with valid dto', async () => {
		const createQuestionUseCase = new CreateQuestionUseCase(mockPollRepository);

		mockValueOf.mockReturnValue('555');
		mockToISOString.mockReturnValue('23456789');

		const mockCreateQuestionDto: CreateQuestionDto = {
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		};

		const mockQuestion = new Question({
			pollId: '123',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: '1678076899515',
		});

		const mockPoll = new Poll({
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(mockPoll);

		const mockCreateQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			mockCreateQuestionDto,
			'123',
		);
		mockPollRepository.createQuestion.mockResolvedValue();

		const result = await createQuestionUseCase.execute(
			mockCreateQuestionUseCaseInput,
		);

		expect(result).toEqual({
			message: 'Create Question successfully',
			questionId: '1678076899515',
		});

		expect(mockPollRepository.createQuestion).toBeCalledWith(mockQuestion);
	});
});
