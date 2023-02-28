import { NextFunction, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import { GetLatestVersionUseCaseInput } from '../usecases';
import { getLatestVersionUseCase } from '../di';
import { GetLatestVersionResponseDto, Version } from '../domains';

export const getLatestVersion = async (
	request: any,
	response: Response,
	next: NextFunction,
): Promise<Response<GetLatestVersionResponseDto>> => {
	try {
		const { pollId } = request;

		const getAllQuestionsByLatestVersionUseCaseInput =
			new GetLatestVersionUseCaseInput(pollId);

		const result = await getLatestVersionUseCase.execute(
			getAllQuestionsByLatestVersionUseCaseInput,
		);

		next(sendLatestVersionToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendLatestVersionToClient = async (
	response: Response,
	result: Version,
) => {
	const versionForClient = {
		pollId: result.pollId,
		version: result.version,
		questions: result.questions.map((question) => ({
			questionId: question.questionId,
			pollId: question.pollId,
			content: question.content,
			answers: question.answers,
			isRequired: question.isRequired,
			questionType: question.questionType,
		})),
		createdAt: result.createdAt,
		recurrenceType: result.recurrenceType,
		activeDate: result.activeDate,
	};
	return response.send({
		message: 'Successfully get version',
		version: versionForClient,
	});
};
