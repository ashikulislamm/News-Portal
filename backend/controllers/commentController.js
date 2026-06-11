import * as commentService from "../services/commentService.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Controller to handle comments on news posts
 */
export const createComment = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  const { content } = req.body;
  const comment = await commentService.addComment(newsId, req.user.id, content);
  res.status(201).json({ message: "Comment added successfully", comment });
});

export const getComments = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  const comments = await commentService.getCommentsByNewsId(newsId);
  res.status(200).json(comments);
});

export const updateCommentPost = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const comment = await commentService.updateComment(commentId, req.user.id, content);
  res.status(200).json({ message: "Comment updated successfully", comment });
});

export const deleteCommentPost = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await commentService.deleteComment(commentId, req.user.id);
  res.status(200).json({ message: "Comment deleted successfully" });
});
