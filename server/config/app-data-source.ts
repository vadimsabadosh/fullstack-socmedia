import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "user",
	password: "pass",
	database: "db",
	entities: ["entities/*.ts"],
	logging: true,
	synchronize: true,
});
