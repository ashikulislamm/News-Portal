// src/pages/ContactPage.jsx
import { useState } from "react";

export function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    message: "",
    agree: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend
    console.log("contact form:", form);
    alert("Message sent (demo). Hook this up to your API!");
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT — form card */}
          <div className="rounded-2xl bg-[var(--color-background)] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6">
              Contact us
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={onChange}
                  className="w-full rounded-md border border-[var(--color-accent)] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={onChange}
                  className="w-full rounded-md border border-[var(--color-accent)] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
                />
              </div>

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={onChange}
                className="w-full rounded-md border border-[var(--color-accent)] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />

              <textarea
                name="message"
                rows={5}
                placeholder="Message"
                value={form.message}
                onChange={onChange}
                className="w-full rounded-md border border-[var(--color-accent)] bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />

              <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-1 h-4 w-4 rounded border-[var(--color-accent)] text-black"
                />
                <span className="text-black">
                  You agree to our{" "}
                  <a href="#" className="font-semibold underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white"
                disabled={!form.firstName || !form.message || !form.agree}
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* RIGHT — info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-semibold text-[var(--color-accent)]">
              Get in Touch
            </h3>
            <p className="mt-3 text-[var(--color-text-secondary)] text-center">
              You need more information? Check what other persons are saying
              about our product. They are very happy with their purchase.
            </p>

            <ul className="mt-8 space-y-5 text-[var(--color-accent)]">
              <li className="flex items-center gap-3">
                <PhoneIcon />
                <span className="text-[var(--color-accent)]">
                  +1(424) 535 3523
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon />
                <span className="text-[var(--color-accent)]">
                  hello@mail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <TicketIcon />
                <a href="#" className="font-semibold underline">
                  Open Support Ticket
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* tiny inline icons (no external deps) */
function PhoneIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-700 dark:text-slate-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h1.6a2 2 0 011.9 1.37l.7 2.09a2 2 0 01-.45 2.04l-1 1a15.9 15.9 0 006.36 6.36l1-1a2 2 0 012.04-.45l2.09.7A2 2 0 0121 18.4V20a2 2 0 01-2 2h-.5C9.6 22 2 14.4 2 5.5V5z"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-700 dark:text-slate-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-700 dark:text-slate-300"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2 2 2 0 000 4 2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2 2 2 0 000-4 2 2 0 01-2-2V6z" />
    </svg>
  );
}
