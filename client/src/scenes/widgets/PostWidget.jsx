import {
	ChatBubbleOutlineOutlined,
	FavoriteBorderOutlined,
	FavoriteOutlined,
	ShareOutlined,
} from "@mui/icons-material";
import {
	Box,
	Divider,
	IconButton,
	Typography,
	useTheme,
	InputBase,
	Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setComment } from "state";

const PostWidget = ({
	postId,
	postUserId,
	name,
	description,
	location,
	picturePath,
	userPicturePath,
	likes,
	comments,
}) => {
	const [isComments, setIsComments] = useState(false);
	const [comment, setInputComment] = useState("");
	const dispatch = useDispatch();
	const token = useSelector((state) => state.token);
	const user = useSelector((state) => state.user);
	const loggedInUserId = useSelector((state) => state.user._id);
	const isLiked = Boolean(likes[loggedInUserId]);
	const likeCount = Object.keys(likes).length;

	const { palette } = useTheme();
	const main = palette.neutral.main;
	const primary = palette.primary.main;

	const patchLike = async () => {
		const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId: loggedInUserId }),
		});
		const updatedPost = await response.json();
		dispatch(setPost({ post: updatedPost.data }));
	};

	const handleComment = async () => {
		const response = await fetch(
			`http://localhost:3001/posts/${postId}/add-comment`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: user.firstName,
					email: user.email,
					text: comment,
				}),
			}
		);
		const newComment = await response.json();
		dispatch(setComment({ postId, comment: newComment.data }));
		setInputComment("");
	};

	const deleteComment = async (commentId) => {
		const response = await fetch(
			`http://localhost:3001/posts/${postId}/${commentId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		console.log("deleteComment  response:", response);
	};
	const deletePost = async () => {
		const response = await fetch(`http://localhost:3001/posts/${postId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		console.log("deleteComment  response:", response);
	};

	return (
		<WidgetWrapper m="2rem 0">
			<Friend
				friendId={postUserId}
				name={name}
				subtitle={location}
				userPicturePath={userPicturePath}
			/>
			<button onClick={() => deletePost()}>delete post</button>
			<Typography color={main} sx={{ mt: "1rem" }}>
				{description}
			</Typography>
			{picturePath && (
				<img
					width="100%"
					height="auto"
					alt="post"
					style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
					src={`http://localhost:3001/assets/${picturePath}`}
				/>
			)}
			<FlexBetween mt="0.25rem">
				<FlexBetween gap="1rem">
					<FlexBetween gap="0.3rem">
						<IconButton onClick={patchLike}>
							{isLiked ? (
								<FavoriteOutlined sx={{ color: primary }} />
							) : (
								<FavoriteBorderOutlined />
							)}
						</IconButton>
						<Typography>{likeCount}</Typography>
					</FlexBetween>

					<FlexBetween gap="0.3rem">
						<IconButton onClick={() => setIsComments(!isComments)}>
							<ChatBubbleOutlineOutlined />
						</IconButton>
						<Typography>{comments.length}</Typography>
					</FlexBetween>
				</FlexBetween>

				<IconButton>
					<ShareOutlined />
				</IconButton>
			</FlexBetween>
			{isComments && (
				<Box mt="0.5rem">
					{comments.map((comment) => (
						<Box key={comment.comment}>
							<button onClick={() => deleteComment(comment._id)}>
								Delete comment
							</button>
							<Divider />
							<Box sx={{ display: "flex" }}>
								<Typography
									sx={{
										color: palette.primary.main,
										mr: "1rem",
									}}
								>
									{comment.name}
								</Typography>
								<Typography
									sx={{
										color: palette.primary.dark,
									}}
								>
									{comment.email}
								</Typography>
							</Box>
							<Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
								{comment.comment}
							</Typography>
						</Box>
					))}
					<Divider />
					<FlexBetween gap="1.5rem" marginTop="1rem">
						<InputBase
							placeholder="What's on your mind..."
							onChange={(e) => setInputComment(e.target.value)}
							value={comment}
							sx={{
								width: "100%",
								backgroundColor: palette.neutral.light,
								borderRadius: "2rem",
								padding: "1rem 2rem",
							}}
						/>
						<Button
							disabled={!comment}
							onClick={handleComment}
							sx={{
								color: palette.background.alt,
								backgroundColor: palette.primary.main,
								borderRadius: "3rem",
							}}
						>
							POST
						</Button>
					</FlexBetween>
				</Box>
			)}
		</WidgetWrapper>
	);
};

export default PostWidget;
