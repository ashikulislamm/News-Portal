import { Navigate, Outlet } from "react-router-dom";

// PrivateRoute component for route protection
export const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Check if the token exists in localStorage
  return token ? <Outlet /> : <Navigate to="/login" />; // Redirect to login if not authenticated
};