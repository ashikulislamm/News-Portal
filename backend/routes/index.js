import express from "express";
import authRoutes from "./authRoutes.js";
import newsRoutes from "./newsRoutes.js";
import commentRoutes from "./commentRoutes.js";

const router = express.Router();

// Register aggregated route groups
router.use("/auth", authRoutes);
router.use("/news", newsRoutes);
router.use("/comments", commentRoutes);

export default router;
