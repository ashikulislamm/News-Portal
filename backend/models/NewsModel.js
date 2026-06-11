import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  // ===== CONTENT =====
  title: { type: String, required: true },
  description: { type: String, required: true }, // 100-150 char summary
  content: { type: String, required: true },
  slug: { type: String, unique: true, required: true }, // URL-friendly ID
  
  // ===== MEDIA =====
  imageUrl: { type: String }, // Main feature image
  thumbnailImage: { type: String }, // Small preview image
  images: [{ type: String }], // Additional images/gallery
  videoUrl: { type: String }, // Optional video embed
  
  // ===== CATEGORIZATION =====
  category: { 
    type: String, 
    enum: ["Politics", "Sports", "Technology", "Business", "Entertainment", "Health", "Education"],
    required: true 
  },
  tags: [{ type: String }], // Search/filter tags
  keywords: [{ type: String }], // SEO keywords
  
  // ===== AUTHOR =====
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: { type: String }, // Denormalized for quick access
  },
  
  // ===== PUBLISHING =====
  publishedAt: { type: Date },
  isFeatured: { type: Boolean, default: false }, // Promotion flag
  
  // ===== ENGAGEMENT =====
  viewCount: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Who liked it
  commentCount: { type: Number, default: 0 },
  
  // ===== METADATA =====
  readingTime: { type: Number }, // minutes
  readMoreUrl: { type: String }, // External link if reposted
  language: { type: String, default: "en" },
  location: { type: String }, // Geo-tag
  
  // ===== TIMESTAMPS =====
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Add search indexes for full-text search if query uses it
newsSchema.index({ title: "text", description: "text", content: "text" });

export default mongoose.model("News", newsSchema);
