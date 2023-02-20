import { BadRequestException } from '@libs/common';
import { IUserRepository, User } from '../domains';
import { SignUpDto, Password, Email, Username } from '../domains';

export class SignUpUseCaseInput {
	constructor(public readonly dto: SignUpDto) {}
}
export class SignUpUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(input: SignUpUseCaseInput): Promise<string> {
		const { dto } = input;
		const { email, password, username } = dto;

		const isNotValidEmail = !Email.isValid(email);
		if (isNotValidEmail) {
			throw new BadRequestException('Email is not valid');
		}

		const isNotValidPassword = !Password.isValid(password);
		if (isNotValidPassword) {
			throw new BadRequestException('Password is not valid');
		}

		const isNotValidUsername = !Username.isValid(username);
		if (isNotValidUsername) {
			throw new BadRequestException('Username is not valid');
		}

		const existedUser = await this.userRepository.findByEmail(email);
		if (existedUser) {
			throw new BadRequestException('User is existed');
		}

		const user = new User({
			email,
			password,
			username,
		});

		await this.userRepository.create(user);
		return 'Signup successfully';
	}
}
