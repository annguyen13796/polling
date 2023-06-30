import {
	UserDynamoDBMapper,
	UserDynamoRepository,
} from '../data/user-dynamo.repository';

export const userDomainMapper = new UserDynamoDBMapper();

export const userRepository = new UserDynamoRepository(
	{
		tableName: 'khoa.pham_polling_user',
	},
	userDomainMapper,
);
