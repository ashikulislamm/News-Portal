// Navbar.jsx
import { useState, useEffect } from "react";
import logo from "../assets/logo.png"; // Assuming you have a logo file
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { useContext } from "react";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Latest News", href: "/news" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-1 z-50 bg-[var(--color-background)] text-[var(--color-text)] rounded-lg shadow-lg">
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
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.href; // check if current route matches

                return (
                  <li key={i}>
                    <Link
                      to={item.href}
                      className={`px-2 py-1 rounded-md text-sm hover:text-white hover:bg-[var(--color-accent)]/80 transition
                ${
                  isActive
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text)]"
                }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="relative">
              {!user ? (
                // Show Sign In / Get Started if no user
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
              ) : (
                // Show Dropdown with user's full name
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    {user.fullName}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
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
          <div className="relative px-15 py-5">
            {!user ? (
              // Show Sign In / Get Started if no user
              <div className="flex flex-col gap-5">
                <Link
                  to="/login"
                  className="border border-[var(--color-accent)] text-sm text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition duration-250 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="items-center rounded-full bg-[var(--color-accent)] text-white text-sm font-medium px-3 py-1.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              // Show Dropdown with user's full name
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {user.fullName}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-red-500 rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--color-accent)]/60"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
