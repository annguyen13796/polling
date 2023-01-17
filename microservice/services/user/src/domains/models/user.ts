import {
	BadRequestException,
	NotFoundException,
} from "../../../../../libs/common/src/exceptions";
import { isStringEmptyOrUndefined } from "../../../../../libs/common/src/utils";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export interface UserProps {
	email: string | null | undefined;
	password: string | null | undefined;
	username: string | null | undefined;
	id?: string;
	phoneNumber?: string;
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

	public get phoneNumber() {
		return this.props.phoneNumber;
	}

	public get id() {
		return this.props.id;
	}

	constructor(private readonly props: UserProps) {
		if (!props)
			throw new BadRequestException("Props of user is null/undefined");

		const { email, password, username, phoneNumber, id } = props;
		if (isStringEmptyOrUndefined(email)) {
			throw new BadRequestException("Email is null/undefined");
		}

		if (isStringEmptyOrUndefined(password)) {
			throw new BadRequestException("Password is null/undefined");
		}
		if (isStringEmptyOrUndefined(username)) {
			throw new BadRequestException("Username is null/undefined");
		}
		if (!phoneNumber) {
			this.props.phoneNumber = "";
		}
		if (!id) {
			this.props.id = uuid();
		}
	}

	public updateUsername(username: string): void {
		console.log("update new username", username);
		if (isStringEmptyOrUndefined(username)) {
			throw new BadRequestException("Username is not null/undefined");
		}
		this.props.username = username;
	}

	public updatePhoneNumber(phoneNumber: string): void {
		console.log("update new phone");
		if (isStringEmptyOrUndefined(phoneNumber)) {
			throw new BadRequestException("Username is not null/undefined");
		}
		this.props.phoneNumber = phoneNumber;
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
				phoneNumber: this.phoneNumber,
			},
			secretKey,
			{
				expiresIn,
			},
		);
	}
}
