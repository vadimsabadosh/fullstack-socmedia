import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorAction } from "../responses/ErrorAction.js";
import { SuccessfulAction } from "../responses/SuccessfulAction.js";
/* REGISTER USER */
export const register = async (req, res) => {
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
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};

/* LOGGING IN */
export const login = async (req, res) => {
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
export const updateUser = async (req, res) => {
	try {
		const { firstName, lastName } = req.body;
		const { userId } = req.params;
		//TODO: change names
		const user = await User.findById(userId).select("-password");
		if (user._id !== req.user._id) {
			return res.status(403).send("Acces denied");
		}
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

/* IS LOGGED_IN */
export const isLoggedIn = async (req, res) => {
	try {
		let token = req.header("Authorization");

		if (!token) {
			return res.status(403).send("Access Denied");
		}

		if (token.startsWith("Bearer ")) {
			token = token.slice(7, token.length).trimLeft();
		}

		// decoding the token with scerect key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// asign to a var
		const found = await User.findById(decoded.id).select("-password");
		if (found) {
			return res.status(200).json(new SuccessfulAction({ token, user: found }));
		}
	} catch (err) {
		res.status(500).json(new ErrorAction(err.message));
	}
};
