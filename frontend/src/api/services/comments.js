import apiClient from "../apiClient";

export const commentService = {
  getCommentsByNewsId: async (newsId) => {
    const response = await apiClient.get(`/api/comments/news/${newsId}`);
    return response.data;
  },

  addComment: async (newsId, content) => {
    const response = await apiClient.post(`/api/comments/news/${newsId}`, { content });
    return response.data;
  },

  updateComment: async (commentId, content) => {
    const response = await apiClient.put(`/api/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/api/comments/${commentId}`);
    return response.data;
  },
};
