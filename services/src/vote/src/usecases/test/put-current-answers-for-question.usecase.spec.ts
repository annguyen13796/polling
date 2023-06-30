import { BadRequestException, NotFoundException } from '@libs/common';
import {
	Draft,
	CurrentAnswersForQuestion,
	IDraftRepository,
	PutCurrentAnswersForQuestionDto,
} from '../../domains';
import {
	PutCurrentAnswersForQuestionUseCase,
	PutCurrentAnswersForQuestionUseCaseInput,
} from '../put-current-answers-for-question.usecase';

describe('PutDraftAnswersForQuestionUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockDraftRepository: jest.Mocked<IDraftRepository> = {
		create: jest.fn(),
		getCurrentAnswersForDraft: jest.fn(),
		getDraft: jest.fn(),
		putCurrentAnswersForQuestion: jest.fn(),
		putDraft: jest.fn(),
		update: jest.fn(),
	};

	it(`should throw poll id missing when pollId is undefined`, async () => {
		const putCurrentAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putCurrentAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			putCurrentAnswersForQuestionUseCase.execute(
				putCurrentAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw poll version missing when pollId is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Poll Version is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Start Date is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw end date missing when endDate is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('End Date is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw voter email missing when voterEmail is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = undefined;
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Voter Email is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw question id missing when questionId is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = undefined;

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Question Id is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw question missing when question in dto is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: '',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Question is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should throw answers missing when answers in dto is undefined`, async () => {
		const putDraftAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: null,
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putDraftAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const expectedError = new BadRequestException('Answers List is missing');

		await expect(
			putDraftAnswersForQuestionUseCase.execute(
				putDraftAnswersForQuestionUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putCurrentAnswersForQuestion).not.toBeCalled();
	});

	it(`should execute successfully`, async () => {
		const putCurrentAnswersForQuestionUseCase =
			new PutCurrentAnswersForQuestionUseCase(mockDraftRepository);

		const mockPutCurrentAnswersForQuestionDto: PutCurrentAnswersForQuestionDto =
			{
				question: 'mock question',
				answers: ['mock answer1', 'mock answer2'],
			};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';
		const questionId: string = 'questionId';

		const putCurrentAnswersForQuestionUseCaseInput =
			new PutCurrentAnswersForQuestionUseCaseInput(
				mockPutCurrentAnswersForQuestionDto,
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				questionId,
			);

		const result = await putCurrentAnswersForQuestionUseCase.execute(
			putCurrentAnswersForQuestionUseCaseInput,
		);
		expect(result).toEqual({
			message: 'put answers for question successfully',
		});

		expect(mockDraftRepository.putCurrentAnswersForQuestion).toBeCalled();
	});
});
