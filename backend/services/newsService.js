import mongoose from "mongoose";
import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import Comment from "../models/CommentModel.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/appError.js";

// Helper: Calculate reading time in minutes (approx. 200 words per minute)
const calculateReadingTime = (content) => {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

// Helper: Parse array fields if they are sent as strings
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

/**
 * Service to handle News logic
 */
export const createNews = async (newsData, userId, files = {}) => {
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
  } = newsData;

  // Verify author user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("Author user not found");
  }

  // Process uploaded files
  const imageUrl = files.image ? `/uploads/${files.image[0].filename}` : null;
  const thumbnailImage = files.thumbnail ? `/uploads/${files.thumbnail[0].filename}` : null;
  const images = files.gallery ? files.gallery.map((file) => `/uploads/${file.filename}`) : [];

  // Auto-generate unique slug
  const finalSlug = (slug && slug !== "undefined") ? await generateUniqueSlug(slug) : await generateUniqueSlug(title);
  
  const parsedTags = parseArray(tags);
  const parsedKeywords = parseArray(keywords);
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
      userId,
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
  return news;
};

export const getNewsList = async (params) => {
  const { category, tag, keyword, isFeatured, search, authorId, sort, page = 1, limit = 10 } = params;

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

  // Full text/regex search
  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort) {
    if (sort === "views") {
      sortOption = { viewCount: -1 };
    } else if (sort === "likes") {
      sortOption = { viewCount: -1 }; // Fallback to sort by views/created as in original code
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

  return {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: news.map((item) => ({
      ...item._doc,
      authorName: item.author.name || item.author.userId?.fullName || "Unknown",
    })),
  };
};

export const getNewsByIdOrSlug = async (idOrSlug) => {
  let query = {};
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    query = { _id: idOrSlug };
  } else {
    query = { slug: idOrSlug };
  }

  // Atomically increment views and populate author details
  const post = await News.findOneAndUpdate(
    query,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate("author.userId", "fullName email");

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  return {
    ...post._doc,
    authorName: post.author?.name || post.author?.userId?.fullName || "Unknown Author",
  };
};

export const updateNews = async (newsId, userId, updateData, files = {}) => {
  const news = await News.findById(newsId);
  if (!news) {
    throw new NotFoundError("Post not found");
  }

  // Check authorization
  if (news.author.userId.toString() !== userId) {
    throw new ForbiddenError("Unauthorized");
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
  } = updateData;

  // Handle slug regeneration on title change
  if (title) {
    news.title = title;
    news.slug = await generateUniqueSlug(title, newsId);
  }
  if (description) {
    news.description = description;
  }
  if (content) {
    news.content = content;
    news.readingTime = calculateReadingTime(content);
  }
  if (category) {
    news.category = category;
  }

  // Arrays parsing
  if (tags !== undefined) news.tags = parseArray(tags);
  if (keywords !== undefined) news.keywords = parseArray(keywords);
  if (videoUrl !== undefined) news.videoUrl = videoUrl;
  if (isFeatured !== undefined) news.isFeatured = isFeatured === "true" || isFeatured === true;
  if (readMoreUrl !== undefined) news.readMoreUrl = readMoreUrl;
  if (language !== undefined) news.language = language;
  if (location !== undefined) news.location = location;

  // File uploads updates
  if (files.image) news.imageUrl = `/uploads/${files.image[0].filename}`;
  if (files.thumbnail) news.thumbnailImage = `/uploads/${files.thumbnail[0].filename}`;
  if (files.gallery) news.images = files.gallery.map((file) => `/uploads/${file.filename}`);

  await news.save();
  return news;
};

export const deleteNews = async (newsId, userId) => {
  const newsPost = await News.findById(newsId);
  if (!newsPost) {
    throw new NotFoundError("News post not found");
  }

  // Check authorization
  if (newsPost.author.userId.toString() !== userId) {
    throw new ForbiddenError("Unauthorized");
  }

  await News.findByIdAndDelete(newsId);

  // Cascade delete Comments associated
  await Comment.deleteMany({ newsId });

  return true;
};

export const toggleLike = async (newsId, userId) => {
  const news = await News.findById(newsId);
  if (!news) {
    throw new NotFoundError("News post not found");
  }

  const hasLiked = news.likes.includes(userId);
  if (hasLiked) {
    news.likes = news.likes.filter((likeId) => likeId.toString() !== userId);
  } else {
    news.likes.push(userId);
  }

  await news.save();

  return {
    hasLiked,
    likesCount: news.likes.length,
    likes: news.likes,
  };
};
