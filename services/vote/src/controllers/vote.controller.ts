import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	DraftAnswersForQuestion,
	GetDraftAnswersForUserResponseDto,
	PutDraftAnswersForQuestionDto,
	PutDraftAnswersForQuestionResponseDto,
	PutGeneralVotingStatusOfUserDto,
	PutGeneralVotingStatusOfUserResponseDto,
} from '../domains';
import {
	GetDraftAnswersForUserUseCaseInput,
	PutDraftAnswersForQuestionUseCaseInput,
	PutGeneralVotingStatusOfUserUseCaseInput,
} from '../usecases';
import {
	getDraftAnswersForUserUseCase,
	putDraftAnswersForQuestionUseCase,
	putGeneralVotingStatusOfUserUseCase,
} from '../di';

type PollId_pollVersion_pollRecurrence_voterEmail = string;
type UserResponseIdType = PollId_pollVersion_pollRecurrence_voterEmail;
interface ReqParamTypeGetDraftAnswersForQuestion {
	userResponseId: UserResponseIdType;
}

export const getDraftAnswersForUser = async (
	request: Request<ReqParamTypeGetDraftAnswersForQuestion, any, any, any>,
	response: Response,
	next: NextFunction,
): Promise<Response<GetDraftAnswersForUserResponseDto>> => {
	try {
		const chainedUrl = request.params.userResponseId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const pollRecurrence = chainedUrl.split('_')[2];
		const voterEmail = chainedUrl.split('_')[3];

		const input = new GetDraftAnswersForUserUseCaseInput(
			pollId,
			pollVersion,
			pollRecurrence,
			voterEmail,
		);

		const result = await getDraftAnswersForUserUseCase.execute(input);

		next(sendGetDraftAnswersForUser(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypePutDraftAnswersForQuestion {
	userResponseId: UserResponseIdType;
	questionId: string;
}
export const putDraftAnswersForQuestion = async (
	request: Request<ReqParamTypePutDraftAnswersForQuestion, any, any, any>,
	response: Response,
): Promise<Response<PutDraftAnswersForQuestionResponseDto>> => {
	try {
		const chainedUrl = request.params.userResponseId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const pollRecurrence = chainedUrl.split('_')[2];
		const voterEmail = chainedUrl.split('_')[3];
		const questionId = request.params.questionId;
		const dto = request.body as PutDraftAnswersForQuestionDto;
		const input = new PutDraftAnswersForQuestionUseCaseInput(
			dto,
			pollId,
			pollVersion,
			pollRecurrence,
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
	userResponseId: UserResponseIdType;
}
export const putGeneralVotingStatusOfUser = async (
	request: Request<ReqParamTypePutGeneralVotingStatusOfUser, any, any, any>,
	response: Response,
): Promise<Response<PutGeneralVotingStatusOfUserResponseDto>> => {
	try {
		const chainedUrl = request.params.userResponseId;
		const pollId = chainedUrl.split('_')[0];
		const pollVersion = chainedUrl.split('_')[1];
		const pollRecurrence = chainedUrl.split('_')[2];
		const voterEmail = chainedUrl.split('_')[3];
		const dto = request.body as PutGeneralVotingStatusOfUserDto;
		const input = new PutGeneralVotingStatusOfUserUseCaseInput(
			dto,
			pollId,
			pollVersion,
			pollRecurrence,
			voterEmail,
		);
		const result = await putGeneralVotingStatusOfUserUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendGetDraftAnswersForUser = (
	response: Response<GetDraftAnswersForUserResponseDto>,
	result: DraftAnswersForQuestion[],
) => {
	try {
		const parsedDraftAnswers = result.map((element) => {
			return {
				// eslint-disable-next-line no-unused-labels
				pollId: element.pollId,
				// eslint-disable-next-line no-unused-labels
				pollVersion: element.pollVersion,
				// eslint-disable-next-line no-unused-labels
				pollRecurrence: element.pollRecurrence,
				// eslint-disable-next-line no-unused-labels
				voterEmail: element.voterEmail,
				// eslint-disable-next-line no-unused-labels
				questionId: element.questionId,
				// eslint-disable-next-line no-unused-labels
				question: element.question,
				// eslint-disable-next-line no-unused-labels
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
