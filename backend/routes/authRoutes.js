import express from "express";
import { registerUser , loginUser } from "../controllers/AuthController.js";
import User from "../models/UserModel.js";
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router();

// Registration Route
router.post("/register", registerUser);
// Login Route
router.post("/login", loginUser);
// Get User Info
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware should attach user info
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update User Info
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Destructure fields from request body
    const { fullName, email, phone, country, address, bio } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (address) user.address = address;
    if (bio) user.bio = bio;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
