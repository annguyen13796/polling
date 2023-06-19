import { ApiErrorMapper, BadRequestException } from '@libs/common';
import { Response, NextFunction } from 'express';

export const decodeParams = async (
	request: any,
	response: Response,
	next: NextFunction,
) => {
	try {
		const encodedURL = request.params?.url;

		const pollId = Buffer.from(encodedURL, 'base64').toString('utf-8');

		if (!pollId) {
			throw new BadRequestException('Invalid Poll');
		}

		request.pollId = pollId;

		next();
	} catch (error) {
		return next(ApiErrorMapper.toErrorResponse(error, response));
	}
};
