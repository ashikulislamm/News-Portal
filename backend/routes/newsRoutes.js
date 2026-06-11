import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { handleUploadFields } from "../middlewares/upload.js";
import { validateNewsCreate, validateNewsUpdate } from "../utils/validator.js";
import {
  createNewsPost,
  getNewsPosts,
  getNewsPost,
  updateNewsPost,
  deleteNewsPost,
  toggleNewsLike,
} from "../controllers/newsController.js";

const router = express.Router();

// Get list of news posts (public)
router.get("/", getNewsPosts);

// Get a single news post by ID or Slug (public)
router.get("/:idOrSlug", getNewsPost);

// Create a new news article (authenticated, multi-file upload, validation)
router.post("/", authMiddleware, handleUploadFields, validateNewsCreate, createNewsPost);

// Update an existing news article (authenticated, owner checks, multi-file upload, validation)
router.put("/:id", authMiddleware, handleUploadFields, validateNewsUpdate, updateNewsPost);

// Delete an article and its associated comments (authenticated, owner checks)
router.delete("/:id", authMiddleware, deleteNewsPost);

// Toggle like state on a news post (authenticated)
router.post("/:id/like", authMiddleware, toggleNewsLike);

export default router;
