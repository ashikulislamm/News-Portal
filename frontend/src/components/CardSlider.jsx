import { useEffect, useState } from "react";
import { newsService } from "../api/services/news";
import NewsCard from "./features/news/NewsCard";
import { TrendingCardSkeleton } from "./ui/LoadingSkeleton";
import Button from "./ui/Button";

export function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await newsService.getNews({ limit: 6 });
      const latestPosts = data.data?.slice(0, 6) || data.slice(0, 6) || [];
      
      setPosts(latestPosts);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="[var(--color-text)] text-4xl font-semibold mb-6 text-left select-none">
          Explore Latest News
        </h2>

        {/* Error state */}
        {error && (
          <div className="text-center py-12 select-none">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <Button
              onClick={fetchNews}
              variant="primary"
              className="px-6 py-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <TrendingCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Content state */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <NewsCard key={post._id} post={post} variant="grid" />
              ))
            ) : (
              <div className="col-span-full text-center py-12 select-none">
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
