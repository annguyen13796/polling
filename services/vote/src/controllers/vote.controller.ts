import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	GetCurrentAnswersForDraftResponseDto,
	PutCurrentAnswersForQuestionDto,
	PutDraftDto,
} from '../domains';
import {
	GetCurrentAnswersForDraftUseCaseInput,
	PutCurrentAnswersForQuestionUseCaseInput,
	PutDraftUseCaseInput,
} from '../usecases';
import {
	getCurrentAnswersForDraftUseCase,
	putCurrentAnswersForQuestionUseCase,
	putDraftUseCase,
} from '../di';

type PollId_pollVersion_startDate_endDate_voterEmail = string;
type DraftIdType = PollId_pollVersion_startDate_endDate_voterEmail;

interface GetCurrentAnswersForDraftRequestParamType {
	draftId: DraftIdType;
}
export const getCurrentAnswersForDraft = async (
	request: Request<GetCurrentAnswersForDraftRequestParamType, any, any, any>,
	response: Response,
	next: NextFunction,
) => {
	try {
		const chainedUrl = request.params.draftId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const startDate = chainedUrl.split('_')[2];
		const endDate = chainedUrl.split('_')[3];
		const voterEmail = chainedUrl.split('_')[4];

		const input = new GetCurrentAnswersForDraftUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const result = await getCurrentAnswersForDraftUseCase.execute(input);
		next(sendGetCurrentAnswersForDraft(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface PutCurrentAnswersForQuestionRequestParamType {
	draftId: DraftIdType;
	questionId: string;
}
export const putCurrentAnswersForQuestion = async (
	request: Request<PutCurrentAnswersForQuestionRequestParamType, any, any, any>,
	response: Response,
) => {
	try {
		const chainedUrl = request.params.draftId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const startDate = chainedUrl.split('_')[2];
		const endDate = chainedUrl.split('_')[3];
		const voterEmail = chainedUrl.split('_')[4];

		const questionId = request.params.questionId;
		const dto = request.body as PutCurrentAnswersForQuestionDto;
		const input = new PutCurrentAnswersForQuestionUseCaseInput(
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
			questionId,
		);
		const result = await putCurrentAnswersForQuestionUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface PutDraftRequestParamType {
	draftId: DraftIdType;
}
export const putDraft = async (
	request: Request<PutDraftRequestParamType, any, any, any>,
	response: Response,
) => {
	try {
		const chainedUrl = request.params.draftId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const startDate = chainedUrl.split('_')[2];
		const endDate = chainedUrl.split('_')[3];
		const voterEmail = chainedUrl.split('_')[4];
		const dto = request.body as PutDraftDto;
		const input = new PutDraftUseCaseInput(
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		const result = await putDraftUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendGetCurrentAnswersForDraft = (
	response: Response,
	result: GetCurrentAnswersForDraftResponseDto,
) => {
	try {
		const parsedDraftAnswersForQuestions = result.draftAnswers.map(
			(element) => {
				return {
					pollId: element.pollId,
					pollVersion: element.pollVersion,
					starDate: element.startDate,
					endDate: element.endDate,
					voterEmail: element.voterEmail,
					questionId: element.questionId,
					question: element.question,
					answers: element.answers,
				};
			},
		);
		response.send({
			message: 'get draft answers successfully',
			draftAnswers: parsedDraftAnswersForQuestions,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
