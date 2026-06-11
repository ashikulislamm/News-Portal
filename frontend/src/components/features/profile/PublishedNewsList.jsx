import React from "react";
import { motion } from "framer-motion";
import { FolderIcon, CalendarIcon, ClockIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";
import { formatDate } from "../../../utils/formatters";

export default function PublishedNewsList({
  posts = [],
  postsLoading = false,
  onEditPost,
  onDeletePost,
  onCreateClick,
}) {
  return (
    <div className="text-left space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 select-none">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Published Articles
            </h2>
            <p className="text-sm text-slate-550">
              Edit, remove, or monitor your existing publisher feeds.
            </p>
          </div>
          <div className="text-xs font-bold text-[var(--color-accent)] bg-amber-500/10 px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
            {posts.length} {posts.length === 1 ? "Article" : "Articles"} Published
          </div>
        </div>

        {/* Loading State */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="w-full h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-9 bg-slate-200 rounded-lg flex-1"></div>
                  <div className="h-9 bg-slate-200 rounded-lg flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 select-none">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <FolderIcon className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No articles published yet
            </h3>
            <p className="text-sm text-slate-505 mb-6">
              Start sharing verified news stories with the world.
            </p>
            <Button onClick={onCreateClick} variant="primary" className="px-4 py-2.5">
              Create First Article
            </Button>
          </div>
        ) : (
          /* Grid of Published News */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => {
              const imageUrl = post.imageUrl
                ? `${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`
                : null;

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-500/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Image Thumbnail Preview */}
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-200 relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-500/10 to-amber-500/20 flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-[var(--color-accent)]/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-505 leading-relaxed line-clamp-3">
                        {post.description || post.content || "No summary text available."}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Calendar Metadata Row */}
                  <div className="space-y-4 mt-5 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wide select-none">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(post.createdAt, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      <Button
                        onClick={() => onEditPost(post._id)}
                        variant="outline"
                        className="flex-1 py-2 text-xs font-bold"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        onClick={() => onDeletePost(post)}
                        variant="secondary"
                        className="flex-1 py-2 text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
