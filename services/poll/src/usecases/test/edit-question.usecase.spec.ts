import { BadRequestException, NotFoundException } from '@libs/common';
import {
	EditQuestionDto,
	IPollRepository,
	Poll,
	Question,
} from '../../domains';
import {
	EditQuestionUseCase,
	EditQuestionUseCaseInput,
} from '../edit-question.usecase';

describe('Edit question use case test', () => {
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
		generateVoteURL: jest.fn(),
		updatePollGeneralInformation: jest.fn(),
		createQuestion: jest.fn(),
		findQuestionByPollIdAndQuestionId: jest.fn(),
		updateQuestionGeneralInformation: jest.fn(),
		deleteQuestionById: jest.fn(),
		updatePoll: jest.fn(),
	};

	const mockQuestionModel: jest.Mocked<
		Pick<
			Question,
			| 'updateAnswers'
			| 'updateContent'
			| 'updateIsRequired'
			| 'updateQuestionType'
		>
	> = {
		updateAnswers: jest.fn(),
		updateContent: jest.fn(),
		updateIsRequired: jest.fn(),
		updateQuestionType: jest.fn(),
	};

	it('Should throw error when pollId is missing', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = undefined;
		const mockEditQuestionId = '1234';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockEditQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
	});

	it('Should throw error when question id is missing', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockEditQuestionId = undefined;

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockEditQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException('Missing questionId');

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question content is missing', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: '',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const editQuestionUseCaseMock = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException('Missing content');

		await expect(
			editQuestionUseCaseMock.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question answers is missing', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: undefined,
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException('Missing answers');

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question type is missing', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['yes'],
			questionType: undefined,
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException('Missing questionType');

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when isRequired is not boolean type (true/false)', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: undefined,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException(
			'isRequired must be boolean type',
		);

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});
	it('Should throw error when question answers is empty with type is not TextBox', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: [],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const expectedError = new BadRequestException(
			'Answer list of this question type can not be empty',
		);

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.findPollById).not.toBeCalled();
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);

		const expectedError = new BadRequestException(
			'Poll with id 1234 is not existed',
		);

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
		expect(mockPollRepository.findPollById).toBeCalledWith(mockPollId);
		expect(
			mockPollRepository.findQuestionByPollIdAndQuestionId,
		).not.toBeCalled();
		expect(mockQuestionModel.updateContent).not.toBeCalled();
		expect(mockQuestionModel.updateQuestionType).not.toBeCalled();
		expect(mockQuestionModel.updateAnswers).not.toBeCalled();
		expect(mockQuestionModel.updateIsRequired).not.toBeCalled();
		expect(
			mockPollRepository.updateQuestionGeneralInformation,
		).not.toBeCalled();
		expect(mockPollRepository.deleteQuestionById).not.toBeCalled();
	});

	it('Should throw error when question is not existed', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};
		const mockPollId = '1234';
		const mockQuestionId = '222';

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(existedPoll);
		mockPollRepository.findQuestionByPollIdAndQuestionId.mockResolvedValueOnce(
			null,
		);

		const expectedError = new NotFoundException(
			'Question with id 222 is not existed',
		);

		await expect(
			mockEditQuestionUseCase.execute(mockEditQuestionUseCaseInput),
		).rejects.toThrow(expectedError);
	});

	it('Should edit question successfully with pollId, questionId, questionDto; poll and question are existed in DB', async () => {
		const mockEditQuestionDto: EditQuestionDto = {
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
		};

		const mockPollId = '1234';

		const mockQuestionId = '222';

		const mockQuestion = new Question({
			pollId: '1234',
			content: 'Question',
			answers: ['Sure', 'A little bit'],
			questionType: 'MULTIPLE',
			isRequired: true,
			questionId: mockQuestionId,
		});

		const mockEditQuestionUseCaseInput = new EditQuestionUseCaseInput(
			mockEditQuestionDto,
			mockPollId,
			mockQuestionId,
		);

		const mockEditQuestionUseCase = new EditQuestionUseCase(mockPollRepository);

		const existedPoll = new Poll({
			id: '1234',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(existedPoll);
		mockPollRepository.findQuestionByPollIdAndQuestionId.mockResolvedValueOnce(
			mockQuestion,
		);
		mockPollRepository.updateQuestionGeneralInformation.mockResolvedValueOnce();

		const result = await mockEditQuestionUseCase.execute(
			mockEditQuestionUseCaseInput,
		);

		expect(result).toEqual({ message: 'Edit Question successfully' });
		expect(mockPollRepository.updateQuestionGeneralInformation).toBeCalledWith(
			mockQuestion,
		);
	});
});
