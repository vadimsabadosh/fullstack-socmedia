import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	picturePath: string;

	@Column()
	location: string;

	@Column()
	occupation: string;

	@Column()
	viewedProfile: number;

	@Column()
	impressions: number;
}
