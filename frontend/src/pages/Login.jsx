import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate(); // Hook to navigate after successful login

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // Your API endpoint for login
        form
      );

      setAlert({
        message: response.data.message || "Login successful",
        type: "success",
      });

      setUser(response.data.user);

      // If login is successful, store the JWT token in localStorage
      localStorage.setItem("token", response.data.token); // Store JWT token
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to the user profile page
      navigate("/profile");
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Login failed",
        type: "error",
      });
    }
  };

  const isValid = form.email.trim() && form.password.trim();

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-background)] p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-accent)] bg-[var(--color-background)] px-3 py-2.5 text-[var(--color-primary)] placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative w-full">
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-[var(--color-text)]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-accent)] bg-[var(--color-background)] px-3 py-2.5 pr-10 text-[var(--color-text)] placeholder-[var(--color-primary)]/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Eye Icon inside input */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 top-6  flex items-center px-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            Sign in to your account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account yet?{" "}
          <Link
            to="/register"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Sign up here
          </Link>
        </p>

        {/* Display Popup */}
        {alert.message && (
          <div
            className={`fixed right-5 top-25 p-4 rounded-lg text-white shadow-md ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}
      </div>
    </section>
  );
}
