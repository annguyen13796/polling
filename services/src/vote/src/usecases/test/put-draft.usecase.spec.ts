import { BadRequestException } from '@libs/common';
import { IDraftRepository, PutDraftDto } from '../../domains';
import {
	PutDraftUseCase,
	PutDraftUseCaseInput,
} from '../put-draft-information.usecase';

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
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			putDraftUseCase.execute(putDraftUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraft).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Version is missing');

		await expect(
			putDraftUseCase.execute(putDraftUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraft).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Start Date is missing');

		await expect(
			putDraftUseCase.execute(putDraftUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraft).not.toBeCalled();
	});

	it(`should throw end date missing when startDate is undefined`, async () => {
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const voterEmail: string = 'voterEmail';

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('End Date is missing');

		await expect(
			putDraftUseCase.execute(putDraftUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraft).not.toBeCalled();
	});

	it(`should throw voter email missing when voterEmail is undefined`, async () => {
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = undefined;

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Voter Email is missing');

		await expect(
			putDraftUseCase.execute(putDraftUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraft).not.toBeCalled();
	});

	it(`should execute successfully `, async () => {
		const putDraftUseCase = new PutDraftUseCase(mockDraftRepository);

		const mockPutDraftDto: PutDraftDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftUseCaseInput = new PutDraftUseCaseInput(
			mockPutDraftDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const result = await putDraftUseCase.execute(putDraftUseCaseInput);
		expect(result).toEqual({ message: 'put draft information successfully' });

		expect(mockDraftRepository.putDraft).toBeCalled();
	});
});
