import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

// POST /api/news
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const news = new News({
      title,
      content,
      imageUrl,
      author: {
        userId: req.user.id,
        //name: req.user.fullName,
      },
    });
    await news.save();

    res.status(201).json({ message: "News posted successfully!", news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .populate("author.userId", "fullName"); // <-- populate with user's fullName
    res.status(200).json(
      news.map((item) => ({
        _id: item._id,
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt,
        authorName: item.author.userId?.fullName || "Unknown", // map populated name
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
