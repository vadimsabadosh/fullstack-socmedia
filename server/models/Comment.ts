import { Types, Schema, model } from "mongoose";

interface IComment {
	post: Types.ObjectId;
	authorId: string;
	name: string;
	email: string;
	comment: string;
}

const CommentSchema = new Schema<IComment>(
	{
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},
		authorId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

const Comment = model("Comment", CommentSchema);

export default Comment;
