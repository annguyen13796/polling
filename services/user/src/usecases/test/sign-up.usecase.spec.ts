import { SignUpUseCase, SignUpUseCaseInput } from '../sign-up.usecase';
import {
	Email,
	IUserRepository,
	Password,
	SignUpDto,
	User,
	Username,
} from '../../domains';
import { BadRequestException } from '@libs/common';

jest.mock('uuid', () => {
	return {
		v4: () => {
			return '123';
		},
	};
});

describe('SignUpUseCase test', () => {
	const mockUserRepository: jest.Mocked<IUserRepository> = {
		create: jest.fn(),
		findByEmail: jest.fn(),
		update: jest.fn(),
	};

	const mockUserModel: jest.Mocked<
		Pick<User, 'createAccessToken' | 'createIdToken' | 'hasMatchingPassword'>
	> = {
		createAccessToken: jest.fn(),
		createIdToken: jest.fn(),
		hasMatchingPassword: jest.fn(),
	};

	it('should throw error when Email is not valid', async () => {
		const mockSignupUseCase = new SignUpUseCase(mockUserRepository);

		const mockSignupUseDto: SignUpDto = {
			email: 'wrong-email-format',
			password: 'P@ssw0rd',
			username: 'username',
		};

		const mockSignupUseCaseInput = new SignUpUseCaseInput(mockSignupUseDto);

		Email.isValid = jest.fn().mockReturnValue(false);
		Password.isValid = jest.fn();
		Username.isValid = jest.fn();

		const expectedError = new BadRequestException('Email is not valid');

		await expect(
			mockSignupUseCase.execute(mockSignupUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(Email.isValid).toBeCalledWith(mockSignupUseDto.email);
		expect(Password.isValid).not.toBeCalled();
		expect(Username.isValid).not.toBeCalled();
		expect(mockUserRepository.findByEmail).not.toBeCalled();
		expect(mockUserRepository.create).not.toBeCalled();
	});

	it('should throw error when Password is not valid', async () => {
		const mockSignupUseCase = new SignUpUseCase(mockUserRepository);

		const mockSignupUseDto: SignUpDto = {
			email: 'email@gmail.com',
			password: 'wrong-password-format',
			username: 'username',
		};

		Email.isValid = jest.fn().mockReturnValue(true);
		Password.isValid = jest.fn().mockReturnValue(false);
		Username.isValid = jest.fn();

		const mockSignupUseCaseInput = new SignUpUseCaseInput(mockSignupUseDto);

		const expectedError = new BadRequestException('Password is not valid');

		await expect(
			mockSignupUseCase.execute(mockSignupUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(Email.isValid).toBeCalledWith(mockSignupUseDto.email);
		expect(Password.isValid).toBeCalledWith(mockSignupUseDto.password);
		expect(Username.isValid).not.toBeCalled();
		expect(mockUserRepository.findByEmail).not.toBeCalled();
		expect(mockUserRepository.create).not.toBeCalled();
	});

	it('should throw error when UserName is not valid', async () => {
		const mockSignupUseCase = new SignUpUseCase(mockUserRepository);

		const mockSignupUseDto: SignUpDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: '$^%&*',
		};

		Email.isValid = jest.fn().mockReturnValue(true);
		Password.isValid = jest.fn().mockReturnValue(true);
		Username.isValid = jest.fn().mockReturnValue(false);

		const mockSignupUseCaseInput = new SignUpUseCaseInput(mockSignupUseDto);

		const expectedError = new BadRequestException('Username is not valid');

		await expect(
			mockSignupUseCase.execute(mockSignupUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(Email.isValid).toBeCalledWith(mockSignupUseDto.email);
		expect(Password.isValid).toBeCalledWith(mockSignupUseDto.password);
		expect(Username.isValid).toBeCalledWith(mockSignupUseDto.username);
		expect(mockUserRepository.findByEmail).not.toBeCalled();
		expect(mockUserRepository.create).not.toBeCalled();
	});

	it('should throw error when user is existed', async () => {
		const mockSignupUseCase = new SignUpUseCase(mockUserRepository);

		const mockSignupUseDto: SignUpDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
		};

		Email.isValid = jest.fn().mockReturnValue(true);
		Password.isValid = jest.fn().mockReturnValue(true);
		Username.isValid = jest.fn().mockReturnValue(true);

		const mockSignupUseCaseInput = new SignUpUseCaseInput(mockSignupUseDto);

		const mockExistedUser = new User({
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
		});

		mockUserRepository.findByEmail.mockResolvedValueOnce(mockExistedUser);

		const expectedError = new BadRequestException('User is existed');

		await expect(
			mockSignupUseCase.execute(mockSignupUseCaseInput),
		).rejects.toThrowError(expectedError);

		expect(Email.isValid).toBeCalledWith(mockSignupUseDto.email);
		expect(Password.isValid).toBeCalledWith(mockSignupUseDto.password);
		expect(Username.isValid).toBeCalledWith(mockSignupUseDto.username);
		expect(mockUserRepository.findByEmail).toBeCalledWith(
			mockSignupUseDto.email,
		);
		expect(mockUserRepository.create).not.toBeCalled();
	});

	it('should execute successfully with valid dto', async () => {
		const mockSignupUseCase = new SignUpUseCase(mockUserRepository);

		const mockSignupUseDto: SignUpDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
		};

		Email.isValid = jest.fn().mockReturnValue(true);
		Password.isValid = jest.fn().mockReturnValue(true);
		Username.isValid = jest.fn().mockReturnValue(true);

		const mockSignupUseCaseInput = new SignUpUseCaseInput(mockSignupUseDto);
		const mockUser = new User({
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
		});

		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await mockSignupUseCase.execute(mockSignupUseCaseInput);

		expect(result).toEqual({ message: 'Signup successfully' });
		expect(Email.isValid).toBeCalledWith(mockSignupUseDto.email);
		expect(Password.isValid).toBeCalledWith(mockSignupUseDto.password);
		expect(Username.isValid).toBeCalledWith(mockSignupUseDto.username);
		expect(mockUserRepository.findByEmail).toBeCalledWith(
			mockSignupUseDto.email,
		);
		expect(mockUserRepository.create).toBeCalledWith(mockUser);
	});
});
