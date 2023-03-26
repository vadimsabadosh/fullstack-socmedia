import { model, Schema, Types } from "mongoose";

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	picturePath: string;
	friends: Array<IUser>;
	location: string;
	occupation: string;
	viewedProfile: number;
	impressions: number;
}

const UserSchema = new Schema<IUser>(
	{
		firstName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		lastName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 5,
		},
		picturePath: {
			type: String,
			default: "",
		},
		friends: {
			type: [{ type: Types.ObjectId, ref: "User" }],
			default: [],
		},
		location: String,
		occupation: String,
		viewedProfile: Number,
		impressions: Number,
	},
	{ timestamps: true }
);

const User = model("User", UserSchema);
export default User;
