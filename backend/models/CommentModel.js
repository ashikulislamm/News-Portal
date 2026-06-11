import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index to quickly fetch comments for a specific news post
commentSchema.index({ newsId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
