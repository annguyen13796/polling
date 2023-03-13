import { BadRequestException, NotFoundException } from '@libs/common';
import { EditPollInformationDto, IPollRepository, Poll } from '../../domains';
import {
	EditPollInformationUseCase,
	EditPollInformationUseCaseInput,
} from '../edit-poll-information.usecase';

describe('edit poll information', () => {
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

	it('Should throw error when pollId is missing', async () => {
		const editPollDtoMock: EditPollInformationDto = {
			title: 'Question',
			description: 'This is description',
		};
		const pollId = undefined;

		const editPollUseCaseInput = new EditPollInformationUseCaseInput(
			editPollDtoMock,
			pollId,
		);

		const mockEditPollUseCase = new EditPollInformationUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Missing pollId');

		await expect(
			mockEditPollUseCase.execute(editPollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.updatePoll).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});

	it('Should throw error when all information are missing', async () => {
		const editPollDtoMock: EditPollInformationDto = {
			title: '',
			description: '',
		};
		const pollId = '888';

		const editPollUseCaseInput = new EditPollInformationUseCaseInput(
			editPollDtoMock,
			pollId,
		);

		const mockEditPollUseCase = new EditPollInformationUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Nothing to update');

		await expect(
			mockEditPollUseCase.execute(editPollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.updatePoll).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});

	it('Should throw error when poll is not existed', async () => {
		const editPollDtoMock: EditPollInformationDto = {
			title: 'aaaa',
			description: 'ddddd',
		};
		const pollId = '888';

		const editPollUseCaseInput = new EditPollInformationUseCaseInput(
			editPollDtoMock,
			pollId,
		);

		const mockEditPollUseCase = new EditPollInformationUseCase(
			mockPollRepository,
		);

		mockPollRepository.findPollById.mockResolvedValueOnce(null);
		const expectedError = new BadRequestException(
			'Poll with id 888 is not existed',
		);

		await expect(
			mockEditPollUseCase.execute(editPollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.updatePoll).not.toBeCalled();
		expect(mockPollRepository.findPollById).toBeCalledWith(pollId);
	});

	it('Should throw error when poll title is blanked', async () => {
		const editPollDtoMock: EditPollInformationDto = {
			title: null,
			description: 'adddd',
		};
		const pollId = '888';

		const editPollUseCaseInput = new EditPollInformationUseCaseInput(
			editPollDtoMock,
			pollId,
		);

		const mockEditPollUseCase = new EditPollInformationUseCase(
			mockPollRepository,
		);

		const expectedError = new BadRequestException('Title cannot be blanked');

		await expect(
			mockEditPollUseCase.execute(editPollUseCaseInput),
		).rejects.toThrow(expectedError);

		expect(mockPollRepository.updatePoll).not.toBeCalled();
		expect(mockPollRepository.findPollById).not.toBeCalled();
	});

	it('Should edit question successfully with pollId, questionId, questionDto; poll and question are existed in DB', async () => {
		const mockEditPollDto: EditPollInformationDto = {
			title: 'abcdef',
			description: 'jalkdfd',
		};
		const pollId = '888';

		const editPollUseCaseInput = new EditPollInformationUseCaseInput(
			mockEditPollDto,
			pollId,
		);

		const mockEditPollUseCase = new EditPollInformationUseCase(
			mockPollRepository,
		);

		const existedPoll = new Poll({
			id: '888',
			creatorEmail: 'mock@gmail.com',
			description: 'fix bug 1',
			title: 'test 1',
			createdAt: '15/02/2023 09:38:07',
			status: 'IDLE',
		});

		mockPollRepository.findPollById.mockResolvedValueOnce(existedPoll);

		const result = await mockEditPollUseCase.execute(editPollUseCaseInput);

		expect(result).toEqual({ message: 'Update Poll Information successfully' });
		expect(mockPollRepository.updatePoll).toHaveBeenCalledWith(
			pollId,
			mockEditPollDto.title,
			mockEditPollDto.description,
		);
	});
});
