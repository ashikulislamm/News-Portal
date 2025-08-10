// Navbar.jsx
import { useState } from "react";
import logo from "../assets/logo.png"; // Assuming you have a logo file
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Latest News", href: "/news" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-5 z-50 bg-[var(--color-background)] text-[var(--color-text)] rounded-lg shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: brand */}

          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="News Portal Logo" className="h-6 w-6" />
            <span className="font-semibold tracking-tight">News Portal</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.href}
                    className={`px-2 py-1 rounded-md text-sm hover:text-white hover:bg-[var(--color-accent)]/80 transition
                    ${
                      item.label === "Home"
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="border border-[var(--color-accent)] text-sm text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition duration-250 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-[var(--color-accent)] text-white text-sm font-medium px-3 py-1.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-zinc-800/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg
              className={`h-6 w-6 ${open ? "hidden" : "block"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`h-6 w-6 ${open ? "block" : "hidden"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          id="mobile-menu"
          className={`md:hidden ${open ? "block" : "hidden"}`}
        >
          <div className="space-y-1 pb-3 pt-2">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base transition
                ${
                  item.label === "Home"
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text)] hover:bg-[var(--color-accent)]/60 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="border-t border-zinc-800 py-3 flex items-center gap-3 px-3">
            <a
              href="#"
              className="flex-1 text-center rounded-full px-3 py-2 text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-gray-100"
              onClick={() => setOpen(false)}
            >
              Sign In
            </a>
            <a
              href="#"
              className="flex-1 text-center rounded-full px-3 py-2 text-sm bg-white text-black font-medium hover:opacity-90"
              onClick={() => setOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
