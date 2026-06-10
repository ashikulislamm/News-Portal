// Navbar.jsx
import { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
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
    setDropdownOpen(false);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Latest News", href: "/news" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-4 z-50 bg-white/75 backdrop-blur-md border border-slate-100 rounded-2xl shadow-lg shadow-slate-100/50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-accent)] to-amber-500 text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="News Portal Logo" className="h-5.5 w-5.5 object-contain" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 group-hover:text-[var(--color-accent)] transition-colors duration-200">
              News Portal
            </span>
          </Link>

          {/* Center: Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5">
            <ul className="flex items-center gap-1">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.href;

                return (
                  <li key={i}>
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                        ${
                          isActive
                            ? "bg-amber-500/10 text-[var(--color-accent)]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Authentication Actions & Dropdowns */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[var(--color-accent)] transition duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-[var(--color-accent)] text-white text-sm font-bold px-4 py-2 hover:opacity-90 active:scale-[0.98] shadow-md shadow-amber-600/15 transition duration-150"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition duration-200 focus:outline-none cursor-pointer"
                >
                  <UserIcon className="h-4.5 w-4.5 text-slate-400" />
                  <span>{user.fullName}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-left">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="h-4.5 w-4.5 text-slate-400" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50/50 transition cursor-pointer border-t border-slate-50"
                    >
                      <svg className="h-4.5 w-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none transition cursor-pointer"
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
        </div>

        {/* Mobile Dropdown Drawer */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-[500px] border-t border-slate-100 py-3" : "max-h-0"
          }`}
        >
          <div className="space-y-1">
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={i}
                  to={item.href}
                  className={`block px-4 py-2.5 rounded-xl text-base font-bold transition text-left
                    ${
                      isActive
                        ? "bg-amber-500/10 text-[var(--color-accent)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--color-accent)] hover:opacity-90 transition"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-4 py-2 text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
                  onClick={() => {
                    setOpen(false);
                    setDropdownOpen(false);
                  }}
                >
                  <UserIcon className="h-5 w-5 text-slate-400" />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50/50 transition cursor-pointer text-left"
                >
                  <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
