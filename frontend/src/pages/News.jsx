import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import useNews from "../hooks/useNews";
import NewsCard from "../components/features/news/NewsCard";
import NewsTicker from "../components/features/news/NewsTicker";
import CategoryPills from "../components/features/news/CategoryPills";
import {
  NewsletterWidget,
  TrendingWidget,
  AdPromoWidget,
  EditorsPicksWidget,
} from "../components/features/news/SidebarWidget";
import Alert from "../components/ui/Alert";
import Toast from "../components/ui/Toast";
import { NewsHeroSkeleton, NewsCardSkeleton } from "../components/ui/LoadingSkeleton";
import Button from "../components/ui/Button";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All",
  "Bangladesh",
  "International",
  "Politics",
  "Business",
  "Technology",
  "AI",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "Lifestyle",
];

const SORT_OPTIONS = [
  { label: "Latest", value: "createdAt" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "views" },
  { label: "Trending", value: "trending" },
  { label: "Editor's Choice", value: "featured" },
  { label: "A–Z", value: "az" },
];

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const TRENDING_TOPICS = [
  "Artificial Intelligence",
  "Bangladesh Cricket",
  "Global Markets",
  "Elections",
  "Vite React",
  "Climate Action",
  "Startup Funding",
];

export function News() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL States synced
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "createdAt";
  const dateFilter = searchParams.get("date") || "all";

  // Local UI States
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [bookmarks, setBookmarks] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Custom Data Fetching Hook
  const {
    posts,
    loading,
    loadingMore,
    error,
    totalResults,
    page,
    hasMore,
    loadMore,
    refetch,
  } = useNews(searchQuery, selectedCategory, sortBy, dateFilter);

  // Load Bookmarks on Mount
  useEffect(() => {
    const saved = localStorage.getItem("news_bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing bookmarks:", e);
      }
    }
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search logic to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const current = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        current.set("search", searchInput.trim());
      } else {
        current.delete("search");
      }
      current.set("page", "1");
      setSearchParams(current);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchInput, setSearchParams]);

  // Keep searchInput aligned with URL search changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Toggle Bookmark
  const toggleBookmark = (postId, e) => {
    e.stopPropagation();
    let updated;
    const isBookmarked = bookmarks.includes(postId);
    if (isBookmarked) {
      updated = bookmarks.filter((id) => id !== postId);
      setToast({ message: "Article removed from bookmarks.", type: "success" });
    } else {
      updated = [...bookmarks, postId];
      setToast({ message: "Article saved to bookmarks.", type: "success" });
    }
    setBookmarks(updated);
    localStorage.setItem("news_bookmarks", JSON.stringify(updated));
  };

  // Web Share or Copy Clipboard
  const shareArticle = (post, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/news/${post.slug || post._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.description || "Read this interesting news story!",
          url: shareUrl,
        })
        .catch((err) => console.error("Web share failed:", err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      setToast({ message: "Shareable URL copied to clipboard.", type: "success" });
    }
  };

  // URL modifiers
  const handleCategorySelect = (category) => {
    const current = new URLSearchParams(searchParams);
    if (category && category !== "All") {
      current.set("category", category);
    } else {
      current.delete("category");
    }
    current.set("page", "1");
    setSearchParams(current);
  };

  const handleSortChange = (e) => {
    const current = new URLSearchParams(searchParams);
    current.set("sort", e.target.value);
    current.set("page", "1");
    setSearchParams(current);
  };

  const handleDateChange = (e) => {
    const current = new URLSearchParams(searchParams);
    current.set("date", e.target.value);
    current.set("page", "1");
    setSearchParams(current);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  // Layout Slicing
  const breakingArticles = posts.slice(0, 5);
  const largeFeatured = posts.find((p) => p.isFeatured) || posts[0];
  const sideFeatured = largeFeatured
    ? posts.filter((p) => p._id !== largeFeatured._id).slice(0, 3)
    : [];

  const excludeIds = new Set();
  if (largeFeatured) excludeIds.add(largeFeatured._id);
  sideFeatured.forEach((p) => excludeIds.add(p._id));
  const gridArticles = posts.filter((p) => !excludeIds.has(p._id));

  // Sidebar widget contents
  const trendingArticles = [...posts]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  const editorPicks = posts.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0a0a0a] text-left antialiased transition-colors duration-300">
      
      {/* ── Breaking News Ticker ────────────────────────────────────────── */}
      {breakingArticles.length > 0 && <NewsTicker posts={breakingArticles} />}

      {/* ── Hero Headline Section ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200/60 select-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#b91c1c] text-xs font-black tracking-widest uppercase">
              <SparklesIcon className="w-4 h-4 text-[#d97706]" />
              <span>EDITORIAL HIGHLIGHTS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0a0a0a] leading-[1.05] mb-3 font-serif">
              Latest News
            </h1>
            <p className="text-slate-505 font-medium max-w-xl text-sm sm:text-base leading-relaxed">
              Explore trusted reporting, breaking stories, and deep editorial analysis shaping local and global landscapes.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                Trending Topics:
              </span>
              <div className="flex flex-wrap gap-2 max-w-md">
                {TRENDING_TOPICS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchInput(tag)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-[#b91c1c] hover:bg-slate-50 transition duration-150 cursor-pointer focus-indicator text-slate-700 shadow-sm"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-black tracking-wide text-slate-400 mt-2">
              PUBLISHED COPIES: <span className="text-[#0a0a0a]">{totalResults} STORIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Query & Filters Bar ──────────────────────────────────── */}
      <section className="sticky top-[84px] z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-[#faf9f6]/95 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by keywords, tags, title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#0a0a0a] placeholder:text-slate-400 focus:outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-[#b91c1c]/10 transition-all duration-200 font-bold focus-indicator"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-500 hover:text-[#0a0a0a] cursor-pointer"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select dropdowns & reset */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <TagIcon className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-transparent text-xs font-black text-slate-700 outline-none pr-6 cursor-pointer focus-indicator"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range selection */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <select
                value={dateFilter}
                onChange={handleDateChange}
                className="bg-transparent text-xs font-black text-slate-700 outline-none pr-6 cursor-pointer focus-indicator"
              >
                {DATE_FILTERS.map((df) => (
                  <option key={df.value} value={df.value}>
                    Date: {df.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset filters */}
            {(searchQuery || selectedCategory || sortBy !== "createdAt" || dateFilter !== "all") && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 bg-[#1e1e1e] text-white hover:bg-[#b91c1c] text-xs font-black px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all duration-150 select-none"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories horizontally scrollable Pills */}
        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* ── Main Content Body ──────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Error Fallback */}
        {error && (
          <Alert
            title="Query Unreachable"
            message={error}
            emoji="📡"
            onAction={refetch}
            actionLabel="Re-Query Data"
          />
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-12">
            <NewsHeroSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-white border border-slate-100 text-center py-24 px-6 rounded-3xl max-w-xl mx-auto shadow-sm my-10 select-none">
            <div className="text-6xl mb-5">🔍</div>
            <h3 className="text-[#0a0a0a] font-black text-xl mb-2 font-serif">No editorial pieces found</h3>
            <p className="text-slate-405 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              We couldn't find matches for your search. Try removing filters or inputting a different topic.
            </p>
            <Button onClick={clearAllFilters} variant="dark" className="px-6 py-3 font-black">
              Reset Search & Filters
            </Button>
          </div>
        )}

        {/* Content list displays */}
        {!loading && !error && posts.length > 0 && (
          <div className="space-y-12">
            {page === 1 && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Large Cover Featured Card (takes 2 columns) */}
                {largeFeatured && (
                  <NewsCard
                    post={largeFeatured}
                    variant="large"
                    isBookmarked={bookmarks.includes(largeFeatured._id)}
                    onToggleBookmark={toggleBookmark}
                    onShare={shareArticle}
                  />
                )}

                {/* Right Side small featured list */}
                <div className="space-y-4">
                  <div className="border-b border-slate-200/60 pb-2 mb-2 select-none text-left">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      ★ TOP STORIES
                    </span>
                  </div>
                  {sideFeatured.map((post, idx) => (
                    <NewsCard
                      key={post._id}
                      post={post}
                      variant="horizontal"
                      index={idx + 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Main grid divider line */}
            {gridArticles.length > 0 && (
              <div className="flex items-center gap-5 pt-8 border-t border-slate-200/60 select-none">
                <span className="text-xs font-black uppercase text-slate-400 tracking-widest shrink-0">
                  ALL STORIES IN GRID
                </span>
                <div className="flex-1 h-px bg-slate-200/60" />
              </div>
            )}

            {/* Main News Card Grid (Left 3 columns) + Right sidebar widgets (1 column) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Cards Grid */}
              <div className="lg:col-span-3 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gridArticles.map((post) => (
                    <NewsCard
                      key={post._id}
                      post={post}
                      variant="grid"
                      isBookmarked={bookmarks.includes(post._id)}
                      onToggleBookmark={toggleBookmark}
                      onShare={shareArticle}
                    />
                  ))}
                </div>

                {/* Load More Pagination Trigger */}
                {hasMore && (
                  <div className="pt-8 text-center">
                    <Button
                      onClick={loadMore}
                      loading={loadingMore}
                      variant="dark"
                      className="px-8 py-3.5"
                    >
                      LOAD MORE STORIES
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar column widgets */}
              <aside className="space-y-8 lg:border-l lg:border-slate-200/60 lg:pl-8">
                <NewsletterWidget />
                <TrendingWidget posts={trendingArticles} />
                <AdPromoWidget />
                {editorPicks.length > 0 && <EditorsPicksWidget posts={editorPicks} />}
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* Floating Utilities */}
      
      {/* Scroll to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-40 w-11 h-11 bg-white hover:bg-[#b91c1c] text-[#1e1e1e] hover:text-white border border-slate-200 hover:border-[#b91c1c] rounded-full flex items-center justify-center shadow-xl cursor-pointer active:scale-95 transition-all duration-200 focus-indicator"
            title="Scroll to top"
          >
            <ChevronUpIcon className="w-5 h-5 font-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Alerts Toast */}
      <AnimatePresence>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
