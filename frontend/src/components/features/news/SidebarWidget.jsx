import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, CheckIcon } from "@heroicons/react/24/outline";

// ─── 1. NEWSLETTER SIGNUP WIDGET ──────────────────────────────────────────────
export function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 6000);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-[#faf9f6] p-6 rounded-2xl shadow-md space-y-4">
      <div className="flex items-center gap-2">
        <EnvelopeIcon className="w-5 h-5 text-[#d97706]" />
        <h4 className="text-xs font-black uppercase tracking-widest text-[#faf9f6]">
          NEWSLETTER SIGNUP
        </h4>
      </div>
      <p className="text-slate-400 text-[11px] leading-relaxed">
        Get premium editorial briefs and headlines delivered directly to your email inbox daily.
      </p>

      {subscribed ? (
        <div className="bg-slate-800 text-[#faf9f6] p-3 rounded-lg flex items-center gap-2 text-xs font-semibold">
          <CheckIcon className="w-4 h-4 text-[#d97706]" />
          <span>Thank you! Check your inbox.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            required
            placeholder="Enter email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-xs bg-slate-800 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#b91c1c]"
          />
          <button
            type="submit"
            className="w-full text-center bg-[#b91c1c] hover:bg-[#d97706] text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest transition duration-150 cursor-pointer"
          >
            SUBSCRIBE NOW
          </button>
        </form>
      )}
    </div>
  );
}

// ─── 2. TRENDING WIDGET ──────────────────────────────────────────────────────
export function TrendingWidget({ posts = [] }) {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      <div className="border-b border-slate-200 pb-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">
          TRENDING STORIES
        </h4>
      </div>
      <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        {posts.map((post, index) => (
          <div
            key={post._id}
            onClick={() => navigate(`/news/${post.slug || post._id}`)}
            className="p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 transition duration-150"
          >
            <span className="text-lg font-serif font-black text-slate-200 w-5 text-right shrink-0 select-none">
              {index + 1}
            </span>
            <div className="min-w-0">
              <span className="text-[8px] font-black uppercase tracking-wider text-[#b91c1c] block mb-0.5">
                {post.category}
              </span>
              <h5 className="text-xs font-black text-[#0a0a0a] leading-snug line-clamp-2 hover:text-[#b91c1c] transition-colors">
                {post.title}
              </h5>
              <span className="text-[9px] text-slate-400 mt-1 block">
                {post.viewCount || 0} READS
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 3. AD PROMO WIDGET ──────────────────────────────────────────────────────
export function AdPromoWidget() {
  return (
    <div className="relative bg-[#b91c1c] text-[#faf9f6] p-6 rounded-2xl overflow-hidden shadow-md group text-left">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition duration-300" />
      <span className="bg-white/20 text-[#faf9f6] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3 select-none">
        ADVERTISEMENT
      </span>
      <h4 className="text-lg font-serif font-black tracking-tight leading-tight text-white mb-2">
        Subscribe Premium News Portal Edition
      </h4>
      <p className="text-white/80 text-[10px] leading-relaxed mb-4">
        Unlock exclusive coverage, in-depth reports, data analytics, and 100% ad-free experience.
      </p>
      <a
        href="#pricing"
        className="inline-block text-[#faf9f6] bg-[#1e1e1e] hover:bg-white hover:text-[#b91c1c] text-[10px] font-black px-4 py-2 rounded-xl transition duration-150 shadow-sm"
      >
        UPGRADE NOW AT 50% OFF
      </a>
    </div>
  );
}

// ─── 4. EDITORS' CHOICE WIDGET ────────────────────────────────────────────────
export function EditorsPicksWidget({ posts = [] }) {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      <div className="border-b border-slate-200 pb-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">
          EDITORS' SELECTIONS
        </h4>
      </div>
      <div className="space-y-3">
        {posts.map((post) => {
          const imageUrl = post.imageUrl
            ? `${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`
            : null;

          return (
            <div
              key={post._id}
              onClick={() => navigate(`/news/${post.slug || post._id}`)}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition duration-150"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl select-none">
                    📰
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-black text-[#0a0a0a] leading-tight line-clamp-2 hover:text-[#b91c1c] transition-colors">
                  {post.title}
                </h5>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
