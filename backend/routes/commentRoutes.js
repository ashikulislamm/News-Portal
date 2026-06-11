import express from "express";
import Comment from "../models/CommentModel.js";
import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/comments/news/:newsId - Add a comment to a news article
router.post("/news/:newsId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { newsId } = req.params;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // Verify news article exists
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }

    // Fetch user details to get fullName
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = new Comment({
      newsId,
      userId: req.user.id,
      userName: user.fullName,
      content,
    });

    await comment.save();

    // Increment comment count in News article
    news.commentCount = (news.commentCount || 0) + 1;
    await news.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/comments/news/:newsId - Get all comments for a news article
router.get("/news/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;

    const comments = await Comment.find({ newsId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName");

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/comments/:commentId - Update a comment
router.put("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check authorization: only the author of the comment can edit it
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/comments/:commentId - Delete a comment
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check authorization: comment owner OR news article owner can delete
    const news = await News.findById(comment.newsId);
    
    const isCommentOwner = comment.userId.toString() === req.user.id;
    const isNewsOwner = news && news.author.userId.toString() === req.user.id;

    if (!isCommentOwner && !isNewsOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Decrement comment count in News article
    if (news) {
      news.commentCount = Math.max(0, (news.commentCount || 0) - 1);
      await news.save();
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
