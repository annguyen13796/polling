import { BadRequestException } from '@libs/common';
import { IOverviewReportRepository, OverviewReport } from '../../domains';

import {
	GetOverviewReportsForPollUseCase,
	GetOverviewReportsForPollUseCaseInput,
} from '../get-overview-reports-for-poll.usecase';

describe('GetOverviewReportUseCase', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockOverviewReportRepository: jest.Mocked<IOverviewReportRepository> = {
		create: jest.fn(),
		createOverviewReportAndAnswerReports: jest.fn(),
		createVoterReports: jest.fn(),
		getAnswerReport: jest.fn(),
		getAnswerReportsForOccurrence: jest.fn(),
		getOverviewReportForOccurrence: jest.fn(),
		getOverviewReportsForPoll: jest.fn(),
		getVoterReportsOfAnswer: jest.fn(),
		updateAnswerReports: jest.fn(),
		updateOverviewReport: jest.fn(),
		updateUserResponse: jest.fn(),
		update: jest.fn(),
	};

	it(`should throw poll id missing when pollId is undefined`, async () => {
		const getOverviewReportsForPollUseCase =
			new GetOverviewReportsForPollUseCase(mockOverviewReportRepository);

		const pollId: string = undefined;

		const getOverviewReportsForPollUseCaseInput =
			new GetOverviewReportsForPollUseCaseInput(pollId);

		const expectedError = new BadRequestException('Poll Id is required');

		await expect(
			getOverviewReportsForPollUseCase.execute(
				getOverviewReportsForPollUseCaseInput,
			),
		).rejects.toThrowError(expectedError);

		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).not.toBeCalled();
	});

	it(`should execute successfully`, async () => {
		const getOverviewReportsForPollUseCase =
			new GetOverviewReportsForPollUseCase(mockOverviewReportRepository);

		const pollId: string = 'pollId';

		const getOverviewReportsForPollUseCaseInput =
			new GetOverviewReportsForPollUseCaseInput(pollId);

		const mockReturnedOverviewReports: OverviewReport[] = [];
		mockOverviewReportRepository.getOverviewReportsForPoll.mockResolvedValue(
			mockReturnedOverviewReports,
		);

		const result = await getOverviewReportsForPollUseCase.execute(
			getOverviewReportsForPollUseCaseInput,
		);
		expect(result).toEqual({
			message: 'get overview reports successfully',
			overviewReports: mockReturnedOverviewReports,
		});

		expect(
			mockOverviewReportRepository.getOverviewReportsForPoll,
		).toBeCalledWith(pollId);
	});
});
