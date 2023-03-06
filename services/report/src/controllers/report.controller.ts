import { NextFunction, Request, Response } from 'express';
import { ApiErrorMapper } from '@libs/common';
import {
	CreateOverviewReportForRecurrenceDto,
	CreateOverviewReportForRecurrenceResponseDto,
	CreateUserResponseForRecurrenceDto,
	CreateUserResponseForRecurrenceResponseDto,
	GetOverviewReportForRecurrenceResponseDto,
	GetOverviewReportsForPollResponseDto,
	OverviewReport,
	UpdateStatusForRecurrenceDto,
	UpdateStatusForRecurrenceResponseDto,
} from '../domains';
import {
	CreateOverviewReportForRecurrenceUseCaseInput,
	CreateUserResponseForRecurrenceUseCaseInput,
	GetOverviewReportForRecurrenceUseCaseInput,
	GetOverviewReportsForPollUseCaseInput,
	UpdateStatusForRecurrenceUseCaseInput,
} from '../usecases';
import {
	createOverviewReportForRecurrenceUseCase,
	createUserResponseForRecurrenceUseCase,
	getOverviewReportForRecurrenceUseCase,
	getOverviewReportsForPollUseCase,
	updateStatusForRecurrenceUseCase,
} from '../di';

interface ReqParamTypeGetOverviewReports {
	pollId: string;
}
export const getOverviewReportsForPoll = async (
	request: Request<ReqParamTypeGetOverviewReports, any, any, any>,
	response: Response,
	next: NextFunction,
): Promise<Response<GetOverviewReportsForPollResponseDto>> => {
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
	result: OverviewReport[],
) => {
	try {
		const parsedOverviewReports = result.map((element) => {
			return {
				// eslint-disable-next-line no-unused-labels
				pollId: element.pollId,
				// eslint-disable-next-line no-unused-labels
				pollVersion: element.pollVersion,
				// eslint-disable-next-line no-unused-labels
				pollRecurrence: element.pollRecurrence,
				// eslint-disable-next-line no-unused-labels
				pollName: element.pollName,
				// eslint-disable-next-line no-unused-labels
				pollDescription: element.pollDescription,
				// eslint-disable-next-line no-unused-labels
				status: element.status,
				// eslint-disable-next-line no-unused-labels
				participants: element.participants,
			};
		});
		response.send({
			message: 'get draft answers successfully',
			overviewReports: parsedOverviewReports,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeGetOverviewReport {
	pollId: string;
	pollVersion: string;
	pollRecurrence: string;
}
export const getOverviewReportForRecurrence = async (
	request: Request<ReqParamTypeGetOverviewReport, any, any, any>,
	response: Response,
	next: NextFunction,
): Promise<Response<GetOverviewReportForRecurrenceResponseDto>> => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const pollRecurrence = request.params.pollRecurrence;
		const input = new GetOverviewReportForRecurrenceUseCaseInput(
			pollId,
			pollVersion,
			pollRecurrence,
		);
		const result = await getOverviewReportForRecurrenceUseCase.execute(input);
		next(sendGetOverviewReportForRecurrence(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const sendGetOverviewReportForRecurrence = (
	response: Response,
	result: OverviewReport,
) => {
	try {
		const parsedOverviewReport = {
			// eslint-disable-next-line no-unused-labels
			pollId: result.pollId,
			// eslint-disable-next-line no-unused-labels
			pollVersion: result.pollVersion,
			// eslint-disable-next-line no-unused-labels
			pollRecurrence: result.pollRecurrence,
			// eslint-disable-next-line no-unused-labels
			pollName: result.pollName,
			// eslint-disable-next-line no-unused-labels
			pollDescription: result.pollDescription,
			// eslint-disable-next-line no-unused-labels
			status: result.status,
			// eslint-disable-next-line no-unused-labels
			participants: result.participants,
		};
		response.send({
			message: 'get draft answers successfully',
			overviewReport: parsedOverviewReport,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeUpdateStatusForRecurrence {
	pollId: string;
	pollVersion: string;
	pollRecurrence: string;
}
export const updateStatusForRecurrence = async (
	request: Request<ReqParamTypeUpdateStatusForRecurrence, any, any, any>,
	response: Response,
): Promise<Response<UpdateStatusForRecurrenceResponseDto>> => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const pollRecurrence = request.params.pollRecurrence;
		const dto = request.body as UpdateStatusForRecurrenceDto;
		const input = new UpdateStatusForRecurrenceUseCaseInput(
			dto,
			pollId,
			pollVersion,
			pollRecurrence,
		);
		const result = await updateStatusForRecurrenceUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

interface ReqParamTypeCreateOverviewReportForRecurrence {
	pollId: string;
	pollVersion: string;
}
export const createOverviewReportForRecurrence = async (
	request: Request<
		ReqParamTypeCreateOverviewReportForRecurrence,
		any,
		any,
		any
	>,
	response: Response,
): Promise<Response<CreateOverviewReportForRecurrenceResponseDto>> => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const dto = request.body as CreateOverviewReportForRecurrenceDto;
		const input = new CreateOverviewReportForRecurrenceUseCaseInput(
			dto,
			pollId,
			pollVersion,
		);
		const result = await createOverviewReportForRecurrenceUseCase.execute(
			input,
		);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

// export const getAnswerReportsForRecurrence = async (
// 	request: Request<any, any, any, ReqQueryTypeGetDraftAnswersForUser>,
// 	response: Response,
// 	next: NextFunction,
// ): Promise<Response<GetReportForPollResponseDto>> => {};

// export const getVoterReportsForAnswer = async (
// 	request: Request<any, any, any, ReqQueryTypeGetDraftAnswersForUser>,
// 	response: Response,
// 	next: NextFunction,
// ): Promise<Response<GetReportForPollResponseDto>> => {};

interface ReqParamTypeUpdateUserResponseForRecurrence {
	pollId: string;
	pollVersion: string;
	pollRecurrence: string;
}
export const createUserResponseForRecurrence = async (
	request: Request<ReqParamTypeUpdateUserResponseForRecurrence, any, any, any>,
	response: Response,
): Promise<Response<CreateUserResponseForRecurrenceResponseDto>> => {
	try {
		const pollId = request.params.pollId;
		const pollVersion = request.params.pollVersion;
		const dto = request.body as CreateUserResponseForRecurrenceDto;
		const input = new CreateUserResponseForRecurrenceUseCaseInput(
			dto,
			pollId,
			pollVersion,
		);
		const result = await createUserResponseForRecurrenceUseCase.execute(input);

		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
