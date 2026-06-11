import { useState, useEffect, useCallback } from "react";
import { commentService } from "../api/services/comments";

export default function useComments(newsId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!newsId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getCommentsByNewsId(newsId);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content) => {
    try {
      const res = await commentService.addComment(newsId, content);
      const newComment = res.comment;
      setComments((prev) => [newComment, ...prev]);
      return newComment;
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      throw err;
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const res = await commentService.updateComment(commentId, content);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, content: res.comment.content } : c
        )
      );
      return res.comment;
    } catch (err) {
      console.error("Error updating comment:", err);
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    updateComment,
    refetch: fetchComments,
  };
}
