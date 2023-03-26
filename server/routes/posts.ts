import express from "express";
import {
	getFeedPosts,
	getUserPosts,
	likePost,
	commentPost,
	deleteComment,
	deletePost,
} from "../controllers/posts.ts";
import { verifyToken } from "../middleware/auth.ts";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* CREATE COMMENT */
router.post("/:id/add-comment", verifyToken, commentPost);

/* DELETE COMMENT */
router.delete("/:postId/:commentId", verifyToken, deleteComment);

/* DELETE POST */
router.delete("/:id", verifyToken, deletePost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
