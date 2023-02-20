import { IRepository } from '@libs/common';
import { User } from '../models';

export interface IUserRepository extends IRepository<User> {
	findByEmail(email: string): Promise<User>;
}
