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
	GetQuestionsDto,
	DeletePollByIdResponseDto,
	GetPollsByCreatorEmailResponseDto,
} from '../domains';
import {
	CreatePollUseCaseInput,
	CreateQuestionUseCaseInput,
	DeletePollByIdUseCaseInput,
	GetPollsByCreatorEmailUseCaseInput,
	GetPollByIdUseCaseInput,
	GetQuestionsByPollIdUseCaseInput,
} from '../usecases';
import {
	createPollUseCase,
	createQuestionUseCase,
	deletePollByIdUseCase,
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

		const dto: GetQuestionsDto = {
			pollId: inputPollId + '',
		};

		const getQuestionsUseCaseInput = new GetQuestionsByPollIdUseCaseInput(dto);
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

		const input = new CreateQuestionUseCaseInput(dto);
		const result = await createQuestionUseCase.execute(input);

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

		const pollId = pollIdParam;

		const input = new DeletePollByIdUseCaseInput({ pollId });
		const result = await deletePollByIdUseCase.execute(input);

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

		const pollId = pollIdParam;

		const input = new GetPollByIdUseCaseInput({ pollId });
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
