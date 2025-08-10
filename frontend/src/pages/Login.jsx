import { useState } from "react";
import { Link } from "react-router-dom";

export function LoginForm({
  onSubmit = (data) => console.log("login", data),
  onGoogle = () => console.log("google"),
  onApple = () => console.log("apple"),
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-background)] p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Welcome Back
        </h1>

        {/* Social sign in */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onGoogle}
            className="font-bold inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
          >
            {/* Google icon */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.8 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c6.9 0 9.2-4.8 9.2-7.2 0-.5 0-.9-.1-1.3H12z"
              />
              <path
                fill="#34A853"
                d="M3.8 7.6l3.2 2.3C7.9 8 9.8 6.6 12 6.6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.8 3 14.6 2 12 2 8.4 2 5.3 4 3.8 7.6z"
              />
              <path
                fill="#FBBC05"
                d="M12 20.4c2.7 0 4.9-.9 6.5-2.5l-3-2.5c-.8.5-1.9.9-3.5.9-2.8 0-5.2-1.9-6-4.5l-3.2 2.5C4.3 17.9 7.8 20.4 12 20.4z"
              />
              <path
                fill="#4285F4"
                d="M21.2 13.2c0-.5 0-.9-.1-1.3H12v3.9h5.5c-.3 1.6-1.7 3.8-5.5 3.8v0c4.1 0 7.2-2.8 7.2-6.4z"
              />
            </svg>
            Log in with Google
          </button>

          <button
            type="button"
            onClick={onApple}
            className="font-bold inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/40 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
          >
            {/* Apple icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.365 1.43c0 1.14-.455 2.22-1.214 3.01-.78.81-2.08 1.44-3.215 1.33-.14-1.06.42-2.19 1.17-2.95.85-.86 2.26-1.51 3.259-1.39zM20.06 17.07c-.62 1.41-1.37 2.81-2.46 3.93-.82.85-1.87 1.81-3.17 1.83-1.25.02-1.57-.84-3.27-.84-1.71 0-2.07.82-3.31.86-1.31.03-2.31-1.11-3.14-1.96-1.71-1.77-3.02-4.53-3.06-7.31-.03-1.48.29-2.94 1.05-4.19.94-1.59 2.46-2.6 4.2-2.64 1.31-.03 2.54.89 3.27.89.73 0 2.26-1.1 3.82-.94.65.03 2.49.26 3.66 2.01-3.21 1.74-2.7 6.3.55 7.25z" />
            </svg>
            Log in with Apple
          </button>
        </div>

        {/* divider */}
        <div className="relative my-6">
          <div className="border-t border-slate-700/50" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-background)] px-3 text-xs text-[var(--color-text)]">
            or
          </span>
        </div>

        {/* form */}
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

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-[var(--color-text)]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-accent)] bg-[var(--color-background)] px-3 py-2.5 text-[var(--color-text)] placeholder-[var(--color-primary)]/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-600/50 bg-slate-900/40 text-indigo-500 focus:ring-indigo-500"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
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
      </div>
    </section>
  );
}
