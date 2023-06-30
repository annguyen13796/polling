import { Request, Response } from 'express';
import { SignUpDto, SignInDto } from '../domains';
import { ApiErrorMapper } from '@libs/common';
import { SignUpUseCaseInput, SignInUseCaseInput } from '../usecases';
import { signInUseCase, signUpUseCase } from '../di';
import { appConfig } from '../config';

type Controller = (
	request: Request,
	response: Response,
) => Promise<Response<any, Record<string, any>>>;

export const signup: Controller = async (
	request: Request,
	response: Response,
) => {
	try {
		const dto = request.body as SignUpDto;
		const input = new SignUpUseCaseInput(dto);
		const result = await signUpUseCase.execute(input);
		return response.send(result);
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};

export const signin: Controller = async (
	request: Request,
	response: Response,
) => {
	try {
		const dto = request.body as SignInDto;
		const input = new SignInUseCaseInput(dto, appConfig.jwt);
		const result = await signInUseCase.execute(input);
		return response.status(200).json({
			...result,
		});
	} catch (error) {
		return ApiErrorMapper.toErrorResponse(error, response);
	}
};
