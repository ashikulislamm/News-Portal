import * as authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Controller to handle HTTP requests for user authentication & profiles
 */
export const registerUser = asyncHandler(async (req, res) => {
  await authService.register(req.body);
  res.status(201).json({ message: "User registered successfully" });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(result);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json({
    message: "Profile updated successfully",
    user,
  });
});
