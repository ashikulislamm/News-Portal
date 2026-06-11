import { useState, useEffect, useCallback } from "react";
import { newsService } from "../api/services/news";

export default function useNews(searchQuery = "", category = "", sortBy = "createdAt", dateFilter = "all") {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const fetchNews = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = {
        page: pageNum,
        limit: limit,
      };

      if (category && category !== "All") {
        params.category = category;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Backend native sorting queries: 'createdAt', 'views'
      if (sortBy === "createdAt") {
        params.sort = "createdAt";
      } else if (sortBy === "views" || sortBy === "trending") {
        params.sort = "views";
      }

      const res = await newsService.getNews(params);
      const fetched = res.data || [];
      const totalCount = res.total || fetched.length;

      // Apply local/hybrid sorting & filtering
      let processed = [...fetched];

      // Local Date Filter
      if (dateFilter && dateFilter !== "all") {
        const now = new Date();
        processed = processed.filter((post) => {
          const postDate = new Date(post.createdAt);
          const diffTime = Math.abs(now - postDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (dateFilter === "today") return diffDays <= 1;
          if (dateFilter === "week") return diffDays <= 7;
          if (dateFilter === "month") return diffDays <= 30;
          return true;
        });
      }

      // Local hybrid sorting fallbacks
      if (sortBy === "oldest") {
        processed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === "az") {
        processed.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "featured") {
        processed.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      } else if (sortBy === "trending") {
        processed.sort((a, b) => {
          if ((b.viewCount || 0) !== (a.viewCount || 0)) {
            return (b.viewCount || 0) - (a.viewCount || 0);
          }
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        });
      }

      if (append) {
        setPosts((prev) => [...prev, ...processed]);
      } else {
        setPosts(processed);
      }

      setTotalResults(totalCount);
      setHasMore(fetched.length === limit);
    } catch (err) {
      console.error("Failed to load news articles:", err);
      setError("We encountered a server query issue. Please check your internet connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, category, sortBy, dateFilter]);

  // Refetch from page 1 when query parameters change
  useEffect(() => {
    fetchNews(1, false);
    setPage(1);
  }, [fetchNews, searchQuery, category, sortBy, dateFilter]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, true);
  };

  return {
    posts,
    loading,
    loadingMore,
    error,
    totalResults,
    page,
    hasMore,
    loadMore,
    refetch: () => fetchNews(1, false),
  };
}
