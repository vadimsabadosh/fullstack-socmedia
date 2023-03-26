import { model, Schema, Types } from "mongoose";

interface IPost {
	comments: Types.ObjectId[];
	userId: string;
	firstName: string;
	lastName: string;
	location: string;
	description: string;
	userPicturePath: string;
	picturePath: string;
	likes: Map<Types.ObjectId, boolean>;
}

const postSchema = new Schema<IPost>(
	{
		userId: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		location: String,
		description: String,
		picturePath: String,
		userPicturePath: String,
		likes: {
			type: Map,
			of: Boolean,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;
