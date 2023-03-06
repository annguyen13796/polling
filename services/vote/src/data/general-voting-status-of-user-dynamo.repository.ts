import {
	DatabaseMapper,
	DynamoDBRepository,
	UnknownException,
} from '@libs/common';
import {
	GeneralVotingStatusOfUser,
	IGeneralVotingStatusOfUserRepository,
} from '../domains';

import {
	GetCommandInput,
	GetCommand,
	PutCommandInput,
	PutCommand,
} from '@aws-sdk/lib-dynamodb';

interface GeneralVotingStatusDataModel {
	PK: string | null | undefined;
	SK?: string;
	FinishVoting: boolean;
}

export class GeneralVotingStatusOfUserDynamoDBMapper extends DatabaseMapper<
	GeneralVotingStatusOfUser,
	GeneralVotingStatusDataModel
> {
	toDomain(dataModel: GeneralVotingStatusDataModel): GeneralVotingStatusOfUser {
		const generalVotingStatus = new GeneralVotingStatusOfUser({
			pollId: dataModel.PK.split('#')[1],
			pollVersion: dataModel.PK.split('#')[3],
			pollRecurrence: dataModel.PK.split('#')[5],
			voterEmail: dataModel.SK.split('#')[1],
			finishVoting: dataModel.FinishVoting,
		});
		return generalVotingStatus;
	}
	fromDomain(
		domainModel: GeneralVotingStatusOfUser,
	): GeneralVotingStatusDataModel {
		const data: GeneralVotingStatusDataModel = {
			PK: `POLL#${domainModel.pollId}#VERSION#${domainModel.pollVersion}#RECURRENCE#${domainModel.pollRecurrence}`,
			SK: `VOTER#${domainModel.voterEmail}#GENERAL`,
			FinishVoting: domainModel.finishVoting,
		};
		return data;
	}
}

export class GeneralVotingStatusOfUserDynamoRepository
	extends DynamoDBRepository<
		GeneralVotingStatusOfUser,
		GeneralVotingStatusDataModel
	>
	implements IGeneralVotingStatusOfUserRepository
{
	async getGeneralVotingStatusOfUser(
		pollId: string,
		pollVersion: string,
		recurrence: string,
		voterEmail: string,
	): Promise<GeneralVotingStatusOfUser | null> {
		const params: GetCommandInput = {
			TableName: this.config.tableName,
			Key: {
				PK: `POLL#${pollId}#VERSION#${pollVersion}#RECURRENCE#${recurrence}`,
				SK: `VOTER#${voterEmail}#GENERAL`,
			},
		};
		const { Item } = await this.dynamoDBDocClient.send(new GetCommand(params));
		if (Item) {
			const generalVotingStatusOfUser = this.mapper.toDomain(
				Item as GeneralVotingStatusDataModel,
			);
			return generalVotingStatusOfUser;
		}
		return null;
	}
	async putGeneralVotingStatusOfUser(
		newGeneralVotingStatusOfUserObj: GeneralVotingStatusOfUser,
	): Promise<void> {
		try {
			const dataModel = this.mapper.fromDomain(newGeneralVotingStatusOfUserObj);
			const params: PutCommandInput = {
				TableName: this.config.tableName,
				Item: dataModel as any,
			};
			await this.dynamoDBDocClient.send(new PutCommand(params));
		} catch (error) {
			throw new UnknownException(error);
		}
	}
}
