import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	AnswerReport,
	OverviewReport,
	UpdateOverviewReportDto,
	CreateUserResponseDto,
	CreateOverviewReportDto,
	GetAnswerReportsResponseDto,
	GetVotersOfAnswerReportsResponseDto,
	VoterReport,
	GetOverviewReportsForPollResponseDto,
	GetOverviewReportResponseDto,
} from '../domains';
import {
	GetOverviewReportsForPollUseCaseInput,
	UpdateOverviewReportUseCaseInput,
	CreateUserResponseUseCaseInput,
	GetAnswerReportsUseCaseInput,
	GetOverviewReportUseCaseInput,
	CreateOverviewReportUseCaseInput,
	GetVoterOfAnswerReportsUseCaseInput,
} from '../usecases';
import {
	createOverviewReportUseCase,
	createUserResponseUseCase,
	getAnswerReportsUseCase,
	getOverviewReportsForPollUseCase,
	getOverviewReportUseCase,
	getVoterOfAnswerReportsUseCase,
	updateOverviewReportUseCase,
} from '../di';

interface ReqParamTypeGetOverviewReports {
	pollId: string;
}
export const getOverviewReportsForPoll = async (
	request: Request<ReqParamTypeGetOverviewReports, any, any, any>,
	response: Response,
	next: NextFunction,
) => {
	try {
		const pollId = request.params.pollId;
		const input = new GetOverviewReportsForPollUseCaseInput(pollId);
		const result = await getOverviewReportsForPollUseCase.execute(input);
		next(sendGetOverviewReportsForPoll(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
export const sendGetOverviewReportsForPoll = (
	response: Response,
	result: GetOverviewReportsForPollResponseDto,
) => {
	return response.send({
		message: result.message,
		overviewReports: result.overviewReports.map((element: OverviewReport) => ({
			pollId: element.pollId,
			pollVersion: element.pollVersion,
			startDate: element.startDate,
			endDate: element.endDate,
			status: element.status,
			participants: element.participants,
			blockedDate: element.blockedDate,
		})),
	});
};

interface ReqParamTypeGetOverviewReport {
	pollId: string;
	pollVersion: string;
	timeInterval: string;
}
export const getOverviewReport = async (
	request: Request<ReqParamTypeGetOverviewReport, any, any, any>,
	response: Response,
	next: NextFunction,
) => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const startDate = request.params.timeInterval.split('_')[0];
		const endDate = request.params.timeInterval.split('_')[1];
		const input = new GetOverviewReportUseCaseInput(
			pollId,
			pollVersion,
			startDate,
			endDate,
		);
		const result = await getOverviewReportUseCase.execute(input);
		next(sendGetOverviewReportForOccurrence(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendGetOverviewReportForOccurrence = (
	response: Response,
	result: GetOverviewReportResponseDto,
) => {
	response.send({
		message: result.message,
		overviewReport: {
			pollId: result.overviewReport.pollId,
			pollVersion: result.overviewReport.pollVersion,
			startDate: result.overviewReport.startDate,
			endDate: result.overviewReport.endDate,
			status: result.overviewReport.status,
			participants: result.overviewReport.participants,
			blockedDate: result.overviewReport.blockedDate,
		},
	});
};

interface ReqParamTypeUpdateOverviewReport {
	pollId: string;
	pollVersion: string;
	timeInterval: string;
}
export const updateOverviewReport = async (
	request: Request<ReqParamTypeUpdateOverviewReport, any, any, any>,
	response: Response,
) => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const startDate = request.params.timeInterval.split('_')[0];
		const endDate = request.params.timeInterval.split('_')[1];
		const dto = request.body as UpdateOverviewReportDto;
		const input = new UpdateOverviewReportUseCaseInput(
			dto,
			pollId,
			pollVersion,
			startDate,
			endDate,
		);
		const result = await updateOverviewReportUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeCreateOverviewReport {
	pollId: string;
	pollVersion: string;
}
export const createOverviewReport = async (
	request: Request<ReqParamTypeCreateOverviewReport, any, any, any>,
	response: Response,
) => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const dto = request.body as CreateOverviewReportDto;
		const input = new CreateOverviewReportUseCaseInput(
			dto,
			pollId,
			pollVersion,
		);
		const result = await createOverviewReportUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeUpdateUserResponse {
	pollId: string;
	pollVersion: string;
}
export const createUserResponse = async (
	request: Request<ReqParamTypeUpdateUserResponse, any, any, any>,
	response: Response,
) => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const dto = request.body as CreateUserResponseDto;
		const input = new CreateUserResponseUseCaseInput(dto, pollId, pollVersion);
		const result = await createUserResponseUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeGetAnswerReports {
	pollId: string;
	version: string;
	timeInterval: string;
}

export const getAnswerReports = async (
	request: Request<ReqParamTypeGetAnswerReports>,
	response: Response<AnswerReports>,
	next: NextFunction,
) => {
	try {
		const startDate = request.params.timeInterval.split('_')[0];
		const endDate = request.params.timeInterval.split('_')[1];
		const { pollId, version } = request.params;

		const result = await getAnswerReportsUseCase.execute(
			new GetAnswerReportsUseCaseInput(pollId, version, startDate, endDate),
		);

		next(sendAnswersReportOfPollVersionForClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface AnswerReports {
	nextToken: string;
	answerReports: AnswerReport['props'][];
}
export const sendAnswersReportOfPollVersionForClient = (
	response: Response<AnswerReports>,
	result: GetAnswerReportsResponseDto,
) => {
	return response.send({
		nextToken: result.nextToken,
		answerReports: result.answerReports.map((answerReport) => ({
			answer: answerReport.answer,
			numberOfVoter: answerReport.numberOfVoter,
			pollId: answerReport.pollId,
			startDate: answerReport.startDate,
			endDate: answerReport.endDate,
			pollVersion: answerReport.pollVersion,
			question: answerReport.question,
			questionId: answerReport.questionId,
			questionType: answerReport.questionType,
		})),
	});
};

interface GetAnswerReportsRequestParamsType {
	pollId: string;
	version: string;
	timeInterval: string;
	questionId: string;
	answer: AnswerReport['answer'];
}
export const getVoterReportsForAnswer = async (
	request: Request<GetAnswerReportsRequestParamsType>,
	response: Response,
	next: NextFunction,
) => {
	try {
		const { questionId, answer, pollId, timeInterval, version } =
			request.params;
		const startDate = timeInterval.split('_')[0];
		const endDate = timeInterval.split('_')[1];
		const result = await getVoterOfAnswerReportsUseCase.execute(
			new GetVoterOfAnswerReportsUseCaseInput(
				pollId,
				version,
				startDate,
				endDate,
				questionId,
				answer,
			),
		);
		next(sendVoterOfAnswerReportsToClient(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface VoterOfAnswerReportsResponseForClient {
	message: string;
	voterReports: VoterReport['props'][];
}
const sendVoterOfAnswerReportsToClient = (
	response: Response<VoterOfAnswerReportsResponseForClient>,
	result: GetVotersOfAnswerReportsResponseDto,
) => {
	return response.send({
		message: result.message,
		voterReports: result.voterReports.map((element: VoterReport) => ({
			answer: element.answer,
			endDate: element.endDate,
			pollId: element.pollId,
			pollVersion: element.pollVersion,
			questionId: element.questionId,
			startDate: element.startDate,
			voterEmail: element.voterEmail,
			shortAnswer: element.shortAnswer,
		})),
	});
};
