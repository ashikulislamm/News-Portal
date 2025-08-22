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
// Fetch news posted by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await News.find({ "author.userId": req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// DELETE /api/news/:id
router.delete("/:id", async (req, res) => {
  try {
    const newsPost = await News.findByIdAndDelete(req.params.id);

    if (!newsPost) {
      return res.status(404).json({ message: "News post not found" });
    }

    res.status(200).json({ message: "News post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/news/:id - Update the news post
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (news.author.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the post with new data
    news.title = title || news.title;
    news.content = content || news.content;

    const updatedNews = await news.save();

    res.status(200).json({
      message: "Post updated successfully",
      news: updatedNews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET single news post by ID with populated author
router.get("/:id", async (req, res) => {
  try {
    const post = await News.findById(req.params.id).populate("author.userId", "fullName email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({
      ...post._doc,
      authorName: post.author?.fullName || post.author?.userId?.fullName || "Unknown Author",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
});
export default router;
