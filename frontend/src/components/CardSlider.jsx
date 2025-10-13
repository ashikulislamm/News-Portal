// src/components/Trending.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Card({ post }) {
  const navigate = useNavigate();

  const handleReadMore = () => {
    // Navigate to news details page with the post ID
    navigate(`/news/${post._id}`);
  };
  return (
    <article className="bg-[var(--color-primary)] text-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-3 pt-3">
        {post.imageUrl && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
            alt={post.title}
            className="h-44 w-full object-cover rounded-xl"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={"https://i.pravatar.cc/50?img=1"}
            alt={post.authorName || "Author"}
            className="h-8 w-8 rounded-full"
          />
          <div className="text-sm">
            <p className="text-left font-semibold">
              {post.authorName || "Unknown Author"}
            </p>
            <p className="text-slate-400">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Unknown Date"}{" "}
              ·{" "}
              {post.createdAt
                ? new Date(post.createdAt).toLocaleTimeString()
                : "Unknown Time"}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-slate-300/90 leading-relaxed mb-4 line-clamp-3">
          {post.content || post.excerpt || "No description available."}
        </p>
        <button
          onClick={handleReadMore}
          className="text-[var(--color-accent)] hover:text-sky-300 font-medium"
        >
          Read more →
        </button>
      </div>
    </article>
  );
}

export function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/news`
        );

        const latestPosts = res.data.slice(0, 6); // Get the latest 6 posts
        // res.data already has authorName, imageUrl, createdAt, title, content
        setPosts(latestPosts);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-[var(--color-primary)] rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="px-3 pt-3">
        <div className="h-44 w-full bg-slate-600 rounded-xl"></div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 bg-slate-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-600 rounded mb-1 w-24"></div>
            <div className="h-3 bg-slate-600 rounded w-32"></div>
          </div>
        </div>
        <div className="h-6 bg-slate-600 rounded mb-2 w-full"></div>
        <div className="h-4 bg-slate-600 rounded mb-1 w-full"></div>
        <div className="h-4 bg-slate-600 rounded mb-1 w-3/4"></div>
        <div className="h-4 bg-slate-600 rounded mb-4 w-1/2"></div>
        <div className="h-4 bg-slate-600 rounded w-24"></div>
      </div>
    </div>
  );

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="[var(--color-text)] text-4xl font-semibold mb-6">
          Explore Latest News
        </h2>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Content state */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => <Card key={post._id} post={post} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-[var(--color-text)] text-lg">
                  No news articles available at the moment.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
