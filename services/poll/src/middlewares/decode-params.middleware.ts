import { ApiErrorMapper, BadRequestException } from '@libs/common';
import { Response, NextFunction } from 'express';

export const decodeParams = async (
	request: any,
	response: Response,
	next: NextFunction,
) => {
	try {
		const urlParams = request.params?.url;

		const pollId = atob(urlParams);

		if (!pollId) {
			throw new BadRequestException('Invalid Poll');
		}

		request.pollId = pollId;

		next();
	} catch (error) {
		return next(ApiErrorMapper.toErrorResponse(error, response));
	}
};
