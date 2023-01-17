import { IUserRepository, JwtConfig } from "../domains";
import { BadRequestionException, NotFoundException } from "../exceptions";
import { SignInDto } from "../domains";

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
		try {
			const { dto, jwtConfig } = input;
			const { email, password } = dto;

			const existedUser = await this.userRepository.findByEmail(email);
			if (!existedUser) {
				throw new NotFoundException("User is not existed");
			}

			const isPasswordNotMatched = !existedUser.hasMatchingPassword(password);
			if (isPasswordNotMatched)
				throw new BadRequestionException("Password is incorrect");

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
		} catch (error) {
			throw error;
		}
	}
}
