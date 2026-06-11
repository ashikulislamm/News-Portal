import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  updateUser: (updatedUser) => {
    set((state) => {
      const mergedUser = { ...state.user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      return { user: mergedUser };
    });
  },
}));
