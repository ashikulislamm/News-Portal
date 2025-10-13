import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function NewsDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/news/${id}`
        );
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch news details:", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-5">
        <div className="animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl mb-6 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          
          {/* Title Skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          </div>
          
          {/* Meta Info Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 w-1 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/5 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          </div>
          
          {/* Loading Indicator */}
          <div className="flex items-center justify-center mt-8 p-4">
            <div className="flex items-center gap-3 text-gray-500">
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Loading article...</span>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-5">
      {post.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
          alt={post.title}
          className="w-full rounded-xl mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-slate-500 mb-4">
        By {post.authorName || "Unknown Author"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed text-justify">{post.content}</p>
    </div>
  );
}
