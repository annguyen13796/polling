import { SignInUseCase, SignUpUseCase } from '../usecases';

import { userRepository } from './init-repositories';

export const signInUseCase = new SignInUseCase(userRepository);
export const signUpUseCase = new SignUpUseCase(userRepository);
