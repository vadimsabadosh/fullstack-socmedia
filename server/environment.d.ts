import { Secret } from "jsonwebtoken";
import { IDocUser } from "./types/index.ts";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: Secret;
			MONGO_URL: string;
			PORT: number;
		}
	}
}

declare global {
	namespace Express {
		interface Request {
			user: IDocUser;
		}
	}
}

export {};
