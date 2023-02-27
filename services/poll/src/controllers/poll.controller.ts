import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	CreatePollDto,
	CreatePollResponseDto,
	GetPollsByCreatorEmailDto,
	Poll,
	Question,
	CreateQuestionResponseDto,
	CreateQuestionDto,
	DeletePollByIdResponseDto,
	GetPollsByCreatorEmailResponseDto,
	EditQuestionDto,
	EditQuestionResponseDto,
	DeleteQuestionResponseDto,
	CreateVoteLinkResponseDto,
	CreateVoteLinkDto,
} from '../domains';
import {
	CreatePollUseCaseInput,
	CreateQuestionUseCaseInput,
	DeletePollByIdUseCaseInput,
	GetPollsByCreatorEmailUseCaseInput,
	GetPollByIdUseCaseInput,
	GetQuestionsByPollIdUseCaseInput,
	EditQuestionUseCaseInput,
	DeleteQuestionByIdUseCaseInput,
	CreateVoteURLUseCaseInput,
} from '../usecases';
import {
	createPollUseCase,
	createQuestionUseCase,
	createVoteLinkUseCase,
	deletePollByIdUseCase,
	deleteQuestionByIdUseCase,
	editQuestionUseCase,
	getAllPollsUseCase,
	getPollByIdUseCase,
	getQuestionsUseCase,
} from '../di';

export const createPoll = async (
	request: Request,
	response: Response,
): Promise<Response<CreatePollResponseDto>> => {
	try {
		const dto = request.body as CreatePollDto;

		const input = new CreatePollUseCaseInput(dto);

		const result = await createPollUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const getAllPolls = async (
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<Response<GetPollsByCreatorEmailResponseDto>> => {
	try {
		const inputEmail = request.query.creatorEmail as string;
		const inputLastPollId = request.query.lastPollId as string;
		const inputLimit = Number(request.query.limit);

		const dto: GetPollsByCreatorEmailDto = {
			creatorEmail: inputEmail,
			limit: inputLimit,
			lastPollId: inputLastPollId,
		};

		const getAllPollsUseCaseInput = new GetPollsByCreatorEmailUseCaseInput(dto);
		const result = await getAllPollsUseCase.execute(getAllPollsUseCaseInput);

		next(sendPollsGeneralInfoToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const getPollQuestions = async (
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<Response<Question[]>> => {
	try {
		const inputPollId = request.params.pollId;

		const getQuestionsUseCaseInput = new GetQuestionsByPollIdUseCaseInput(
			inputPollId,
		);
		const result = await getQuestionsUseCase.execute(getQuestionsUseCaseInput);

		next(sendQuestionsToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const createQuestion = async (
	request: Request,
	response: Response,
): Promise<Response<CreateQuestionResponseDto>> => {
	try {
		const dto = request.body as CreateQuestionDto;
		const inputPollId = request.params.pollId;

		const createQuestionUseCaseInput = new CreateQuestionUseCaseInput(
			dto,
			inputPollId,
		);
		const result = await createQuestionUseCase.execute(
			createQuestionUseCaseInput,
		);
		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const editQuestion = async (
	request: Request,
	response: Response,
): Promise<Response<EditQuestionResponseDto>> => {
	try {
		const dto = request.body as EditQuestionDto;
		const inputPollId = request.params.pollId;
		const inputQuestionId = request.params.questionId;
		const editQuestionUseCaseInput = new EditQuestionUseCaseInput(
			dto,
			inputPollId,
			inputQuestionId,
		);
		const result = await editQuestionUseCase.execute(editQuestionUseCaseInput);
		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const deletePollById = async (
	request: Request,
	response: Response,
): Promise<Response<DeletePollByIdResponseDto>> => {
	try {
		const pollIdParam = request.params?.pollId;

		const input = new DeletePollByIdUseCaseInput(pollIdParam);
		const result = await deletePollByIdUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const deleteQuestionById = async (
	request: Request,
	response: Response,
): Promise<Response<DeleteQuestionResponseDto>> => {
	try {
		const pollIdParam = request.params?.pollId;
		const questionIdParam = request.params?.questionId;

		const input = new DeleteQuestionByIdUseCaseInput(
			pollIdParam,
			questionIdParam,
		);
		const result = await deleteQuestionByIdUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const getPollById = async (
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<Response<Poll>> => {
	try {
		const pollIdParam = request.params?.pollId;

		const input = new GetPollByIdUseCaseInput(pollIdParam);
		const result = await getPollByIdUseCase.execute(input);

		next(sendPollGeneralInfoToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendQuestionsToClient = (
	response: Response,
	questions: Question[],
) => {
	const resultForClient = questions.map((question) => {
		const questionsForClient = {
			pollId: question.pollId,
			questionId: question.questionId,
			questionType: question.questionType,
			content: question.content,
			isRequired: question.isRequired,
			answers: question.answers,
		};
		return questionsForClient;
	});

	return response.send(resultForClient);
};

export const sendPollsGeneralInfoToClient = (
	response: Response,
	result: GetPollsByCreatorEmailResponseDto,
) => {
	const pollsForClient = result.polls.map((poll) => ({
		creatorEmail: poll.creatorEmail,
		title: poll.title,
		description: poll.description,
		createdAt: poll.createdAt,
		version: poll.version,
		id: poll.id,
		status: poll.status,
		voteLink: poll.voteLink,
	}));

	return response.send({
		lastPollId: result.lastPollId,
		polls: pollsForClient,
	});
};

export const sendPollGeneralInfoToClient = (response: Response, poll: Poll) => {
	const pollForClient = {
		creatorEmail: poll.creatorEmail,
		title: poll.title,
		description: poll.description,
		createdAt: poll.createdAt,
		version: poll.version,
		id: poll.id,
		status: poll.status,
		voteLink: poll.voteLink,
	};

	return response.send(pollForClient);
};

export const createVoteLink = async (
	request: Request,
	response: Response,
): Promise<Response<CreateVoteLinkResponseDto>> => {
	try {
		const pollIdParam = request.params?.pollId;
		const createVoteLinkDto = request.body as CreateVoteLinkDto;
		const createVoteLinkUseCaseInput = new CreateVoteURLUseCaseInput(
			pollIdParam,
			createVoteLinkDto,
		);

		const result = await createVoteLinkUseCase.execute(
			createVoteLinkUseCaseInput,
		);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
