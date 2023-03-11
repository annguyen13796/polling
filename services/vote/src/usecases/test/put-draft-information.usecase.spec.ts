import { BadRequestException, NotFoundException } from '@libs/common';
import {
	Draft,
	DraftAnswersForQuestion,
	IDraftRepository,
	PutDraftAnswersForQuestionDto,
	PutDraftInformationDto,
} from '../../domains';
import {
	PutDraftAnswersForQuestionUseCase,
	PutDraftAnswersForQuestionUseCaseInput,
} from '../put-draft-answers-for-question.usecase';
import {
	PutDraftInformationUseCase,
	PutDraftInformationUseCaseInput,
} from '../put-draft-information.usecase';

describe('PutDraftAnswersForQuestionUseCase', () => {
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
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = undefined;
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Poll Id is missing');

		await expect(
			putDraftInformationUseCase.execute(putDraftInformationUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraftInformation).not.toBeCalled();
	});

	it(`should throw poll version missing when pollVersion is undefined`, async () => {
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = undefined;
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Version is missing');

		await expect(
			putDraftInformationUseCase.execute(putDraftInformationUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraftInformation).not.toBeCalled();
	});

	it(`should throw start date missing when startDate is undefined`, async () => {
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = undefined;
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Start Date is missing');

		await expect(
			putDraftInformationUseCase.execute(putDraftInformationUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraftInformation).not.toBeCalled();
	});

	it(`should throw end date missing when startDate is undefined`, async () => {
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = undefined;
		const voterEmail: string = 'voterEmail';

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('End Date is missing');

		await expect(
			putDraftInformationUseCase.execute(putDraftInformationUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraftInformation).not.toBeCalled();
	});

	it(`should throw voter email missing when voterEmail is undefined`, async () => {
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = undefined;

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const expectedError = new BadRequestException('Voter Email is missing');

		await expect(
			putDraftInformationUseCase.execute(putDraftInformationUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(mockDraftRepository.putDraftInformation).not.toBeCalled();
	});

	it(`should execute successfully `, async () => {
		const putDraftInformationUseCase = new PutDraftInformationUseCase(
			mockDraftRepository,
		);

		const mockPutDraftInformationDto: PutDraftInformationDto = {
			hasBeenSubmitted: false,
		};
		const pollId: string = 'pollId';
		const pollVersion: string = 'pollVersion';
		const startDate: string = 'startDate';
		const endDate: string = 'endDate';
		const voterEmail: string = 'voterEmail';

		const putDraftInformationUseCaseInput = new PutDraftInformationUseCaseInput(
			mockPutDraftInformationDto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const result = await putDraftInformationUseCase.execute(
			putDraftInformationUseCaseInput,
		);
		expect(result).toEqual({ message: 'put draft information successfully' });

		expect(mockDraftRepository.putDraftInformation).toBeCalled();
	});
});
