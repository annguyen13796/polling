export class PhoneNumber {
	private static readonly phoneNumberRegex =
		/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

	public static isValid(value: string) {
		return this.phoneNumberRegex.test(value);
	}
}
