import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useAuth from "../hooks/useAuth";
import { authService } from "../api/services/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
      <g transform="matrix(1, 0, 0, 1, 0, 0)">
        <path fill="#4285F4" d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.99,2.37 -2.1,3.12l3.27,2.54c1.91,-1.76 3,-4.36 3,-7.36C21.65,12.04 21.55,11.54 21.35,11.1z" />
        <path fill="#34A853" d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.18l-3.27,-2.54c-0.9,0.6 -2.07,0.97 -3.59,0.97 -2.76,0 -5.1,-1.86 -5.93,-4.36H1.83v2.64c1.5,2.99 4.59,4.98 8.17,4.98z" />
        <path fill="#FBBC05" d="M6.07,12.49c-0.22,-0.66 -0.35,-1.37 -0.35,-2.09c0,-0.72 0.13,-1.43 0.35,-2.09V5.67H1.83c-0.78,1.56 -1.23,3.31 -1.23,5.16c0,1.85 0.45,3.6 1.23,5.16l4.24,-3.3z" />
        <path fill="#EA4335" d="M12,5.77c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.12 14.42,2.3 12,2.3c-3.58,0 -6.67,1.99 -8.17,4.98l4.24,3.3c0.83,-2.5 3.17,-4.35 5.93,-4.35z" />
      </g>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login: storeLogin, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already authenticated, redirect to profile page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login({
        email: form.email,
        password: form.password,
      });

      setToast({
        message: data.message || "Login successful",
        type: "success",
      });

      storeLogin(data.user, data.token);

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Login failed. Please check your credentials.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.email.trim() && form.password.trim();

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Toast popup */}
      <AnimatePresence>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

      {/* Main card panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/50"
      >
        {/* Left Column (Desktop Editorial Content) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-zinc-950 to-amber-950 p-12 flex-col justify-between text-white relative overflow-hidden text-left select-none">
          {/* Decorative Glow Elements */}
          <div className="absolute top-[-20%] right-[-20%] w-72 h-72 bg-[var(--color-accent)] opacity-15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-20%] w-72 h-72 bg-amber-500 opacity-10 rounded-full blur-3xl" />

          {/* Editorial Logo Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-accent)] to-amber-500 text-white shadow-lg shadow-amber-500/25">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              NEWS PORTAL
            </span>
          </div>

          {/* Branding content */}
          <div className="relative z-10 my-auto space-y-6">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-[var(--color-accent)] ring-1 ring-inset ring-amber-500/20">
              Premium Insights
            </span>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              The truth in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-400">details</span>.
              <br />
              Stories that connect us.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Access your personalized editorial feed, bookmark breaking updates, and customize your notifications workspace.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <div>
              <span className="block text-lg font-bold text-white">24/7</span>
              <span>Coverage</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">120+</span>
              <span>Global Sources</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">1M+</span>
              <span>Active Readers</span>
            </div>
          </div>
        </div>

        {/* Right Column (Form fields) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative text-left">
          <div className="w-full max-w-md mx-auto space-y-7">
            {/* Title Header */}
            <div className="space-y-1.5 select-none">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-505">
                Please enter your credentials to access your account.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 select-none">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition duration-200 cursor-pointer shadow-sm"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 transition duration-200 cursor-pointer shadow-sm"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </button>
            </div>

            {/* Form Divider */}
            <div className="relative flex items-center justify-center my-2 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Or sign in with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Email Input */}
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
                icon={EnvelopeIcon}
              />

              {/* Password Input */}
              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-[var(--color-accent)] hover:text-amber-700 transition">
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-11 text-sm text-slate-900 placeholder-slate-450 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-655 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Extras Row (Remember Me) */}
              <div className="flex items-center select-none">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4.5 w-4.5 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2.5 block text-sm font-semibold text-slate-650 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid}
                loading={loading}
                className="w-full py-3 mt-2"
              >
                Sign in to your account
              </Button>
            </form>

            {/* Form Footer */}
            <p className="text-center text-sm text-slate-500 pt-1 select-none">
              Don’t have an account yet?{" "}
              <Link
                to="/register"
                className="font-bold text-[var(--color-accent)] hover:text-amber-700 transition underline decoration-2 underline-offset-4"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
