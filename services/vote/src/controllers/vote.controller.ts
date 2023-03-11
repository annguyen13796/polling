import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	GetDraftAnswersResponseDto,
	PutDraftAnswersForQuestionDto,
	PutDraftInformationDto,
} from '../domains';
import {
	GetDraftAnswersUseCaseInput,
	PutDraftAnswersForQuestionUseCaseInput,
	PutDraftInformationUseCaseInput,
} from '../usecases';
import {
	getDraftAnswersUseCase,
	putDraftAnswersForQuestionUseCase,
	putDraftInformationUseCase,
} from '../di';

type PollId_pollVersion_startDate_endDate_voterEmail = string;
type DraftIdType = PollId_pollVersion_startDate_endDate_voterEmail;
interface ReqParamTypeGetDraftAnswersForQuestion {
	draftId: DraftIdType;
}

export const getDraftAnswers = async (
	request: Request<ReqParamTypeGetDraftAnswersForQuestion, any, any, any>,
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

		const input = new GetDraftAnswersUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);

		const result = await getDraftAnswersUseCase.execute(input);
		next(sendGetDraftAnswersForUser(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypePutDraftAnswersForQuestion {
	draftId: DraftIdType;
	questionId: string;
}
export const putDraftAnswersForQuestion = async (
	request: Request<ReqParamTypePutDraftAnswersForQuestion, any, any, any>,
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
		const dto = request.body as PutDraftAnswersForQuestionDto;
		const input = new PutDraftAnswersForQuestionUseCaseInput(
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
			questionId,
		);
		const result = await putDraftAnswersForQuestionUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypePutGeneralVotingStatusOfUser {
	draftId: DraftIdType;
}
export const putDraftInformation = async (
	request: Request<ReqParamTypePutGeneralVotingStatusOfUser, any, any, any>,
	response: Response,
) => {
	try {
		const chainedUrl = request.params.draftId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const startDate = chainedUrl.split('_')[2];
		const endDate = chainedUrl.split('_')[3];
		const voterEmail = chainedUrl.split('_')[4];
		const dto = request.body as PutDraftInformationDto;
		const input = new PutDraftInformationUseCaseInput(
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
			voterEmail,
		);
		const result = await putDraftInformationUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendGetDraftAnswersForUser = (
	response: Response,
	result: GetDraftAnswersResponseDto,
) => {
	try {
		const parsedDraftAnswers = result.draftAnswers.map((element) => {
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
		});
		response.send({
			message: 'get draft answers successfully',
			draftAnswers: parsedDraftAnswers,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
