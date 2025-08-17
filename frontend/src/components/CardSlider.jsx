// src/components/Trending.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

function Card({ post }) {
  return (
    <article className="bg-[var(--color-primary)] text-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-3 pt-3">
        {post.imageUrl && (
          <img
            src={`http://localhost:5000${post.imageUrl}`}
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
        <a
          href="#"
          className="text-[var(--color-accent)] hover:text-sky-300 font-medium"
        >
          Read more →
        </a>
      </div>
    </article>
  );
}

export function Trending() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news");

        const latestPosts = res.data.slice(0, 6); // Get the latest 6 posts
        // res.data already has authorName, imageUrl, createdAt, title, content
        setPosts(latestPosts);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
  }, []);
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="[var(--color-text)] text-4xl font-semibold mb-6">
          Explore Latest News
        </h2>

        {/* responsive grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
