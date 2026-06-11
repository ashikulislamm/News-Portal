import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} from "../utils/validator.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";

const router = express.Router();

// Register a new user with validation and rate limiting
router.post("/register", authLimiter, validateRegister, registerUser);

// Login user with validation and rate limiting
router.post("/login", authLimiter, validateLogin, loginUser);

// Get authenticated user profile
router.get("/profile", authMiddleware, getUserProfile);

// Update user profile with validation
router.put("/profile", authMiddleware, validateProfileUpdate, updateUserProfile);

export default router;
