import Post from "../models/Post.ts";
import User from "../models/User.ts";
import Comment from "../models/Comment.ts";
import { ErrorAction } from "../responses/ErrorAction.ts";
import { SuccessfulAction } from "../responses/SuccessfulAction.ts";
import { Request, Response } from "express";

/* CREATE */
export const createPost = async (req: Request, res: Response) => {
	try {
		const { userId, description, picturePath } = req.body;
		const user = await User.findById(userId);

		if (!user)
			return res.status(400).json(new ErrorAction("User does not exist. "));

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
export const getFeedPosts = async (req: Request, res: Response) => {
	try {
		const post = await Post.find().sort({ createdAt: -1 }).populate("comments");
		res.status(200).json(new SuccessfulAction(post));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

export const getUserPosts = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const post = await Post.find({ userId }).populate("comments");
		res.status(200).json(new SuccessfulAction(post));
	} catch (err) {
		res.status(404).json(new ErrorAction(err.message));
	}
};

/* UPDATE */
export const likePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;
		const post = await Post.findById(id);

		if (!post)
			return res.status(400).json(new ErrorAction("Post does not exist. "));
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
export const commentPost = async (req: Request, res: Response) => {
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
export const deleteComment = async (req: Request, res: Response) => {
	try {
		const { postId, commentId } = req.params;
		const userId = req.user._id;

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json(new ErrorAction("Comment does not exist"));
		}

		if (comment.authorId !== userId.toString()) {
			return res.status(401).json(new ErrorAction("Action is not authorized"));
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
export const deletePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;
		const post = await Post.findById(id);

		if (!post) {
			return res.status(404).json(new ErrorAction("Post does not exist"));
		}

		if (post.userId !== userId.toString()) {
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
