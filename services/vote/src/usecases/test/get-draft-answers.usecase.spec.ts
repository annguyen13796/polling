import { BadRequestException, NotFoundException } from '@libs/common';
import {
	Draft,
	DraftAnswersForQuestion,
	IDraftRepository,
} from '../../domains';
import {
	GetDraftAnswersUseCase,
	GetDraftAnswersUseCaseInput,
} from '../get-draft-answers.usecase';

describe('GetDraftAnswersUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockDraftRepository: jest.Mocked<IDraftRepository> = {
		create: jest.fn(),
		getDraftAnswers: jest.fn(),
		getDraftInformation: jest.fn(),
		putDraftAnswersForQuestion: jest.fn(),
		putDraftInformation: jest.fn(),
		update: jest.fn(),
	};

	it(`should throw poll id missing when pollId is undefined`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).not.toBeCalled();
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should throw version missing when pollVersion is undefined`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Version is missing');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).not.toBeCalled();
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should throw poll Start Date missing when startDate is undefined`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Start Date is missing');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).not.toBeCalled();
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should throw poll End Date missing when endDate is undefined`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('End Date is missing');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).not.toBeCalled();
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should throw poll Voter Email missing when voterEmail is undefined`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = undefined;

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Voter Email is missing');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).not.toBeCalled();
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should throw BadRequestException when already voted`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const mockReturnDraft: Draft = new Draft({
			pollId,
			pollVersion,
			startDate,
			endDate,
			hasBeenSubmitted: true,
			voterEmail,
		});
		mockDraftRepository.getDraftInformation.mockResolvedValue(mockReturnDraft);
		const expectedError = new BadRequestException('You have already voted');

		await expect(
			getDraftAnswersUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraftInformation).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		expect(mockDraftRepository.getDraftAnswers).not.toBeCalled();
	});

	it(`should get draft answers successfully`, async () => {
		const getDraftAnswersUseCase = new GetDraftAnswersUseCase(
			mockDraftRepository,
		);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const mockReturnDraft: Draft = new Draft({
			pollId,
			pollVersion,
			startDate,
			endDate,
			hasBeenSubmitted: false,
			voterEmail,
		});
		const mockReturnDraftAnswersForQuestions: DraftAnswersForQuestion[] = [
			new DraftAnswersForQuestion({
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
				question: 'Mock Question',
				questionId: 'Mock Question Id',
				answers: ['mock answer1', 'mock answer2'],
			}),
		];
		mockDraftRepository.getDraftInformation.mockResolvedValue(mockReturnDraft);
		mockDraftRepository.getDraftAnswers.mockResolvedValue(
			mockReturnDraftAnswersForQuestions,
		);

		const result = await getDraftAnswersUseCase.execute(
			getDraftAnswersUseCaseInput,
		);
		expect(result).toEqual({
			message: 'get draft answers successfully',
			draftAnswers: mockReturnDraftAnswersForQuestions,
		});

		expect(mockDraftRepository.getDraftInformation).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		expect(mockDraftRepository.getDraftAnswers).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
	});
});
