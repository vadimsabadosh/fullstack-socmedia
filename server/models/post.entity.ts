import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	location: string;

	@Column()
	description: string;

	@Column()
	userPicturePath: string;

	@Column()
	picturePath: string;
}
