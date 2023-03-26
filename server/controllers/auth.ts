import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.ts";
import { ErrorAction } from "../responses/ErrorAction.ts";
import { SuccessfulAction } from "../responses/SuccessfulAction.ts";
import { TypedRequestBody, TypedRequestBodyWithUser } from "../types/index.ts";
import { Request, Response } from "express";

/* REGISTER USER */
export const register = async (req: TypedRequestBody<IUser>, res: Response) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			picturePath,
			friends,
			location,
			occupation,
		} = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
			picturePath,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 10000),
			impressions: Math.floor(Math.random() * 10000),
		});
		const savedUser = await newUser.save();
		res.status(201).json(new SuccessfulAction(savedUser));
	} catch (error) {
		res.status(500).json(new ErrorAction(error.message));
	}
};

/* LOGGING IN */
export const login = async (
	req: TypedRequestBody<{ email: string; password: string }>,
	res: Response
) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email }).select("-password");
		if (!user)
			return res.status(400).json(new ErrorAction("User does not exist. "));

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json(new ErrorAction("Invalid credentials. "));

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		res.status(200).json(new SuccessfulAction({ token, user }));
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};

/* UPDATE USER */
export const updateUser = async (
	req: TypedRequestBodyWithUser<{ firstName: string; lastName: string }>,
	res: Response
) => {
	try {
		const { firstName, lastName } = req.body;
		const { userId } = req.params;
		const user = await User.findById(userId).select("-password");

		if (!user)
			return res.status(400).json(new ErrorAction("User does not exist. "));

		if (user._id !== req.user._id) {
			return res.status(403).send("Acces denied");
		}

		await user.update({ $set: { firstName, lastName } });

		res.status(200).json(new SuccessfulAction({ user }));
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};

/* IS LOGGED_IN */
export const isLoggedIn = async (req: Request, res: Response) => {
	try {
		let token = req.header("Authorization");

		if (!token) {
			return res.status(403).send("Access Denied");
		}

		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length).trimLeft();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("isLoggedIn  decoded:", decoded);
		//@ts-ignore
		const found = await User.findById(decoded.id).select("-password");
		if (found) {
			return res.status(200).json(new SuccessfulAction({ token, user: found }));
		}
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};
