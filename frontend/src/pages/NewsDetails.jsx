import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { newsService } from "../api/services/news";
import useAuth from "../hooks/useAuth";
import useComments from "../hooks/useComments";
import CommentSection from "../components/features/comments/CommentSection";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import { NewsDetailsSkeleton } from "../components/ui/LoadingSkeleton";
import { getYoutubeEmbedUrl } from "../utils/youtube";
import { formatDate } from "../utils/formatters";

export function NewsDetails() {
  const { id } = useParams();
  const { token, isAuthenticated, currentUserId } = useAuth();

  const [post, setPost] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [likeLoading, setLikeLoading] = useState(false);

  // Comments hook
  const {
    comments,
    addComment,
    updateComment,
    deleteComment,
  } = useComments(id);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await newsService.getNewsDetails(id);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch news details:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      setToast({ message: "You must be logged in to like articles!", type: "error" });
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const data = await newsService.toggleLikeNews(id);
      setPost((prev) => ({
        ...prev,
        likes: data.likes,
      }));
      setToast({
        message: data.message || "Like state updated",
        type: "success",
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      setToast({ message: "Failed to update like status.", type: "error" });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddNewComment = async (content) => {
    try {
      await addComment(content);
      setPost((prev) => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1,
      }));
      setToast({ message: "Comment posted successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to post comment.", type: "error" });
    }
  };

  const handleDeleteOldComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setPost((prev) => ({
        ...prev,
        commentCount: Math.max(0, (prev.commentCount || 0) - 1),
      }));
      setToast({ message: "Comment deleted successfully.", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to delete comment.", type: "error" });
    }
  };

  const handleUpdateOldComment = async (commentId, content) => {
    try {
      await updateComment(commentId, content);
      setToast({ message: "Comment updated successfully.", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to edit comment.", type: "error" });
    }
  };

  if (!post) {
    return <NewsDetailsSkeleton />;
  }

  const hasLiked = post.likes?.includes(currentUserId);
  const youtubeEmbedUrl = getYoutubeEmbedUrl(post.videoUrl);
  const formattedPublishDate = formatDate(post.createdAt, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-4 mt-5 text-slate-800 text-left">
      {/* Toast Alert Popups */}
      <AnimatePresence>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

      {/* Category & Tags Header */}
      <div className="flex flex-wrap gap-2 items-center mb-4 select-none">
        {post.category && (
          <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
        )}
        {post.isFeatured && (
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ★ Featured
          </span>
        )}
        {post.location && (
          <span className="text-slate-500 text-sm font-bold flex items-center gap-1">
            📍 {post.location}
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 leading-tight">
        {post.title}
      </h1>

      {/* Author & Publish Date */}
      <div className="flex items-center gap-4.5 border-y border-slate-200 py-3 mb-6 select-none">
        <img
          src="https://i.pravatar.cc/100?img=1"
          alt={post.authorName || "Author"}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="text-sm">
          <p className="font-bold text-slate-900">{post.authorName || "Unknown Author"}</p>
          <p className="text-slate-500 text-xs">
            Published on {formattedPublishDate}
            {post.readingTime && ` · ⏱️ ${post.readingTime} min read`}
            {post.language && ` · 🌐 ${post.language.toUpperCase()}`}
          </p>
        </div>
      </div>

      {/* Main image */}
      {post.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
          alt={post.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-6 shadow-sm border border-slate-100"
        />
      )}

      {/* Lead Summary description */}
      {post.description && (
        <p className="text-lg md:text-xl font-medium text-slate-700 italic border-l-4 border-amber-500 pl-4 mb-6 leading-relaxed">
          {post.description}
        </p>
      )}

      {/* Main Content */}
      <div className="text-lg leading-relaxed text-slate-805 mb-8 whitespace-pre-line text-justify">
        {post.content}
      </div>

      {/* Video Embed */}
      {youtubeEmbedUrl && (
        <div className="mb-8 select-none">
          <h3 className="text-xl font-bold mb-3">Watch Video Coverage</h3>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
            <iframe
              src={youtubeEmbedUrl}
              title="Video embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {post.images && post.images.length > 0 && (
        <div className="mb-8 select-none">
          <h3 className="text-xl font-bold mb-3">Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={`${import.meta.env.VITE_API_BASE_URL}${img}`}
                alt={`Gallery visual ${i + 1}`}
                className="w-full h-32 md:h-44 object-cover rounded-xl shadow-sm hover:scale-102 transition duration-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tags List */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 select-none">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-650 px-3 py-1 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Read More URL */}
      {post.readMoreUrl && (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row gap-3 justify-between items-center select-none">
          <span className="text-sm text-slate-600">This article originally appeared elsewhere.</span>
          <a
            href={post.readMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
          >
            Read Original Source ↗
          </a>
        </div>
      )}

      {/* Likes and stats engagement bar */}
      <div className="flex justify-between items-center border-t border-b border-slate-200 py-4 mb-8 select-none">
        <button
          onClick={handleLikeToggle}
          disabled={likeLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer select-none transition ${
            hasLiked
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <span className="text-lg">{hasLiked ? "❤️" : "🤍"}</span>
          <span>{hasLiked ? "Liked" : "Like Article"}</span>
          <span className="ml-1.5 text-xs bg-black/5 px-2 py-0.5 rounded-md">
            {post.likes?.length || 0}
          </span>
        </button>

        <div className="flex gap-4.5 text-slate-500 text-sm font-bold">
          <span>👁️ {post.viewCount || 0} Views</span>
          <span>💬 {comments.length} Comments</span>
        </div>
      </div>

      {/* Reusable CommentSection Component */}
      <CommentSection
        comments={comments}
        postAuthorId={post.author?.userId?._id || post.author?.userId}
        currentUserId={currentUserId}
        isAuthenticated={isAuthenticated}
        onAddComment={handleAddNewComment}
        onUpdateComment={handleUpdateOldComment}
        onDeleteComment={handleDeleteOldComment}
      />
    </div>
  );
}
