import { IUserRepository, User } from "../domains";
import { BadRequestionException } from "../exceptions";
import { SignUpDto, Password, Email, PhoneNumber, Username } from "../domains";

export class SignUpUseCaseInput {
	constructor(public readonly dto: SignUpDto) {}
}
export class SignUpUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(input: SignUpUseCaseInput): Promise<string> {
		try {
			const { dto } = input;
			const { email, password, username, phoneNumber } = dto;

			const isNotValidEmail = !Email.isValid(email);
			if (isNotValidEmail) {
				throw new BadRequestionException("Email is not valid");
			}

			const isNotValidPassword = !Password.isValid(password);
			if (isNotValidPassword) {
				throw new BadRequestionException("Password is not valid");
			}

			const isNotValidUsername = !Username.isValid(username);
			if (isNotValidUsername) {
				throw new BadRequestionException("Username is not valid");
			}

			if (phoneNumber) {
				const isNotValidPhoneNumber = !PhoneNumber.isValid(phoneNumber);
				if (isNotValidPhoneNumber) {
					throw new BadRequestionException("Phone number is not valid");
				}
			}

			const existedUser = await this.userRepository.findByEmail(email);
			if (existedUser) {
				throw new BadRequestionException("User is existed");
			}

			const user = new User({
				email,
				password,
				username,
				phoneNumber,
			});

			await this.userRepository.create(user);
			return "Signup successfully";
		} catch (error) {
			throw error;
		}
	}
}
