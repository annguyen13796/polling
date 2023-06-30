import { BadRequestException, NotFoundException } from '@libs/common';
import {
	Draft,
	CurrentAnswersForQuestion,
	IDraftRepository,
} from '../../domains';
import {
	GetCurrentAnswersForDraftUseCase,
	GetCurrentAnswersForDraftUseCaseInput,
} from '../get-current-answers-for-draft.usecase';

describe('GetDraftAnswersUseCase', () => {
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
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).not.toBeCalled();
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should throw version missing when pollVersion is undefined`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);

		const expectedError = new BadRequestException('Version is missing');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).not.toBeCalled();
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should throw poll Start Date missing when startDate is undefined`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);

		const expectedError = new BadRequestException('Start Date is missing');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).not.toBeCalled();
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should throw poll End Date missing when endDate is undefined`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);

		const expectedError = new BadRequestException('End Date is missing');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).not.toBeCalled();
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should throw poll Voter Email missing when voterEmail is undefined`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = undefined;

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
				pollId,
				pollVersion,
				startDate,
				endDate,
				voterEmail,
			);

		const expectedError = new BadRequestException('Voter Email is missing');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).not.toBeCalled();
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should throw BadRequestException when already voted`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getDraftAnswersUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
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
		mockDraftRepository.getDraft.mockResolvedValue(mockReturnDraft);
		const expectedError = new BadRequestException('You have already voted');

		await expect(
			getCurrentAnswersForDraftUseCase.execute(getDraftAnswersUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.getDraft).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		expect(mockDraftRepository.getCurrentAnswersForDraft).not.toBeCalled();
	});

	it(`should get draft answers successfully`, async () => {
		const getCurrentAnswersForDraftUseCase =
			new GetCurrentAnswersForDraftUseCase(mockDraftRepository);

		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const getCurrentAnswersForDraftUseCaseInput =
			new GetCurrentAnswersForDraftUseCaseInput(
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
		const mockReturnDraftAnswersForQuestions: CurrentAnswersForQuestion[] = [
			new CurrentAnswersForQuestion({
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
		mockDraftRepository.getDraft.mockResolvedValue(mockReturnDraft);
		mockDraftRepository.getCurrentAnswersForDraft.mockResolvedValue(
			mockReturnDraftAnswersForQuestions,
		);

		const result = await getCurrentAnswersForDraftUseCase.execute(
			getCurrentAnswersForDraftUseCaseInput,
		);
		expect(result).toEqual({
			message: 'get draft answers successfully',
			draftAnswers: mockReturnDraftAnswersForQuestions,
		});

		expect(mockDraftRepository.getDraft).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		expect(mockDraftRepository.getCurrentAnswersForDraft).toBeCalledWith(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
	});
});
