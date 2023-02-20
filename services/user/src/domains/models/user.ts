import { BadRequestException } from '@libs/common';
import { isStringEmptyOrUndefined } from '@libs/common';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

export interface UserProps {
	email: string | null | undefined;
	password: string | null | undefined;
	username: string | null | undefined;
	id?: string;
}
export class User {
	public get email() {
		return this.props.email;
	}

	public get password() {
		return this.props.password;
	}

	public get username() {
		return this.props.username;
	}

	public get id() {
		return this.props.id;
	}

	constructor(private readonly props: UserProps) {
		if (!props) {
			throw new BadRequestException('Props of user is null/undefined');
		}

		const { email, password, username, id } = props;
		if (isStringEmptyOrUndefined(email)) {
			throw new BadRequestException('Email is null/undefined');
		}
		if (isStringEmptyOrUndefined(password)) {
			throw new BadRequestException('Password is null/undefined');
		}
		if (isStringEmptyOrUndefined(username)) {
			throw new BadRequestException('Username is null/undefined');
		}

		if (!id) {
			this.props.id = uuid();
		}
	}

	public updateUsername(username: string): void {
		if (isStringEmptyOrUndefined(username)) {
			throw new BadRequestException('Username is not null/undefined');
		}
		this.props.username = username;
	}

	public hasMatchingPassword(enteredPassword: string): boolean {
		return this.password === enteredPassword;
	}

	public createAccessToken(secretKey: string, expiresIn: string): string {
		return jwt.sign(
			{
				id: this.id,
			},
			secretKey,
			{
				expiresIn,
			},
		);
	}
	public createIdToken(secretKey: string, expiresIn: string): string {
		return jwt.sign(
			{
				id: this.id,
				email: this.email,
				username: this.username,
			},
			secretKey,
			{
				expiresIn,
			},
		);
	}
}
