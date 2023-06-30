import { GetCommand, GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { User } from '../domains/models';
import { IUserRepository } from '../domains/repositories';
import { UnknownException } from '@libs/common';
import { DynamoDBRepository } from '@libs/common';
import { DatabaseMapper } from '@libs/common';

interface UserDataModel {
	email: string | null | undefined;
	password: string | null | undefined;
	username: string | null | undefined;
	id?: string;
}

export class UserDynamoDBMapper extends DatabaseMapper<User, UserDataModel> {
	toDomain(dataModel: UserDataModel): User {
		const user = new User({
			id: dataModel.id,
			email: dataModel.email,
			password: dataModel.password,
			username: dataModel.username,
		});
		return user;
	}
	fromDomain(domainModel: User): UserDataModel {
		const data: UserDataModel = {
			id: domainModel.id,
			email: domainModel.email,
			password: domainModel.password,
			username: domainModel.username,
		};
		return data;
	}
}

export class UserDynamoRepository
	extends DynamoDBRepository<User, UserDataModel>
	implements IUserRepository
{
	async findByEmail(email: string): Promise<User> {
		try {
			const params: GetCommandInput = {
				TableName: this.config.tableName,
				Key: {
					email: email,
				},
			};

			const { Item } = await this.dynamoDBDocClient.send(
				new GetCommand(params),
			);

			if (Item?.email === email) {
				const existedUser = this.mapper.toDomain(Item as UserDataModel);
				return new User(existedUser);
			}
			return null;
		} catch (error) {
			throw new UnknownException(error);
		}
	}
}
