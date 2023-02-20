import { BadRequestException, NotFoundException } from '@libs/common';
import moment from 'moment';
import {
	CreateQuestionDto,
	IPollRepository,
	IQuestionRepository,
	Poll,
	Question,
} from '../../domains';
import {
	CreateQuestionUseCase,
	CreateQuestionUseCaseInput,
} from '../create-question.usecase';

describe('CreatQuestionUsecase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const questionRepositoryMock: jest.Mocked<IQuestionRepository> = {
		create: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		update: jest.fn(),
	};

	const pollRepositoryMock: jest.Mocked<IPollRepository> = {
		create: jest.fn(),
		getPollsByCreatorEmail: jest.fn(),
		update: jest.fn(),
		deletePollById: jest.fn(),
		getQuestionsByPollId: jest.fn(),
		findPollById: jest.fn(),
	};

	test('should throw error when content is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '12344322',
			content: '',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		const expectedError = new BadRequestException('Missing content');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).not.toBeCalled();
		expect(questionRepositoryMock.create).not.toBeCalled();
	});

	test('should throw error when pollId is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(questionRepositoryMock.create).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});

	test('should throw error when question type is null or undefined', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '422343',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: null,
			isRequired: true,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		const expectedError = new BadRequestException('Missing questionType');

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(questionRepositoryMock.create).not.toBeCalled();
	});

	test('should throw error when provided empty answer list', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '422343',
			content: 'Do you like playing aov',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		const expectedError = new BadRequestException(
			'Answer list can not be empty',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(questionRepositoryMock.create).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});
	test('should throw error when isRequired type is not boolean', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '422343',
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: undefined,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		const expectedError = new BadRequestException(
			'isRequired must be boolean type',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(questionRepositoryMock.create).not.toBeCalled();
		expect(pollRepositoryMock.findPollById).not.toBeCalled();
	});
	test('should throw error poll Id is not existed', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '123',
			content: 'Do you like playing aov',
			answers: ['yes', 'no'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);

		pollRepositoryMock.findPollById.mockResolvedValueOnce(null);

		const expectedError = new NotFoundException(
			'Poll with id 123 is not existed',
		);

		await expect(
			creatQuestionUsecase.execute(createQuestionUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(pollRepositoryMock.findPollById).toBeCalledWith('123');
		expect(questionRepositoryMock.create).not.toBeCalled();
	});

	test('Create Question successfully with valid dto', async () => {
		const creatQuestionUsecase = new CreateQuestionUseCase(
			questionRepositoryMock,
			pollRepositoryMock,
		);

		jest
			.spyOn<any, any>(Date, 'now')
			.mockReturnValue(new Date().getMilliseconds);

		const questionDtoMock: CreateQuestionDto = {
			pollId: '123',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const questionMock = new Question({
			pollId: '123',
			content: 'Do you like playing aov',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		});

		const pollMock = new Poll({
			creatorEmail: 'td@gmail.com',
			title: 'sometitle',
			description: 'somedsc',
		});

		pollRepositoryMock.findPollById.mockResolvedValueOnce(pollMock);

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			questionDtoMock,
		);
		questionRepositoryMock.create.mockResolvedValue();

		const result = await creatQuestionUsecase.execute(
			createQuestionUseCaseInput,
		);

		expect(result).toEqual({ message: 'Create Question successfully' });
		expect(questionRepositoryMock.create).toBeCalledWith(questionMock);
	});
});
