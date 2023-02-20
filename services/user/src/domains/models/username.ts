export class Username {
	private static readonly usernameRegex = /^[a-z0-9_-]{3,50}$/;

	public static isValid(value: string) {
		return this.usernameRegex.test(value);
	}
}
