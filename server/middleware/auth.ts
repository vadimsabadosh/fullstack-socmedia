import jwt from "jsonwebtoken";
import { ErrorAction } from "../responses/ErrorAction.js";
import { NextFunction, Request, Response } from "express";
import { IDocUser } from "../types/index.js";

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let token = req.header("Authorization");

		if (!token) {
			return res.status(403).send("Access Denied");
		}

		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length).trimLeft();
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified as IDocUser;
		next();
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};
