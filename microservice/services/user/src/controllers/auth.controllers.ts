import { Request, Response, NextFunction } from "express";
import { SignUpDto, SignInDto } from "../domains/dtos";
import { ApiErrorMapper } from "../../../../libs/common/src/utils";
import {
	SignUpUseCaseInput,
	SignInUseCaseInput,
	SignInUseCaseReturn,
} from "../usecases";
import { signInUseCase, signUpUseCase } from "../di";
import { appConfig } from "../config/app.config";

export const signup = async (request: Request, response: Response) => {
	try {
		const dto = request.body as SignUpDto;
		const input = new SignUpUseCaseInput(dto);
		const result = await signUpUseCase.execute(input);
		return response.send({
			message: result,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
export const signin = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	try {
		const dto = request.body as SignInDto;
		const input = new SignInUseCaseInput(dto, appConfig.jwt);
		const result = await signInUseCase.execute(input);
		return next(sendTokensAndSignInResponse(response, result));
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

// Get token from sign in result, create cookies and send response
const sendTokensAndSignInResponse = (
	response: Response,
	tokens: SignInUseCaseReturn,
) => {
	return response.status(200).json({
		...tokens,
	});
};
