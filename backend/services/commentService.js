import Comment from "../models/CommentModel.js";
import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import { NotFoundError, ForbiddenError } from "../utils/appError.js";

/**
 * Service to handle Comments logic
 */
export const addComment = async (newsId, userId, content) => {
  // Verify news article exists
  const news = await News.findById(newsId);
  if (!news) {
    throw new NotFoundError("News article not found");
  }

  // Fetch user details for the author name cache
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const comment = new Comment({
    newsId,
    userId,
    userName: user.fullName,
    content,
  });

  await comment.save();

  // Increment comment count in News article
  news.commentCount = (news.commentCount || 0) + 1;
  await news.save();

  return comment;
};

export const getCommentsByNewsId = async (newsId) => {
  return await Comment.find({ newsId })
    .sort({ createdAt: -1 })
    .populate("userId", "fullName");
};

export const updateComment = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // Check authorization: only the author of the comment can edit
  if (comment.userId.toString() !== userId) {
    throw new ForbiddenError("Unauthorized to edit this comment");
  }

  comment.content = content;
  await comment.save();
  return comment;
};

export const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // Fetch news article to check news owner permissions
  const news = await News.findById(comment.newsId);
  const isCommentOwner = comment.userId.toString() === userId;
  const isNewsOwner = news && news.author.userId.toString() === userId;

  if (!isCommentOwner && !isNewsOwner) {
    throw new ForbiddenError("Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  // Decrement comment count in News article
  if (news) {
    news.commentCount = Math.max(0, (news.commentCount || 0) - 1);
    await news.save();
  }

  return true;
};
