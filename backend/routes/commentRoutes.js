import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { validateComment } from "../utils/validator.js";
import {
  createComment,
  getComments,
  updateCommentPost,
  deleteCommentPost,
} from "../controllers/commentController.js";

const router = express.Router();

// Get all comments for a news post (public)
router.get("/news/:newsId", getComments);

// Add a comment to a news article (authenticated, validation)
router.post("/news/:newsId", authMiddleware, validateComment, createComment);

// Update an existing comment (authenticated, owner checks, validation)
router.put("/:commentId", authMiddleware, validateComment, updateCommentPost);

// Delete an existing comment (authenticated, owner/article-owner checks)
router.delete("/:commentId", authMiddleware, deleteCommentPost);

export default router;
