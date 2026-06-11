import React, { useState, useEffect } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const CATEGORIES = [
  "Politics",
  "Sports",
  "Technology",
  "Business",
  "Entertainment",
  "Health",
  "Education"
];

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Bengali", value: "bn" },
];

export default function NewsForm({
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = "Submit Article",
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "Politics",
    tags: "",
    keywords: "",
    videoUrl: "",
    readMoreUrl: "",
    language: "en",
    location: "",
    isFeatured: false,
  });

  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);

  // Previews
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Sync initial values if provided (e.g. when editing)
  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || "",
        description: initialValues.description || "",
        content: initialValues.content || "",
        category: initialValues.category || "Politics",
        tags: Array.isArray(initialValues.tags) ? initialValues.tags.join(", ") : initialValues.tags || "",
        keywords: Array.isArray(initialValues.keywords) ? initialValues.keywords.join(", ") : initialValues.keywords || "",
        videoUrl: initialValues.videoUrl || "",
        readMoreUrl: initialValues.readMoreUrl || "",
        language: initialValues.language || "en",
        location: initialValues.location || "",
        isFeatured: !!initialValues.isFeatured,
      });

      if (initialValues.imageUrl) {
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${initialValues.imageUrl}`);
      }
      if (initialValues.thumbnailImage) {
        setThumbnailPreview(`${import.meta.env.VITE_API_BASE_URL}${initialValues.thumbnailImage}`);
      }
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fileSetter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      fileSetter(file);
      if (previewSetter) {
        previewSetter(URL.createObjectURL(file));
      }
    }
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setGallery(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct FormData to handle multipart/form-data
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) formData.append("image", image);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (gallery && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        formData.append("gallery", gallery[i]);
      }
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <Input
          label="Article Title"
          id="title"
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="E.g. Breaking: Major Tech Advancements"
          className="md:col-span-2"
        />

        {/* Short Description */}
        <Input
          label="Short Description"
          id="description"
          name="description"
          textarea
          rows={2}
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Brief summary of the article..."
          className="md:col-span-2"
        />

        {/* Content */}
        <Input
          label="Full Article Body"
          id="content"
          name="content"
          textarea
          rows={8}
          required
          value={form.content}
          onChange={handleChange}
          placeholder="Write full article here..."
          className="md:col-span-2"
        />

        {/* Category Selector */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Category *
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Language
          </label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <Input
          label="Tags (Comma separated)"
          id="tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="tech, gadgets, update"
        />

        {/* Keywords */}
        <Input
          label="Keywords (Comma separated)"
          id="keywords"
          name="keywords"
          value={form.keywords}
          onChange={handleChange}
          placeholder="news, details, report"
        />

        {/* Location */}
        <Input
          label="Location (City, Country)"
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Dhaka, Bangladesh"
        />

        {/* Video Coverage URL */}
        <Input
          label="Video Coverage Link (YouTube)"
          id="videoUrl"
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />

        {/* External Read More Link */}
        <Input
          label="Original Source URL (Read More)"
          id="readMoreUrl"
          name="readMoreUrl"
          value={form.readMoreUrl}
          onChange={handleChange}
          placeholder="https://external-news.com/post-details"
          className="md:col-span-2"
        />

        {/* Main Cover Image Upload */}
        <div className="space-y-2 text-left">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Main Cover Image
          </span>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Main cover preview"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="main-image"
              onChange={(e) => handleFileChange(e, setImage, setImagePreview)}
              className="hidden"
            />
            <label
              htmlFor="main-image"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Thumbnail Image Upload */}
        <div className="space-y-2 text-left">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Thumbnail Image
          </span>
          <div className="flex items-center gap-4">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="thumbnail-image"
              onChange={(e) => handleFileChange(e, setThumbnail, setThumbnailPreview)}
              className="hidden"
            />
            <label
              htmlFor="thumbnail-image"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
            >
              Choose Thumbnail
            </label>
          </div>
        </div>

        {/* Gallery Image Uploads */}
        <div className="space-y-2 text-left md:col-span-2">
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Photo Gallery (Up to 10 images)
          </span>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              id="gallery-images"
              onChange={handleMultipleFilesChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <label
                htmlFor="gallery-images"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
              >
                Select Gallery Photos
              </label>
              {gallery.length > 0 && (
                <span className="text-xs text-slate-500 font-semibold">
                  {gallery.length} files selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Is Featured Checkbox */}
        <div className="md:col-span-2 flex items-center mt-2">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
            className="h-4.5 w-4.5 rounded border-slate-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
          />
          <label
            htmlFor="isFeatured"
            className="ml-2.5 block text-sm font-bold text-slate-700 cursor-pointer select-none leading-none"
          >
            Mark Article as Featured / Editor's Choice
          </label>
        </div>
      </div>

      <div className="border-t border-slate-150 pt-4 flex justify-end">
        <Button type="submit" loading={loading} className="px-6 py-3 uppercase">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
