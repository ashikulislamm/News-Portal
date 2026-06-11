import React, { useState } from "react";
import Button from "../../ui/Button";

export default function CommentItem({
  comment,
  canEdit = false,
  canDelete = false,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content || "");

  const handleSave = () => {
    if (!content.trim()) return;
    if (onUpdate) {
      onUpdate(comment._id, content);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(comment.content || "");
    setIsEditing(false);
  };

  const authorInitial = comment.userName ? comment.userName.charAt(0) : "U";
  const avatarUrl = `https://i.pravatar.cc/50?u=${comment.userId?._id || comment.userId}`;

  return (
    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm text-left">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={comment.userName || "User"}
            className="h-8 w-8 rounded-full border border-slate-100"
            loading="lazy"
          />
          <div className="text-left select-none">
            <span className="font-bold text-slate-900 text-sm block">
              {comment.userName || "Anonymous Reader"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {new Date(comment.createdAt).toLocaleDateString()} at{" "}
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Actions panel */}
        {!isEditing && (canEdit || canDelete) && (
          <div className="flex gap-2.5 text-xs">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-amber-500 font-bold cursor-pointer transition"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content / Edit form area */}
      {isEditing ? (
        <div className="space-y-2 mt-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:outline-none focus:ring-3 focus:ring-amber-500/10 focus:bg-white transition"
            rows={2}
            required
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-3.5 py-1.5 text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              className="px-4 py-1.5 text-[10px]"
            >
              Save Update
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-1">
          {comment.content}
        </p>
      )}
    </div>
  );
}
