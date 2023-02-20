import { IUserRepository } from '../domains';
import {
	NotFoundException,
	BadRequestException,
	JwtConfig,
} from '@libs/common';
import { SignInDto } from '../domains/dtos';

export class SignInUseCaseInput {
	constructor(
		public readonly dto: SignInDto,
		public readonly jwtConfig: JwtConfig,
	) {}
}
export class SignInUseCaseReturn {
	constructor(
		public readonly accessToken: string,
		public readonly idToken: string,
	) {}
}
export class SignInUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(input: SignInUseCaseInput): Promise<SignInUseCaseReturn> {
		const { dto, jwtConfig } = input;
		const { email, password } = dto;

		if (!email || !password) {
			const missingFields = [];

			if (!email) {
				missingFields.push('email');
			}
			if (!password) {
				missingFields.push('password');
			}
			throw new BadRequestException(`Missing ${missingFields.join(', ')}`);
		}

		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			throw new NotFoundException('User is not existed');
		}

		const isPasswordNotMatched = !existedUser.hasMatchingPassword(password);
		if (isPasswordNotMatched) {
			throw new BadRequestException('Password is incorrect');
		}

		const accessToken = existedUser.createAccessToken(
			jwtConfig.secretKeyOfAccessToken,
			jwtConfig.expiresIn,
		);
		const idToken = existedUser.createIdToken(
			jwtConfig.secretKeyOfIdToken,
			jwtConfig.expiresIn,
		);

		return {
			accessToken,
			idToken,
		};
	}
}
