import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewsTicker({ posts = [] }) {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) return null;

  // Render items twice for infinite loop continuity in CSS marquee
  const tickerItems = [...posts, ...posts];

  return (
    <div className="w-full bg-[#1e1e1e] border-b border-slate-800 py-3 overflow-hidden select-none shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <span className="bg-[#b91c1c] text-[#faf9f6] text-[10px] font-black tracking-widest px-3 py-1 rounded-sm uppercase shrink-0 select-none shadow-md">
          BREAKING
        </span>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-xs text-slate-300 font-semibold">
            {tickerItems.map((post, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/news/${post.slug || post._id}`)}
                className="hover:text-[#b91c1c] cursor-pointer transition-colors duration-150 text-left font-medium max-w-md truncate focus-indicator"
              >
                ✦ {post.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
