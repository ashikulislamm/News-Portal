import React from "react";
import { useNavigate } from "react-router-dom";
import { ShareIcon, ClockIcon, EyeIcon, BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon, StarIcon } from "@heroicons/react/24/solid";
import { getCatColor, formatDate } from "../../../utils/formatters";

// ─── Category Badge Component ────────────────────────────────────────────────
export function CategoryBadge({ category }) {
  const c = getCatColor(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0"
      style={{
        background: c.bg,
        color: c.text,
        borderColor: `${c.dot}18`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
        style={{ background: c.dot }}
      />
      {category}
    </span>
  );
}

// ─── Main News Card Component ────────────────────────────────────────────────
export default function NewsCard({
  post,
  variant = "grid",
  index = 0,
  isBookmarked = false,
  onToggleBookmark,
  onShare,
}) {
  const navigate = useNavigate();

  if (!post) return null;

  const handleCardClick = () => {
    navigate(`/news/${post._id}`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(post._id, e);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) onShare(post, e);
  };

  const imageUrl = post.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`
    : null;

  const authorInitial = post.authorName ? post.authorName.charAt(0) : "S";
  const formattedDate = formatDate(post.createdAt, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const shortDate = formatDate(post.createdAt, {
    month: "short",
    day: "numeric",
  });

  // 1. LARGE FEATURED CARD VARIANT
  if (variant === "large") {
    return (
      <article
        onClick={handleCardClick}
        className="lg:col-span-2 relative group bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-slate-50 border-b border-slate-100 shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-7xl select-none">
                📰
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-[#d97706] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                <StarIcon className="w-3 h-3 text-white" />
                FEATURED
              </span>
              {post.isFeatured && (
                <span className="bg-[#b91c1c] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full shadow-md">
                  EDITORS CHOICE
                </span>
              )}
            </div>

            {/* Actions overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/95 border border-slate-100 text-slate-650 hover:text-[#b91c1c] shadow-lg shadow-black/5 active:scale-90 hover:scale-105 transition cursor-pointer"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="w-4.5 h-4.5 text-[#b91c1c]" />
                ) : (
                  <BookmarkOutlineIcon className="w-4.5 h-4.5" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/95 border border-slate-100 text-slate-650 hover:text-[#b91c1c] shadow-lg shadow-black/5 active:scale-90 hover:scale-105 transition cursor-pointer"
                aria-label="Share article"
              >
                <ShareIcon className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-3">
              <CategoryBadge category={post.category} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0a0a0a] tracking-tight mb-3 font-serif hover:text-[#b91c1c] transition-colors leading-[1.15]">
              {post.title}
            </h2>
            <p className="text-slate-550 text-sm leading-relaxed mb-6 line-clamp-2">
              {post.description || post.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-slate-50 mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-xs font-black text-slate-600 border border-slate-200 flex items-center justify-center uppercase select-none">
              {authorInitial}
            </div>
            <div>
              <p className="text-xs font-black text-slate-755 leading-tight">
                {post.authorName || "Staff Reporter"}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-slate-400" />
                {post.readingTime} MINS READ
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <EyeIcon className="w-4 h-4 text-slate-400" />
              {post.viewCount || 0} READS
            </span>

            <span className="text-xs font-black text-[#b91c1c] hover:text-[#0a0a0a] flex items-center gap-1 group transition">
              READ FULL STORY
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 2. HORIZONTAL LIST ARTICLE (SIDEBAR / SMALL VIEWPORTS)
  if (variant === "horizontal") {
    return (
      <article
        onClick={handleCardClick}
        className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md cursor-pointer group transition-all duration-200"
      >
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl select-none">
              📰
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#b91c1c] mb-1 block">
                {post.category}
              </span>
              <span className="text-slate-300 font-serif font-black text-sm block select-none">
                {index < 10 ? `0${index}` : index}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[#0a0a0a] leading-snug line-clamp-2 hover:text-[#b91c1c] transition-colors">
              {post.title}
            </h4>
          </div>
          <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5 flex justify-between items-center">
            <span>{shortDate}</span>
            {post.readingTime && <span>{post.readingTime} MIN READ</span>}
          </div>
        </div>
      </article>
    );
  }

  // 3. GRID CARD VARIANT (DEFAULT)
  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/70 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-44 overflow-hidden bg-slate-50 border-b border-slate-100 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl select-none">
            📰
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/95 border border-slate-100 text-slate-650 hover:text-[#b91c1c] shadow-lg shadow-black/5 active:scale-90 hover:scale-105 transition cursor-pointer"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-4 h-4 text-[#b91c1c]" />
            ) : (
              <BookmarkOutlineIcon className="w-4.5 h-4.5" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/95 border border-slate-100 text-slate-655 hover:text-[#b91c1c] shadow-lg shadow-black/5 active:scale-90 hover:scale-105 transition cursor-pointer"
            aria-label="Share article"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <CategoryBadge category={post.category} />
          </div>
          <h3 className="text-sm sm:text-base font-black text-[#0a0a0a] leading-snug line-clamp-2 hover:text-[#b91c1c] transition-colors font-serif">
            {post.title}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {post.description || post.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-650 flex items-center justify-center text-[9px] font-black border border-slate-200 select-none">
              {authorInitial}
            </div>
            <span className="text-slate-600 truncate max-w-[80px]">
              {post.authorName || "Staff"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
              {post.viewCount || 0}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                {post.readingTime}m
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
