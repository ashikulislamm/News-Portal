import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import Comment from "../models/CommentModel.js";
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
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

// Multer fields configuration for multi-file upload
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// Helper: Generate a unique slug
const generateUniqueSlug = async (title, currentNewsId = null) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const query = { slug: uniqueSlug };
    if (currentNewsId) {
      query._id = { $ne: currentNewsId };
    }
    const existingNews = await News.findOne(query);
    if (!existingNews) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

// Helper: Calculate reading time in minutes (approx. 200 words per minute)
const calculateReadingTime = (content) => {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

// POST /api/news - Create a new news post
router.post("/", authMiddleware, uploadFields, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      slug,
      category,
      tags,
      keywords,
      videoUrl,
      isFeatured,
      readMoreUrl,
      language,
      location,
    } = req.body;

    // Validation
    if (!title || !description || !content || !category) {
      return res.status(400).json({ message: "Title, description, content, and category are required" });
    }

    const validCategories = ["Politics", "Sports", "Technology", "Business", "Entertainment", "Health", "Education"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(", ")}` });
    }

    // Process files
    const files = req.files || {};
    const imageUrl = files.image ? `/uploads/${files.image[0].filename}` : null;
    const thumbnailImage = files.thumbnail ? `/uploads/${files.thumbnail[0].filename}` : null;
    const images = files.gallery ? files.gallery.map((file) => `/uploads/${file.filename}`) : [];

    // Auto-generate slug if not explicitly provided
    const finalSlug = slug ? await generateUniqueSlug(slug) : await generateUniqueSlug(title);

    // Parse array fields if they are sent as strings
    const parseArray = (field) => {
      if (!field) return [];
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          return field.split(",").map((item) => item.trim());
        }
      }
      return field;
    };

    const parsedTags = parseArray(tags);
    const parsedKeywords = parseArray(keywords);

    // Fetch author details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Author user not found" });
    }

    const readingTime = calculateReadingTime(content);

    const news = new News({
      title,
      description,
      content,
      slug: finalSlug,
      imageUrl,
      thumbnailImage,
      images,
      videoUrl,
      category,
      tags: parsedTags,
      keywords: parsedKeywords,
      author: {
        userId: req.user.id,
        name: user.fullName,
      },
      publishedAt: new Date(),
      isFeatured: isFeatured === "true" || isFeatured === true,
      readingTime,
      readMoreUrl,
      language: language || "en",
      location,
    });

    await news.save();
    res.status(201).json({ message: "News posted successfully!", news });
  } catch (err) {
    console.error("Error creating news post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/news - Get all news (with filtering, search, pagination, and sorting)
router.get("/", async (req, res) => {
  try {
    const { category, tag, keyword, isFeatured, search, authorId, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filters
    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (keyword) {
      query.keywords = keyword;
    }
    if (isFeatured) {
      query.isFeatured = isFeatured === "true";
    }
    if (authorId) {
      query["author.userId"] = authorId;
    }

    // Search query on title, description, content, or tags
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      if (sort === "views") {
        sortOption = { viewCount: -1 };
      } else if (sort === "likes") {
        // Fallback to sort by viewCount/createdAt since likes size sorting needs aggregates
        sortOption = { viewCount: -1 }; 
      } else {
        sortOption = { [sort]: -1 };
      }
    }

    const news = await News.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate("author.userId", "fullName email");

    const total = await News.countDocuments(query);

    res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: news.map((item) => ({
        ...item._doc,
        authorName: item.author.name || item.author.userId?.fullName || "Unknown",
      })),
    });
  } catch (err) {
    console.error("Error fetching news list:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/news/:idOrSlug - Get single news post by ID or Slug (increments view count)
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let query = {};

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug };
    }

    // Atomically increment viewCount and populate user details
    const post = await News.findOneAndUpdate(
      query,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("author.userId", "fullName email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      ...post._doc,
      authorName: post.author?.name || post.author?.userId?.fullName || "Unknown Author",
    });
  } catch (err) {
    console.error("Error fetching news details:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

// PUT /api/news/:id - Update an existing news post (author only)
router.put("/:id", authMiddleware, uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check authorization: only the author of the post can update it
    if (news.author.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      content,
      category,
      tags,
      keywords,
      videoUrl,
      isFeatured,
      readMoreUrl,
      language,
      location,
    } = req.body;

    // Update textual fields if provided
    if (title) {
      news.title = title;
      // Re-generate slug on title change
      news.slug = await generateUniqueSlug(title, id);
    }
    if (description) news.description = description;
    if (content) {
      news.content = content;
      news.readingTime = calculateReadingTime(content);
    }
    if (category) {
      const validCategories = ["Politics", "Sports", "Technology", "Business", "Entertainment", "Health", "Education"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(", ")}` });
      }
      news.category = category;
    }

    // Parse array fields if provided
    const parseArray = (field) => {
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          return field.split(",").map((item) => item.trim());
        }
      }
      return field;
    };

    if (tags) news.tags = parseArray(tags);
    if (keywords) news.keywords = parseArray(keywords);
    if (videoUrl !== undefined) news.videoUrl = videoUrl;
    if (isFeatured !== undefined) news.isFeatured = isFeatured === "true" || isFeatured === true;
    if (readMoreUrl !== undefined) news.readMoreUrl = readMoreUrl;
    if (language) news.language = language;
    if (location !== undefined) news.location = location;

    // Process file updates
    const files = req.files || {};
    if (files.image) news.imageUrl = `/uploads/${files.image[0].filename}`;
    if (files.thumbnail) news.thumbnailImage = `/uploads/${files.thumbnail[0].filename}`;
    if (files.gallery) news.images = files.gallery.map((file) => `/uploads/${file.filename}`);

    const updatedNews = await news.save();

    res.status(200).json({
      message: "Post updated successfully",
      news: updatedNews,
    });
  } catch (err) {
    console.error("Error updating news post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/news/:id - Delete a news post & cascade delete comments (author only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const newsPost = await News.findById(id);

    if (!newsPost) {
      return res.status(404).json({ message: "News post not found" });
    }

    // Check authorization: only the author can delete
    if (newsPost.author.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await News.findByIdAndDelete(id);

    // Cascade delete: Remove all comments associated with this news post
    await Comment.deleteMany({ newsId: id });

    res.status(200).json({ message: "News post and associated comments deleted successfully" });
  } catch (err) {
    console.error("Error deleting news post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/news/:id/like - Toggle like on a news post (requires authentication)
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News post not found" });
    }

    const userId = req.user.id;
    const hasLiked = news.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      news.likes = news.likes.filter((likeId) => likeId.toString() !== userId);
    } else {
      // Like
      news.likes.push(userId);
    }

    await news.save();

    res.status(200).json({
      message: hasLiked ? "Like removed successfully" : "Like added successfully",
      likesCount: news.likes.length,
      likes: news.likes,
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
