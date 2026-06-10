import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.535 12 3.535 12 3.535s-7.52 0-9.388.52a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.465 12 20.465 12 20.465s7.52 0 9.388-.52a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 mt-12 py-12 px-4 text-left">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} className="h-7 w-7" alt="News Portal Logo" />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                News Portal
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A modern media platform bringing you the latest breaking updates, editorial deep-dives, and globally verified journalism.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-[var(--color-accent)] transition duration-200" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="#" className="hover:text-[var(--color-accent)] transition duration-200" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a href="#" className="hover:text-[var(--color-accent)] transition duration-200" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="#" className="hover:text-[var(--color-accent)] transition duration-200" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation guides */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
              <li>
                <Link to="/" className="hover:text-[var(--color-accent)] transition duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[var(--color-accent)] transition duration-150">
                  Latest News
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-accent)] transition duration-150">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--color-accent)] transition duration-150">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal guidelines */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Legal & Policy
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
              <li>
                <a href="#" className="hover:text-[var(--color-accent)] transition duration-150">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-accent)] transition duration-150">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-accent)] transition duration-150">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--color-accent)] transition duration-150">
                  Licensing Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Get the day's top news stories delivered straight to your inbox.
            </p>
            {subscribed ? (
              <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright metadata row */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} News Portal. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with
            <svg className="h-3.5 w-3.5 text-rose-500 fill-current animate-pulse" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            for readers globally.
          </p>
        </div>
      </div>
    </footer>
  );
}
