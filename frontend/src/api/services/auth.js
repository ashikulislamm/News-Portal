import apiClient from "../apiClient";

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/api/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/api/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/api/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put("/api/auth/profile", profileData);
    return response.data;
  },
};
