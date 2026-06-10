import { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    message: "",
    agree: false,
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

  // Auto dismiss alert toast after 5 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("contact form:", form);
    
    setAlert({
      message: "Your story tip or inquiry has been received. Our news desk will review it shortly.",
      type: "success",
    });

    // Clear the form
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      message: "",
      agree: false,
    });
  };

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

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col lg:flex-row w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/50"
      >
        {/* Left Column: Contact Form */}
        <div className="w-full lg:w-3/5 p-8 sm:p-12 flex flex-col justify-center bg-white relative text-left">
          <div className="w-full max-w-md mx-auto space-y-7">
            {/* Title Header */}
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Contact Us
              </h1>
              <p className="text-sm text-slate-500">
                Send us a message or submit a story tip. We will get back to you shortly.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* First Name & Last Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      value={form.firstName}
                      onChange={onChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Last Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      required
                      value={form.lastName}
                      onChange={onChange}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
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
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={onChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Message Details
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3.5 pt-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Enter your story details or inquiries here..."
                    required
                    value={form.message}
                    onChange={onChange}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200 resize-none"
                  />
                </div>
              </div>

              {/* T&C Checkbox */}
              <div className="flex items-start">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                />
                <label htmlFor="agree" className="ml-2 block text-xs font-semibold text-slate-600 cursor-pointer select-none leading-normal">
                  You agree to our <a href="#" className="font-bold underline text-slate-700 hover:text-[var(--color-accent)] transition">Privacy Policy</a>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!form.firstName || !form.message || !form.agree}
                className="relative w-full overflow-hidden rounded-xl bg-[var(--color-accent)] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group mt-2"
              >
                <span>Send Message Tip</span>
                <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Editorial Contact Details */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-zinc-950 to-amber-950 p-12 flex-col justify-between text-white relative overflow-hidden text-left">
          {/* Decorative Glow Elements */}
          <div className="absolute top-[-20%] right-[-20%] w-72 h-72 bg-[var(--color-accent)] opacity-15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-20%] w-72 h-72 bg-amber-500 opacity-10 rounded-full blur-3xl" />

          {/* Directory Content */}
          <div className="relative z-10 space-y-6 my-auto">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-[var(--color-accent)] ring-1 ring-inset ring-amber-500/20">
              Newsroom Hotline
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-amber-400">Touch</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Have an anonymous tip, editorial inquiry, or community feedback? Reach out directly to our reporters and publishers.
            </p>

            <ul className="space-y-5 pt-4">
              <li className="flex items-center gap-3.5 group">
                <div className="p-2.5 bg-white/5 text-[var(--color-accent)] rounded-lg group-hover:bg-amber-500/20 group-hover:scale-105 transition duration-200">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Newsroom Call</p>
                  <span className="text-sm font-bold text-slate-200">+1 (424) 535 3523</span>
                </div>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2.5 bg-white/5 text-[var(--color-accent)] rounded-lg group-hover:bg-amber-500/20 group-hover:scale-105 transition duration-200">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Editorial Inquiries</p>
                  <span className="text-sm font-bold text-slate-200">hello@newsportal.com</span>
                </div>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2.5 bg-white/5 text-[var(--color-accent)] rounded-lg group-hover:bg-amber-500/20 group-hover:scale-105 transition duration-200">
                  <LifebuoyIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Technical Helpdesk</p>
                  <a href="#" className="text-sm font-bold text-[var(--color-accent)] hover:text-amber-450 underline decoration-2 underline-offset-4 transition">
                    Open Support Ticket
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
            Tip Desk Encrypted
          </div>
        </div>
      </motion.div>
    </section>
  );
}
