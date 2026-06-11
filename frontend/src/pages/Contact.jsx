import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

export function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });

  const [toast, setToast] = useState({ message: "", type: "" });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("contact form:", form);
    
    setToast({
      message: "Your story tip or inquiry has been received. Our news desk will review it shortly.",
      type: "success",
    });

    // Clear the form
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      agree: false,
    });
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

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
            <div className="space-y-1.5 select-none">
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
                <Input
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={form.firstName}
                  onChange={onChange}
                  icon={UserIcon}
                />

                {/* Last Name */}
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={form.lastName}
                  onChange={onChange}
                  icon={UserIcon}
                />
              </div>

              {/* Email */}
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={onChange}
                icon={EnvelopeIcon}
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={onChange}
                icon={PhoneIcon}
              />

              {/* Message Textarea */}
              <Input
                label="Message Details"
                id="message"
                name="message"
                textarea
                rows={5}
                placeholder="Enter your story details or inquiries here..."
                required
                value={form.message}
                onChange={onChange}
                icon={ChatBubbleLeftRightIcon}
              />

              {/* T&C Checkbox */}
              <div className="flex items-start select-none">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                />
                <label htmlFor="agree" className="ml-2.5 block text-xs font-semibold text-slate-600 cursor-pointer select-none leading-normal">
                  You agree to our <a href="#" className="font-bold underline text-slate-700 hover:text-[var(--color-accent)] transition">Privacy Policy</a>.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!form.firstName || !form.email || !form.message || !form.agree}
                className="w-full py-3.5 mt-2"
              >
                Send Message Tip
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Editorial Contact Details */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-zinc-950 to-amber-950 p-12 flex-col justify-between text-white relative overflow-hidden text-left select-none">
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
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Newsroom Call</p>
                  <span className="text-sm font-bold text-slate-200">+1 (424) 535 3523</span>
                </div>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2.5 bg-white/5 text-[var(--color-accent)] rounded-lg group-hover:bg-amber-500/20 group-hover:scale-105 transition duration-200">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Editorial Inquiries</p>
                  <span className="text-sm font-bold text-slate-200">hello@newsportal.com</span>
                </div>
              </li>
              <li className="flex items-center gap-3.5 group">
                <div className="p-2.5 bg-white/5 text-[var(--color-accent)] rounded-lg group-hover:bg-amber-500/20 group-hover:scale-105 transition duration-200">
                  <LifebuoyIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Technical Helpdesk</p>
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
