import { JwtConfig } from '../domains';

const jwtConfig: JwtConfig = {
	secretKeyOfAccessToken: process.env.JWT_SECRET_ACCESS ?? '123',
	secretKeyOfIdToken: process.env.JWT_SECRET_ID ?? '345',
	expiresIn: process.env.JWT_EXPIRE ?? '30d',
};

export const appConfig = {
	jwt: jwtConfig,
};
