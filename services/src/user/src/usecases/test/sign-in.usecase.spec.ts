import { SignInUseCase, SignInUseCaseInput } from '../sign-in.usecase';
import { IUserRepository, JwtConfig, SignInDto, User } from '../../domains';
import { BadRequestException, NotFoundException } from '@libs/common';

describe('SignInUseCase test', () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

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

	const mockJwt: JwtConfig = {
		expiresIn: '30d',
		secretKeyOfAccessToken: 'accessTokenSecret',
		secretKeyOfIdToken: 'idTokenSecret',
	};

	it('should throw error when email is missing', async () => {
		const mockSignInDto: SignInDto = {
			email: null,
			password: 'P@ssw0rd',
		};

		const mockSignInUseCase = new SignInUseCase(mockUserRepository);

		const expectedError = new NotFoundException('Missing email');

		await expect(
			mockSignInUseCase.execute(new SignInUseCaseInput(mockSignInDto, mockJwt)),
		).rejects.toThrow(expectedError);

		expect(mockUserRepository.findByEmail).not.toBeCalled();
		expect(mockUserModel.hasMatchingPassword).not.toBeCalled();
		expect(mockUserModel.createAccessToken).not.toBeCalled();
		expect(mockUserModel.createIdToken).not.toBeCalled();
	});

	it('should throw error when password is missing', async () => {
		const mockSignInDto: SignInDto = {
			email: 'email@gmail.com',
			password: null,
		};

		const mockSignInUseCase = new SignInUseCase(mockUserRepository);

		const expectedError = new BadRequestException('Missing password');

		await expect(
			mockSignInUseCase.execute(new SignInUseCaseInput(mockSignInDto, mockJwt)),
		).rejects.toThrow(expectedError);

		expect(mockUserRepository.findByEmail).not.toBeCalled();
		expect(mockUserModel.createAccessToken).not.toBeCalled();
		expect(mockUserModel.createIdToken).not.toBeCalled();
		expect(mockUserModel.hasMatchingPassword).not.toBeCalled();
	});

	it('should throw error when user is not existed', async () => {
		const mockSignInDto: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const mockSignInUseCase = new SignInUseCase(mockUserRepository);

		const expectedError = new BadRequestException('User is not existed');

		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		await expect(
			mockSignInUseCase.execute(new SignInUseCaseInput(mockSignInDto, mockJwt)),
		).rejects.toThrow(expectedError);

		expect(mockUserRepository.findByEmail).toBeCalledWith('email@gmail.com');
		expect(mockUserModel.hasMatchingPassword).not.toBeCalled();
		expect(mockUserModel.createAccessToken).not.toBeCalled();
		expect(mockUserModel.createIdToken).not.toBeCalled();
	});

	it('should throw error when password is incorrect', async () => {
		const mockSignInDto: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const mockExistedUser: User = new User({
			email: 'email@gmail.com',
			password: 'anotherP@ssw0rd',
			username: 'username',
			id: 'random id',
		});

		const mockSignInUseCase = new SignInUseCase(mockUserRepository);

		mockUserRepository.findByEmail.mockResolvedValueOnce(mockExistedUser);

		mockExistedUser.hasMatchingPassword = mockUserModel.hasMatchingPassword;
		mockUserModel.hasMatchingPassword.mockReturnValueOnce(false);

		const expectedError = new BadRequestException('Password is incorrect');

		await expect(
			mockSignInUseCase.execute(new SignInUseCaseInput(mockSignInDto, mockJwt)),
		).rejects.toThrow(expectedError);

		expect(mockUserRepository.findByEmail).toBeCalledWith('email@gmail.com');
		expect(mockUserModel.hasMatchingPassword).toBeCalledWith('P@ssw0rd');
		expect(mockUserModel.createAccessToken).not.toBeCalled();
		expect(mockUserModel.createIdToken).not.toBeCalled();
	});

	it('should execute successfully with valid credential', async () => {
		const mockSignInDto: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const mockExistedUser: User = new User({
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
			id: 'id',
		});

		const mockSignInUseCase = new SignInUseCase(mockUserRepository);

		mockUserRepository.findByEmail.mockResolvedValueOnce(mockExistedUser);

		mockExistedUser.hasMatchingPassword = mockUserModel.hasMatchingPassword;
		mockUserModel.hasMatchingPassword.mockReturnValueOnce(true);

		mockExistedUser.createAccessToken = mockUserModel.createAccessToken;
		mockUserModel.createAccessToken.mockReturnValueOnce('accessToken');

		mockExistedUser.createIdToken = mockUserModel.createIdToken;
		mockUserModel.createIdToken.mockReturnValueOnce('idToken');

		const result = await mockSignInUseCase.execute(
			new SignInUseCaseInput(mockSignInDto, mockJwt),
		);

		expect(result).toEqual({
			accessToken: 'accessToken',
			idToken: 'idToken',
		});
		expect(mockUserRepository.findByEmail).toBeCalledWith('email@gmail.com');
		expect(mockUserModel.hasMatchingPassword).toBeCalledWith('P@ssw0rd');
		expect(mockUserModel.createAccessToken).toBeCalled();
		expect(mockUserModel.createIdToken).toBeCalled();
	});
});
