import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	post: string;

	@Column()
	authorId: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	comment: string;
}
