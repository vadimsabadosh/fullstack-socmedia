import User from "../models/User.js";
import { ErrorAction } from "../responses/ErrorAction.js";
import { SuccessfulAction } from "../responses/SuccessfulAction.js";
/* READ */
export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select("-password");
		res.status(200).json(new SuccessfulAction(user));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id).select("-password"))
		);
		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);
		res.status(200).json(new SuccessfulAction(formattedFriends));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
	try {
		const { id, friendId } = req.params;
		const user = await User.findById(id).select("-password");
		const friend = await User.findById(friendId).select("-password");

		if (user.friends.includes(friendId)) {
			user.friends = user.friends.filter((id) => id !== friendId);
			friend.friends = friend.friends.filter((id) => id !== id);
		} else {
			user.friends.push(friendId);
			friend.friends.push(id);
		}
		await user.save();
		await friend.save();

		const friends = await Promise.all(
			user.friends.map((id) => User.findById(id).select("-password"))
		);
		const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
		);

		res.status(200).json(new SuccessfulAction(formattedFriends));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};
