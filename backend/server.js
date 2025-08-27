import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "../frontend/build");
// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(buildPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
