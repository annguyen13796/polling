import { NextFunction, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import { GetQuestionByLatestVersionUseCaseInput } from '../usecases';
import { getAllQuestionsByLatestVersionUseCase } from '../di';
import { GetQuestionsByLatestVersionResponse } from '../domains';

export const getQuestionsByLatestVersion = async (
	request: any,
	response: Response,
	next: NextFunction,
): Promise<Response<GetQuestionsByLatestVersionResponse>> => {
	try {
		const { pollId } = request;

		const getAllQuestionsByLatestVersionUseCaseInput =
			new GetQuestionByLatestVersionUseCaseInput(pollId);

		const result = await getAllQuestionsByLatestVersionUseCase.execute(
			getAllQuestionsByLatestVersionUseCaseInput,
		);

		next(sendLatestQuestionsToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendLatestQuestionsToClient = async (
	response: Response,
	result: GetQuestionsByLatestVersionResponse,
) => {
	const questionsMapped = result.questions.map((question) => ({
		pollId: question.pollId,
		questionId: question.questionId,
		content: question.content,
		questionType: question.questionType,
		isRequired: question.isRequired,
		answers: question.answers,
	}));
	return response.send({ questions: questionsMapped, version: result.version });
};
