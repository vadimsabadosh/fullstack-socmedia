import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { ErrorAction } from "../responses/ErrorAction.js";
import { SuccessfulAction } from "../responses/SuccessfulAction.js";
/* CREATE */
export const createPost = async (req, res) => {
	try {
		const { userId, description, picturePath } = req.body;
		const user = await User.findById(userId);
		const newPost = new Post({
			userId,
			firstName: user.firstName,
			lastName: user.lastName,
			location: user.location,
			description,
			userPicturePath: user.picturePath,
			picturePath,
			likes: {},
			comments: [],
		});
		await newPost.save();

		const post = await Post.find();
		res.status(201).json(new SuccessfulAction(post));
	} catch (err) {
		res.status(409).json(new ErrorAction(err.message));
	}
};

/* READ */
export const getFeedPosts = async (req, res) => {
	try {
		const post = await Post.find().sort({ createdAt: -1 }).populate("comments");
		res.status(200).json(new SuccessfulAction(post));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { userId } = req.params;
		const post = await Post.find({ userId }).populate("comments");
		res.status(200).json(new SuccessfulAction(post));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* UPDATE */
export const likePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;
		const post = await Post.findById(id);
		const isLiked = post.likes.get(userId);

		if (isLiked) {
			post.likes.delete(userId);
		} else {
			post.likes.set(userId, true);
		}

		const updatedPost = await Post.findByIdAndUpdate(
			id,
			{ likes: post.likes },
			{ new: true }
		);

		res.status(200).json(new SuccessfulAction(updatedPost));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* ADD COMMENT */
export const commentPost = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;
		const { text, name, email } = req.body;
		const comment = new Comment({
			name,
			email,
			comment: text,
			authorId: userId,
		});
		const savedComment = await comment.save();
		await Post.findOneAndUpdate({ _id: id }, { $push: { comments: comment } });
		res.status(200).json(new SuccessfulAction(savedComment));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const userId = req.user._id;

		const comment = await Comment.findById(commentId);

		if (comment.authorId !== userId) {
			return res.status(401).json(new ErrorAction("Action is not authorized"));
		}

		if (!comment) {
			return res.status(404).json(new ErrorAction("Comment does not exist"));
		}
		comment.remove();
		await Post.findByIdAndUpdate(
			postId,
			{ $pull: { comments: commentId } },
			{ new: true }
		);

		res
			.status(200)
			.json(new SuccessfulAction({ message: "Comment succesfully deleted" }));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* DELETE POST */
export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;
		const post = await Post.findById(id);
		if (post.userId !== userId) {
			return res.status(401).json(new ErrorAction("Action is not authorized"));
		}
		post.remove();
		res
			.status(200)
			.json(new SuccessfulAction({ message: "Post succesfully deleted" }));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};
