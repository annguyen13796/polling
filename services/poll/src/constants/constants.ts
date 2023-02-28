// import { BadRequestException } from '@libs/common/exceptions';

export type POLL_STATUS = 'IDLE' | 'IN PROGRESS' | 'CLOSED';
export type QUESTION_TYPE = 'MULTIPLE' | 'CHECKBOX' | 'TEXT_BOX';
export type RECURRENCE_TYPE = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

// export class QuestionType {
// 	private static types = ['MULTIPLE', 'CHECKBOX', 'TEXT_BOX'];

// 	private constructor(public readonly value: string) {}

// 	public static readonly multiple = QuestionType.create(this.types[0]);
// 	public static readonly checkBox = QuestionType.create(this.types[1]);
// 	public static readonly textBox = QuestionType.create(this.types[2]);

// 	public static create(type: string): QuestionType {
// 		if (!this.types.includes(type)) {
// 			throw new BadRequestException('Invalid type');
// 		}
// 		return new QuestionType(type);
// 	}
// }
