import { SignInUseCase, SignInUseCaseInput } from '../sign-in.usecase';
import { IUserRepository, JwtConfig, SignInDto, User } from '../../domains';
import { BadRequestException, NotFoundException } from '@libs/common';

describe('SignInUseCase test', () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

	const userRepositoryMock: jest.Mocked<IUserRepository> = {
		create: jest.fn(),
		findByEmail: jest.fn(),
		update: jest.fn(),
	};

	const userModelMock: jest.Mocked<
		Pick<User, 'createAccessToken' | 'createIdToken' | 'hasMatchingPassword'>
	> = {
		createAccessToken: jest.fn(),
		createIdToken: jest.fn(),
		hasMatchingPassword: jest.fn(),
	};

	const jwtMock: JwtConfig = {
		expiresIn: '30d',
		secretKeyOfAccessToken: 'accessTokenSecret',
		secretKeyOfIdToken: 'idTokenSecret',
	};

	it('should throw error when email is missing', async () => {
		const signInDtoMock: SignInDto = {
			email: null,
			password: 'P@ssw0rd',
		};

		const signInUseCaseMock = new SignInUseCase(userRepositoryMock);

		const expectedError = new NotFoundException('Missing email');

		await expect(
			signInUseCaseMock.execute(new SignInUseCaseInput(signInDtoMock, jwtMock)),
		).rejects.toThrow(expectedError);

		expect(userRepositoryMock.findByEmail).not.toBeCalled();
		expect(userModelMock.createAccessToken).not.toBeCalled();
		expect(userModelMock.createIdToken).not.toBeCalled();
		expect(userModelMock.hasMatchingPassword).not.toBeCalled();
	});

	it('should throw error when password is missing', async () => {
		const signInDtoMock: SignInDto = {
			email: 'email@gmail.com',
			password: null,
		};

		const signInUseCaseMock = new SignInUseCase(userRepositoryMock);

		const expectedError = new BadRequestException('Missing password');

		await expect(
			signInUseCaseMock.execute(new SignInUseCaseInput(signInDtoMock, jwtMock)),
		).rejects.toThrow(expectedError);

		expect(userRepositoryMock.findByEmail).not.toBeCalled();
		expect(userModelMock.createAccessToken).not.toBeCalled();
		expect(userModelMock.createIdToken).not.toBeCalled();
		expect(userModelMock.hasMatchingPassword).not.toBeCalled();
	});

	it('should throw error when user is not existed', async () => {
		const signInDtoMock: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const signInUseCaseMock = new SignInUseCase(userRepositoryMock);

		const expectedError = new BadRequestException('User is not existed');

		userRepositoryMock.findByEmail.mockResolvedValueOnce(null);

		await expect(
			signInUseCaseMock.execute(new SignInUseCaseInput(signInDtoMock, jwtMock)),
		).rejects.toThrow(expectedError);

		expect(userRepositoryMock.findByEmail).toBeCalledWith('email@gmail.com');
		expect(userModelMock.createAccessToken).not.toBeCalled();
		expect(userModelMock.createIdToken).not.toBeCalled();
		expect(userModelMock.hasMatchingPassword).not.toBeCalled();
	});

	it('should throw error when password is incorrect', async () => {
		const signInDtoMock: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const existedUserMock: User = new User({
			email: 'email@gmail.com',
			password: 'anotherP@ssw0rd',
			username: 'username',
			id: 'random id',
		});

		const signInUseCaseMock = new SignInUseCase(userRepositoryMock);

		userRepositoryMock.findByEmail.mockResolvedValueOnce(existedUserMock);

		existedUserMock.hasMatchingPassword = userModelMock.hasMatchingPassword;
		userModelMock.hasMatchingPassword.mockReturnValueOnce(false);

		const expectedError = new BadRequestException('Password is incorrect');

		await expect(
			signInUseCaseMock.execute(new SignInUseCaseInput(signInDtoMock, jwtMock)),
		).rejects.toThrow(expectedError);

		expect(userRepositoryMock.findByEmail).toBeCalledWith('email@gmail.com');
		expect(userModelMock.hasMatchingPassword).toBeCalledWith('P@ssw0rd');
		expect(userModelMock.createAccessToken).not.toBeCalled();
		expect(userModelMock.createIdToken).not.toBeCalled();
	});

	it('should execute successfully with valid credential', async () => {
		const signInDtoMock: SignInDto = {
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
		};

		const existedUserMock: User = new User({
			email: 'email@gmail.com',
			password: 'P@ssw0rd',
			username: 'username',
			id: 'id',
		});

		const signInUseCaseMock = new SignInUseCase(userRepositoryMock);

		userRepositoryMock.findByEmail.mockResolvedValueOnce(existedUserMock);

		existedUserMock.hasMatchingPassword = userModelMock.hasMatchingPassword;
		userModelMock.hasMatchingPassword.mockReturnValueOnce(true);

		existedUserMock.createAccessToken = userModelMock.createAccessToken;
		userModelMock.createAccessToken.mockReturnValueOnce('accessToken');

		existedUserMock.createIdToken = userModelMock.createIdToken;
		userModelMock.createIdToken.mockReturnValueOnce('idToken');

		const result = await signInUseCaseMock.execute(
			new SignInUseCaseInput(signInDtoMock, jwtMock),
		);

		expect(result).toEqual({
			accessToken: 'accessToken',
			idToken: 'idToken',
		});
		expect(userRepositoryMock.findByEmail).toBeCalledWith('email@gmail.com');
		expect(userModelMock.hasMatchingPassword).toBeCalledWith('P@ssw0rd');
		expect(userModelMock.createAccessToken).toBeCalled();
		expect(userModelMock.createIdToken).toBeCalled();
	});
});
