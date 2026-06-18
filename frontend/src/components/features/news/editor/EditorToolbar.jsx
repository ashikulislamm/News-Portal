import React, { useState, useRef } from "react";
import { newsService } from "../../../../api/services/news";

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const fileInputRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Formatting triggers
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleHighlight = () => editor.chain().focus().toggleHighlight().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();
  const insertDivider = () => editor.chain().focus().setHorizontalRule().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  // Heading selectors
  const handleHeadingChange = (e) => {
    const value = e.target.value;
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(value, 10) }).run();
    }
  };

  const getHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    if (editor.isActive("heading", { level: 4 })) return "4";
    return "paragraph";
  };

  // Alignments
  const handleAlign = (alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  // Links
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkUrl.trim() === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkModal(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // Images
  const handleUrlImageSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim() !== "") {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageModal(false);
    }
  };

  const handleLocalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await newsService.uploadImage(file);
      const absoluteUrl = `${import.meta.env.VITE_API_BASE_URL}${res.url}`;
      editor.chain().focus().setImage({ src: absoluteUrl, alt: file.name }).run();
      setShowImageModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Custom Blocks
  const insertBreakingNews = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div data-type="breaking-news" class="custom-breaking-news">
          <div class="custom-breaking-news-header" contenteditable="false">🚨 Breaking News</div>
          <div class="custom-breaking-news-content"><p>Enter breaking news detail here...</p></div>
        </div>`
      )
      .run();
  };

  const insertQuickFacts = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div data-type="quick-facts" class="custom-quick-facts">
          <div class="custom-quick-facts-header" contenteditable="false">📌 Quick Facts</div>
          <div class="custom-quick-facts-content">
            <ul>
              <li>Fact item 1</li>
              <li>Fact item 2</li>
            </ul>
          </div>
        </div>`
      )
      .run();
  };

  const insertKeyTakeaways = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div data-type="key-takeaways" class="custom-key-takeaways">
          <div class="custom-key-takeaways-header" contenteditable="false">Key Takeaways</div>
          <div class="custom-key-takeaways-content">
            <ul>
              <li>Key point 1</li>
              <li>Key point 2</li>
            </ul>
          </div>
        </div>`
      )
      .run();
  };

  const insertPullQuote = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<blockquote data-type="pull-quote" class="custom-pull-quote">
          <p>"Write an outstanding editorial quote here..."</p>
        </blockquote>`
      )
      .run();
  };

  const insertRelatedStory = () => {
    editor.chain().focus().insertContent({ type: "relatedStory" }).run();
  };

  const insertCalloutBox = (type = "info") => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div data-type="callout-box" data-callout-type="${type}" class="custom-callout-box custom-callout-box-${type}">
          <div class="custom-callout-box-icon" contenteditable="false">${type === "warning" ? "⚠️" : "💡"}</div>
          <div class="custom-callout-box-content"><p>Important callout note goes here...</p></div>
        </div>`
      )
      .run();
  };

  return (
    <div className="sticky top-0 z-30 bg-slate-50 border border-slate-200 rounded-t-xl p-2.5 flex flex-wrap gap-1.5 items-center shadow-sm select-none">
      
      {/* 1. History */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-slate-650 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          title="Undo"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-slate-650 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          title="Redo"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
        </button>
      </div>

      {/* 2. Text Style / Heading Selector */}
      <div className="border-r border-slate-200 pr-1.5">
        <select
          value={getHeadingValue()}
          onChange={handleHeadingChange}
          className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1.5 px-2.5 outline-none focus:border-amber-500 cursor-pointer text-slate-700"
        >
          <option value="paragraph">Normal Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
      </div>

      {/* 3. Common inline formatting */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("bold") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Bold"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9h-3.5v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("italic") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Italic"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("underline") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Underline"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleStrike}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("strike") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Strike-through"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zm-1 8h16v-2H4v2z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleHighlight}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("highlight") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Highlight Text"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m15.3 2.7 6 6-3.5 3.5-6-6zM11.8 6.2l3.5 3.5M9.3 8.7 5.5 12.5l3.5 3.5 3.8-3.8M2 22h4l2-2H4z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleCode}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("code") ? "bg-amber-500/10 text-amber-600 font-bold" : "text-slate-650 hover:bg-slate-200"}`}
          title="Inline Code"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/></svg>
        </button>
      </div>

      {/* 4. Alignments */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={() => handleAlign("left")}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive({ textAlign: "left" }) ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Align Left"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlign("center")}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive({ textAlign: "center" }) ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Align Center"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm4-4h10v-2H7v2zm-4-4h18v-2H3v2zm4-4h10V7H7v2zM3 3v2h18V3H3z"/></svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlign("right")}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive({ textAlign: "right" }) ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Align Right"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
        </button>
        <button
          type="button"
          onClick={() => handleAlign("justify")}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive({ textAlign: "justify" }) ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Justify"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>
        </button>
      </div>

      {/* 5. Lists */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("bulletList") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Bullet List"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("orderedList") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Numbered List"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9v-.9H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
        </button>
        <button
          type="button"
          onClick={toggleTaskList}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("taskList") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Task List"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
      </div>

      {/* 6. Media, Links & Blocks */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("blockquote") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Blockquote"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </button>
        <button
          type="button"
          onClick={insertDivider}
          className="p-1.5 rounded-lg text-slate-650 hover:bg-slate-200 transition cursor-pointer"
          title="Horizontal Divider"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/></svg>
        </button>
        
        {/* Link controls */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={openLinkModal}
            className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("link") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
            title="Insert Link"
          >
            <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={removeLink}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
              title="Remove Link"
            >
              <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round"><path d="m18 8-4 4 4 4M6 8l4 4-4 4"/></svg>
            </button>
          )}
        </div>

        {/* Image insertion */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 rounded-lg text-slate-650 hover:bg-slate-200 transition cursor-pointer"
          title="Insert Image"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </button>
        
        <button
          type="button"
          onClick={toggleCodeBlock}
          className={`p-1.5 rounded-lg transition cursor-pointer ${editor.isActive("codeBlock") ? "bg-amber-500/10 text-amber-600" : "text-slate-650 hover:bg-slate-200"}`}
          title="Code Block"
        >
          <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
        </button>
      </div>

      {/* 7. News Portal Specific Custom Blocks */}
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={insertBreakingNews}
          className="px-2 py-1 rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 text-[10px] font-black uppercase text-red-650 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Breaking News Block"
        >
          🚨 Breaking
        </button>
        <button
          type="button"
          onClick={insertQuickFacts}
          className="px-2 py-1 rounded-lg border border-amber-200 hover:border-amber-500 hover:bg-amber-50 text-[10px] font-black uppercase text-amber-600 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Quick Facts Box"
        >
          📌 Facts
        </button>
        <button
          type="button"
          onClick={insertKeyTakeaways}
          className="px-2 py-1 rounded-lg border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-[10px] font-black uppercase text-indigo-600 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Key Takeaways Box"
        >
          🔑 Takeaways
        </button>
        <button
          type="button"
          onClick={insertPullQuote}
          className="px-2 py-1 rounded-lg border border-slate-200 hover:border-slate-500 hover:bg-slate-50 text-[10px] font-black uppercase text-slate-700 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Editorial Pull Quote"
        >
          ❝ Pull Quote
        </button>
        <button
          type="button"
          onClick={insertRelatedStory}
          className="px-2 py-1 rounded-lg border border-slate-200 hover:border-slate-500 hover:bg-slate-50 text-[10px] font-black uppercase text-slate-700 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Link Related News Story"
        >
          🔗 Related
        </button>
        <button
          type="button"
          onClick={() => insertCalloutBox("info")}
          className="px-2 py-1 rounded-lg border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-[10px] font-black uppercase text-blue-650 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Info Callout"
        >
          💡 Info Box
        </button>
        <button
          type="button"
          onClick={() => insertCalloutBox("warning")}
          className="px-2 py-1 rounded-lg border border-amber-200 hover:border-amber-550 hover:bg-amber-50/50 text-[10px] font-black uppercase text-amber-750 tracking-wider transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Insert Warning Callout"
        >
          ⚠️ Warning Box
        </button>
      </div>

      {/* ── Link Insertion Modal / Dialog overlay ────────────────────────── */}
      {showLinkModal && (
        <div className="absolute top-full left-0 mt-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg z-40 w-72 text-left animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleLinkSubmit} className="space-y-3.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Insert Hyperlink</div>
            <input
              type="url"
              placeholder="Paste URL (https://...)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-700"
              required
              autoFocus
            />
            <div className="flex justify-end gap-2 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer"
              >
                Apply Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Image Dialog overlay ─────────────────────────────────────────── */}
      {showImageModal && (
        <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded-xl border border-slate-200 shadow-lg z-40 w-80 text-left animate-in fade-in slide-in-from-top-1 duration-150 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Insert Image Node</div>
          
          {/* A. File upload section */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Upload from Computer</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLocalImageUpload}
              className="hidden"
              id="editor-file-image"
            />
            <label
              htmlFor="editor-file-image"
              className={`w-full inline-flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 border-dashed cursor-pointer transition ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}
            >
              {uploadingImage ? "Uploading image..." : "Choose Local Image"}
            </label>
          </div>

          <div className="flex items-center gap-3 py-1 select-none">
            <span className="h-px bg-slate-150 flex-1"></span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">or</span>
            <span className="h-px bg-slate-150 flex-1"></span>
          </div>

          {/* B. Paste URL section */}
          <form onSubmit={handleUrlImageSubmit} className="space-y-3">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Insert Image by Web URL</span>
            <input
              type="url"
              placeholder="Paste image url (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-700"
              required
            />
            <div className="flex justify-end gap-2 text-[10px] font-bold pt-1">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer"
              >
                Insert Web Image
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
