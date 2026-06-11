import * as newsService from "../services/newsService.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Controller to handle news articles
 */
export const createNewsPost = asyncHandler(async (req, res) => {
  const news = await newsService.createNews(req.body, req.user.id, req.files);
  res.status(201).json({ message: "News posted successfully!", news });
});

export const getNewsPosts = asyncHandler(async (req, res) => {
  const result = await newsService.getNewsList(req.query);
  res.status(200).json(result);
});

export const getNewsPost = asyncHandler(async (req, res) => {
  const post = await newsService.getNewsByIdOrSlug(req.params.idOrSlug);
  res.status(200).json(post);
});

export const updateNewsPost = asyncHandler(async (req, res) => {
  const news = await newsService.updateNews(req.params.id, req.user.id, req.body, req.files);
  res.status(200).json({
    message: "Post updated successfully",
    news,
  });
});

export const deleteNewsPost = asyncHandler(async (req, res) => {
  await newsService.deleteNews(req.params.id, req.user.id);
  res.status(200).json({
    message: "News post and associated comments deleted successfully",
  });
});

export const toggleNewsLike = asyncHandler(async (req, res) => {
  const result = await newsService.toggleLike(req.params.id, req.user.id);
  res.status(200).json({
    message: result.hasLiked ? "Like removed successfully" : "Like added successfully",
    likesCount: result.likesCount,
    likes: result.likes,
  });
});
