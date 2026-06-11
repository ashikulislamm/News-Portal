import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommentItem from "./CommentItem";
import Button from "../../ui/Button";

export default function CommentSection({
  comments = [],
  postAuthorId,
  currentUserId,
  isAuthenticated,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (onAddComment) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="bg-slate-50/50 border border-slate-150 rounded-3xl p-6 md:p-8 mb-10 text-left">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 select-none">
        Discussion Board
      </h3>

      {/* Comment Upload Field */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            placeholder="Join the discussion. Share your perspective..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl p-4 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition duration-200 resize-none"
            rows={3}
            required
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" className="px-5 py-3 text-xs">
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 text-slate-700 p-5 rounded-2xl text-center mb-8">
          <p className="text-sm font-bold">
            You must be logged in to participate.
          </p>
          <Link
            to="/login"
            className="inline-block mt-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Sign In to Post
          </Link>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentUserId = comment.userId?._id || comment.userId;
            const isOwner = currentUserId && commentUserId === currentUserId;
            const isPostAuthor = currentUserId && postAuthorId === currentUserId;

            return (
              <CommentItem
                key={comment._id}
                comment={comment}
                canEdit={isOwner}
                canDelete={isOwner || isPostAuthor}
                onUpdate={onUpdateComment}
                onDelete={onDeleteComment}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 select-none">
          <p className="text-sm text-slate-450 font-bold">
            No comments posted yet. Start the conversation!
          </p>
        </div>
      )}
    </div>
  );
}
