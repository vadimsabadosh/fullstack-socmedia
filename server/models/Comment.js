import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		authorId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: "This field is required",
		},
		email: {
			type: String,
			required: "This field is required",
		},
		comment: {
			type: String,
			required: "This filed is required",
			unique: true,
		},
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
