import { SignUpUseCase, SignUpUseCaseInput } from '../sign-up.usecase';
import { IUserRepository, User } from '../../domains';
import { BadRequestException } from '@libs/common';

// import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => {
	return {
		v4: () => {
			return '123';
		},
	};
});

describe('SignUpUseCase', () => {
	describe('execute', () => {
		let userRepository: IUserRepository;
		let signupUseCaseInput: SignUpUseCaseInput;

		const userRepoMockCreate = jest.fn();
		const userRepoMockUpdate = jest.fn();
		const userRepoMockFindByEmail = jest.fn();

		beforeEach(() => {
			userRepository = {
				create: userRepoMockCreate,
				update: userRepoMockUpdate,
				findByEmail: userRepoMockFindByEmail,
			};
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should throw Email is not valid', async () => {
			const signupUseCase = new SignUpUseCase(userRepository);
			signupUseCaseInput = {
				dto: {
					email: 'asd',
					password: 'asd',
					username: 'asd',
				},
			};
			await expect(
				signupUseCase.execute(signupUseCaseInput),
			).rejects.toThrowError(new BadRequestException('Email is not valid'));
		});

		it('should throw Password is not valid', async () => {
			const signupUseCase = new SignUpUseCase(userRepository);
			signupUseCaseInput = {
				dto: {
					email: 'Namkhoa@gmail.com',
					password: 'asd',
					username: 'asd',
				},
			};
			await expect(
				signupUseCase.execute(signupUseCaseInput),
			).rejects.toThrowError(new BadRequestException('Password is not valid'));
		});

		it('should throw UserName is not valid', async () => {
			const signupUseCase = new SignUpUseCase(userRepository);
			signupUseCaseInput = {
				dto: {
					email: 'Namkhoa@gmail.com',
					password: 'P@ssw0rd',
					username: 'a',
				},
			};
			await expect(
				signupUseCase.execute(signupUseCaseInput),
			).rejects.toThrowError(new BadRequestException('Username is not valid'));
		});

		it('should call findByEmail then throw exception when user is existed', async () => {
			const signupUseCase = new SignUpUseCase(userRepository);
			signupUseCaseInput = {
				dto: {
					email: 'Namkhoa@gmail.com',
					password: 'P@ssw0rd',
					username: 'aaaaaaaaaaa',
				},
			};
			const returnUserMock = new User({
				email: 'Namkhoa@gmail.com',
				password: 'P@ssw0rd',
				username: 'aaaaaaaaaaa',
			});

			userRepoMockFindByEmail.mockResolvedValueOnce(returnUserMock);

			await expect(
				signupUseCase.execute(signupUseCaseInput),
			).rejects.toThrowError(new BadRequestException('User is existed'));
			expect(userRepoMockFindByEmail).toBeCalledWith(
				signupUseCaseInput.dto.email,
			);
		});

		it('should call findByEmail,create user then return success', async () => {
			const signupUseCase = new SignUpUseCase(userRepository);
			signupUseCaseInput = {
				dto: {
					email: 'Namkhoa@gmail.com',
					password: 'P@ssw0rd',
					username: 'aaaaaaaaaaa',
				},
			};
			const newUser = new User({
				email: 'Namkhoa@gmail.com',
				password: 'P@ssw0rd',
				username: 'aaaaaaaaaaa',
			});

			userRepoMockFindByEmail.mockResolvedValueOnce(null);

			const value = await signupUseCase.execute(signupUseCaseInput);
			expect(userRepoMockFindByEmail).toBeCalledWith(
				signupUseCaseInput.dto.email,
			);
			expect(userRepoMockCreate).toBeCalledWith(newUser);
			expect(value).toEqual({
				message: 'Signup successfully',
			});
		});
	});
});
