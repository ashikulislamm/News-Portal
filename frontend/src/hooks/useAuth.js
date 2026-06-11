import { useAuthStore } from "../store/authStore";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const isAuthenticated = !!token && !!user;
  const currentUserId = user?.id || user?._id || null;

  return {
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated,
    currentUserId,
  };
}
