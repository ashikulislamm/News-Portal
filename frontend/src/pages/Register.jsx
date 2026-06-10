import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

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

function AppleIcon() {
  return (
    <svg className="h-5 w-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.72-1.16 1.87-1.01 2.97.12.02.24.02.35.02.9 0 2.02-.62 2.61-1.43z" />
    </svg>
  );
}

export function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    password: "",
    phone: "",
    country: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Auto dismiss alert toast after 5 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        form
      );

      setAlert({
        message: response.data.message || "Registration successful! You can now sign in.",
        type: "success",
      });

      // Clear the form after successful registration
      setForm({
        fullName: "",
        email: "",
        address: "",
        password: "",
        phone: "",
        country: "",
        agree: false,
      });
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Registration failed. Please check details.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.address.trim() &&
    form.password.length >= 6 &&
    form.phone.trim() &&
    form.country.trim();

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {alert.message && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border text-left ${
                alert.type === "success"
                  ? "bg-emerald-50 border-emerald-100 shadow-emerald-500/5"
                  : "bg-rose-50 border-rose-100 shadow-rose-500/5"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === "success" ? (
                  <CheckCircleIcon className="h-5.5 w-5.5 text-emerald-600" />
                ) : (
                  <ExclamationCircleIcon className="h-5.5 w-5.5 text-rose-600" />
                )}
              </div>
              <div className="flex-grow space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {alert.type === "success" ? "Success" : "Error Occurred"}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAlert({ message: "", type: "" })}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main card panel with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/50"
      >
        {/* Left Column (Desktop Editorial Content) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-zinc-950 to-amber-950 p-12 flex-col justify-between text-white relative overflow-hidden text-left">
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
              Join the Community
            </span>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Your portal to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-400">global</span> insights.
              <br />
              Start reading today.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Create an account to customize your personal feed, bookmark articles, interact with commentators, and receive live updates.
            </p>
          </div>

          {/* Highlights Bar */}
          <div className="relative z-10 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <div>
              <span className="block text-lg font-bold text-white">100%</span>
              <span>Free Sign Up</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">Custom</span>
              <span>News Desks</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">Instant</span>
              <span>Breaking Alerts</span>
            </div>
          </div>
        </div>

        {/* Right Column (Form fields) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative text-left">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Title Header */}
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Create an Account
              </h1>
              <p className="text-sm text-slate-500">
                Join us to get the latest stories custom tailored for you.
              </p>
            </div>

            {/* Social Connect */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition duration-200 cursor-pointer shadow-sm"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition duration-200 cursor-pointer shadow-sm"
              >
                <AppleIcon />
                <span>Apple</span>
              </button>
            </div>

            {/* Form Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={submit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="address" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Street Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <MapPinIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Editorial St, NY"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                </div>
              </div>

              {/* Country and Phone side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Country */}
                <div className="space-y-1">
                  <label htmlFor="country" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Country
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <GlobeAltIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="United States"
                      required
                      value={form.country}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <PhoneIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1XXXXXXXXXX"
                      required
                      pattern="^[+]?[\d\s\(\)\-]{6,}$"
                      value={form.phone}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Password (Min 6 chars)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                />
                <label htmlFor="agree" className="ml-2 block text-xs font-semibold text-slate-600 cursor-pointer select-none leading-normal">
                  I agree to the <a href="#" className="font-bold underline">Terms</a> and <a href="#" className="font-bold underline">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className="relative w-full overflow-hidden rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Redirect Footer */}
            <p className="text-center text-sm text-slate-500 pt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[var(--color-accent)] hover:text-amber-700 transition underline decoration-2 underline-offset-4"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
