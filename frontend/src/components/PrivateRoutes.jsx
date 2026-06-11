import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// PrivateRoute component for route protection
export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};