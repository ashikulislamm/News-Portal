import apiClient from "../apiClient";

export const newsService = {
  getNews: async (params) => {
    const response = await apiClient.get("/api/news", { params });
    return response.data;
  },

  getNewsDetails: async (idOrSlug) => {
    const response = await apiClient.get(`/api/news/${idOrSlug}`);
    return response.data;
  },

  createNews: async (formData) => {
    const response = await apiClient.post("/api/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateNews: async (id, formData) => {
    const response = await apiClient.put(`/api/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await apiClient.delete(`/api/news/${id}`);
    return response.data;
  },

  toggleLikeNews: async (id) => {
    const response = await apiClient.post(`/api/news/${id}/like`);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post("/api/news/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
