import { NextFunction, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import { GetLatestReleaseUseCaseInput } from '../usecases';
import { getLatestReleaseUseCase } from '../di';
import { Question, GetLatestReleaseResponseDto } from '../domains';

interface GetLatestReleaseForClientResponse {
	message: string;
	latestRelease: {
		pollId: string;
		version: string;
		createdAt: string;
		startDate: string;
		endDate: string;
		questions: Question['props'][];
	};
}

export const getLatestRelease = async (
	request: any,
	response: Response,
	next: NextFunction,
): Promise<Response<GetLatestReleaseForClientResponse>> => {
	try {
		const { pollId } = request;

		const getAllQuestionsByLatestReleaseUseCaseInput =
			new GetLatestReleaseUseCaseInput(pollId);

		const result = await getLatestReleaseUseCase.execute(
			getAllQuestionsByLatestReleaseUseCaseInput,
		);

		next(sendLatestReleaseToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendLatestReleaseToClient = (
	response: Response,
	result: GetLatestReleaseResponseDto,
) => {
	const latestReleasedPollForClient = {
		pollId: result.latestRelease.pollId,
		version: result.latestRelease.version,
		questions: result.latestRelease.questions.map((question) => ({
			questionId: question.questionId,
			pollId: question.pollId,
			content: question.content,
			answers: question.answers,
			isRequired: question.isRequired,
			questionType: question.questionType,
		})),
		createdAt: result.latestRelease.createdAt,
		startDate: result.latestRelease.startDate,
		endDate: result.latestRelease.endDate,
	};
	return response.send({
		message: result.message,
		latestRelease: latestReleasedPollForClient,
	});
};
