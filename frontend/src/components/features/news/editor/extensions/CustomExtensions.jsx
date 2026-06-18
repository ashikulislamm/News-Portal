import Image from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, { useState } from "react";

// ==========================================
// 1. CUSTOM RESIZABLE IMAGE WITH CAPTIONS
// ==========================================

const ImageNodeView = ({ node, updateAttributes, selected }) => {
  const handleWidth = (width) => {
    updateAttributes({ width });
  };

  const handleAlign = (align) => {
    updateAttributes({ align });
  };

  const handleCaption = (e) => {
    updateAttributes({ caption: e.target.value });
  };

  const alignClass = 
    node.attrs.align === "left" ? "mr-auto ml-0" :
    node.attrs.align === "right" ? "ml-auto mr-0" : "mx-auto";

  return (
    <NodeViewWrapper className={`custom-editor-image-wrapper my-6 ${selected ? "ring-2 ring-amber-500 rounded-xl" : ""}`}>
      <div 
        className={`relative group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden ${alignClass}`}
        style={{ width: node.attrs.width || "100%", transition: "all 0.2s" }}
      >
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || "Article image"} 
          className="w-full h-auto object-cover block"
        />
        
        {/* Editor controls overlay */}
        <div className="absolute top-2 right-2 bg-slate-900/90 text-white rounded-xl px-2.5 py-1.5 text-xs flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 select-none shadow-md">
          <span className="font-bold text-slate-400">Size:</span>
          <button type="button" onClick={() => handleWidth("25%")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.width === "25%" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>25%</button>
          <button type="button" onClick={() => handleWidth("50%")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.width === "50%" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>50%</button>
          <button type="button" onClick={() => handleWidth("75%")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.width === "75%" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>75%</button>
          <button type="button" onClick={() => handleWidth("100%")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.width === "100%" || !node.attrs.width ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>100%</button>
          
          <span className="text-slate-700">|</span>
          
          <span className="font-bold text-slate-400">Align:</span>
          <button type="button" onClick={() => handleAlign("left")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.align === "left" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>L</button>
          <button type="button" onClick={() => handleAlign("center")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.align === "center" || !node.attrs.align ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>C</button>
          <button type="button" onClick={() => handleAlign("right")} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${node.attrs.align === "right" ? "bg-amber-500 text-slate-950 font-bold" : "hover:bg-white/10"}`}>R</button>
        </div>

        {/* Captions Block */}
        <div className="p-2.5 bg-slate-100/80 border-t border-slate-200">
          <input
            type="text"
            placeholder="Write a caption for this image..."
            value={node.attrs.caption || ""}
            onChange={handleCaption}
            className="w-full bg-transparent border-0 outline-none text-xs text-slate-600 text-center font-medium italic placeholder-slate-400 focus:placeholder-transparent"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; max-width: 100%;`,
        }),
      },
      caption: {
        default: "",
        renderHTML: (attributes) => ({
          "data-caption": attributes.caption,
        }),
      },
      align: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure.custom-image-figure",
        getAttrs: (element) => {
          const img = element.querySelector("img");
          const caption = element.querySelector("figcaption");
          return {
            src: img ? img.getAttribute("src") : null,
            alt: img ? img.getAttribute("alt") : null,
            width: element.style.width || "100%",
            caption: caption ? caption.textContent : "",
            align: element.getAttribute("data-align") || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          alt: element.getAttribute("alt"),
          width: element.getAttribute("data-width") || "100%",
          caption: element.getAttribute("data-caption") || "",
          align: element.getAttribute("data-align") || "center",
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, width, caption, align } = HTMLAttributes;
    const alignClass = 
      align === "left" ? "mr-auto ml-0" :
      align === "right" ? "ml-auto mr-0" : "mx-auto";

    return [
      "figure",
      {
        class: `custom-image-figure ${alignClass} my-6 block overflow-hidden rounded-xl border border-slate-100 shadow-sm text-center`,
        style: `width: ${width || "100%"}; max-width: 100%;`,
        "data-align": align,
      },
      ["img", { src, alt, class: "w-full h-auto object-cover block" }],
      caption
        ? [
            "figcaption",
            {
              class: "p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium italic leading-relaxed",
            },
            caption,
          ]
        : "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// ==========================================
// 2. BREAKING NEWS BLOCK
// ==========================================

const BreakingNewsNodeView = () => {
  return (
    <NodeViewWrapper className="breaking-news-editor-block border-2 border-red-650 rounded-xl my-5 overflow-hidden shadow-sm">
      <div className="bg-red-650 text-white font-extrabold px-4 py-2 text-xs uppercase flex items-center gap-2 select-none tracking-wider">
        <span>🚨</span> Breaking News
      </div>
      <div className="p-4 bg-red-50/20">
        <NodeViewContent className="outline-none min-h-[40px] prose prose-sm max-w-none text-slate-800" />
      </div>
    </NodeViewWrapper>
  );
};

export const BreakingNews = Node.create({
  name: "breakingNews",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="breaking-news"]',
        contentElement: ".custom-breaking-news-content",
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      { "data-type": "breaking-news", class: "custom-breaking-news" },
      ["div", { class: "custom-breaking-news-header", contenteditable: "false" }, "🚨 Breaking News"],
      ["div", { class: "custom-breaking-news-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BreakingNewsNodeView);
  },
});

// ==========================================
// 3. QUICK FACTS BLOCK
// ==========================================

const QuickFactsNodeView = () => {
  return (
    <NodeViewWrapper className="quick-facts-editor-block border border-amber-500/70 rounded-xl my-5 overflow-hidden shadow-sm bg-amber-50/10">
      <div className="bg-amber-500 text-slate-950 font-black px-4 py-2 text-xs uppercase flex items-center gap-2 select-none tracking-wider">
        <span>📌</span> Quick Facts
      </div>
      <div className="p-4">
        <NodeViewContent className="outline-none min-h-[40px] prose prose-sm max-w-none text-slate-800" />
      </div>
    </NodeViewWrapper>
  );
};

export const QuickFacts = Node.create({
  name: "quickFacts",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="quick-facts"]',
        contentElement: ".custom-quick-facts-content",
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      { "data-type": "quick-facts", class: "custom-quick-facts" },
      ["div", { class: "custom-quick-facts-header", contenteditable: "false" }, "📌 Quick Facts"],
      ["div", { class: "custom-quick-facts-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(QuickFactsNodeView);
  },
});

// ==========================================
// 4. KEY TAKEAWAYS BLOCK
// ==========================================

const KeyTakeawaysNodeView = () => {
  return (
    <NodeViewWrapper className="key-takeaways-editor-block border border-indigo-500/60 rounded-xl my-5 overflow-hidden shadow-sm bg-indigo-50/5">
      <div className="bg-indigo-600 text-white font-extrabold px-4 py-2 text-xs uppercase flex items-center gap-2 select-none tracking-wider">
        Key Takeaways
      </div>
      <div className="p-4">
        <NodeViewContent className="outline-none min-h-[40px] prose prose-sm max-w-none text-slate-800" />
      </div>
    </NodeViewWrapper>
  );
};

export const KeyTakeaways = Node.create({
  name: "keyTakeaways",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="key-takeaways"]',
        contentElement: ".custom-key-takeaways-content",
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      { "data-type": "key-takeaways", class: "custom-key-takeaways" },
      ["div", { class: "custom-key-takeaways-header", contenteditable: "false" }, "Key Takeaways"],
      ["div", { class: "custom-key-takeaways-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KeyTakeawaysNodeView);
  },
});

// ==========================================
// 5. PULL QUOTE BLOCK
// ==========================================

const PullQuoteNodeView = () => {
  return (
    <NodeViewWrapper className="pull-quote-editor-block border-y border-amber-500/40 py-6 my-6 text-center bg-slate-50/30">
      <NodeViewContent className="outline-none text-xl font-serif italic text-slate-800 leading-relaxed max-w-2xl mx-auto focus:ring-1 focus:ring-amber-500/20 p-2 rounded" />
    </NodeViewWrapper>
  );
};

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'blockquote[data-type="pull-quote"]',
      },
    ];
  },

  renderHTML() {
    return [
      "blockquote",
      { "data-type": "pull-quote", class: "custom-pull-quote" },
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteNodeView);
  },
});

// ==========================================
// 6. RELATED STORY BLOCK
// ==========================================

const RelatedStoryNodeView = ({ node, updateAttributes }) => {
  const [isEditing, setIsEditing] = useState(!node.attrs.title || !node.attrs.url);

  return (
    <NodeViewWrapper className="related-story-editor-block border border-slate-200 bg-slate-50/50 p-4 rounded-xl my-4 select-none">
      {isEditing ? (
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Add Related Story Link</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Article Title (e.g. Major Market Shift)"
              value={node.attrs.title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 transition"
            />
            <input
              type="text"
              placeholder="Article URL (e.g. /news/major-market-shift)"
              value={node.attrs.url}
              onChange={(e) => updateAttributes({ url: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 transition"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition cursor-pointer"
            >
              Done & Preview
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-500 font-bold uppercase tracking-wider text-xs">Read Also →</span>
            <a
              href={node.attrs.url}
              onClick={(e) => e.preventDefault()}
              className="font-bold text-slate-850 hover:text-amber-600 border-b border-dashed border-slate-300 hover:border-amber-500 transition"
            >
              {node.attrs.title || "Untitled Article"}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[10px] font-bold border border-slate-200 px-2.5 py-1.5 rounded-lg bg-white transition cursor-pointer"
          >
            Edit Link
          </button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const RelatedStory = Node.create({
  name: "relatedStory",
  group: "block",
  atom: true, // it's an atom / leaf node

  addAttributes() {
    return {
      title: { default: "" },
      url: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="related-story"]',
        getAttrs: (element) => ({
          title: element.getAttribute("data-title"),
          url: element.getAttribute("data-url"),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "div",
      {
        "data-type": "related-story",
        "data-title": node.attrs.title,
        "data-url": node.attrs.url,
        class: "custom-related-story",
      },
      [
        "a",
        {
          href: node.attrs.url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "custom-related-story-link",
        },
        `Read Also → ${node.attrs.title || ""}`,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RelatedStoryNodeView);
  },
});

// ==========================================
// 7. CALLOUT BOX BLOCK (INFO / WARNING)
// ==========================================

const CalloutBoxNodeView = ({ node, updateAttributes }) => {
  const type = node.attrs.type || "info";
  const isWarning = type === "warning";
  
  const borderColor = isWarning ? "border-amber-500" : "border-indigo-500";
  const emoji = isWarning ? "⚠️" : "💡";

  return (
    <NodeViewWrapper className={`callout-editor-block border-l-4 ${borderColor} bg-slate-50/50 my-5 p-4 rounded-r-xl relative group`}>
      {/* Type switcher overlay */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 select-none bg-white border border-slate-100 shadow-sm p-1 rounded-lg">
        <button
          type="button"
          onClick={() => updateAttributes({ type: "info" })}
          className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${type === "info" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
        >
          Info
        </button>
        <button
          type="button"
          onClick={() => updateAttributes({ type: "warning" })}
          className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${type === "warning" ? "bg-amber-550 text-amber-950 font-bold bg-amber-500/10" : "text-slate-500 hover:bg-slate-50"}`}
        >
          Warning
        </button>
      </div>
      
      <div className="flex gap-3 text-slate-800">
        <span className="select-none font-bold text-lg leading-none">{emoji}</span>
        <div className="flex-grow">
          <NodeViewContent className="outline-none min-h-[30px] prose prose-sm max-w-none text-slate-800" />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const CalloutBox = Node.create({
  name: "calloutBox",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      type: { default: "info" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout-box"]',
        getAttrs: (element) => ({
          type: element.getAttribute("data-callout-type") || "info",
        }),
        contentElement: ".custom-callout-box-content",
      },
    ];
  },

  renderHTML({ node }) {
    const type = node.attrs.type || "info";
    const emoji = type === "warning" ? "⚠️" : "💡";
    return [
      "div",
      {
        "data-type": "callout-box",
        "data-callout-type": type,
        class: `custom-callout-box custom-callout-box-${type}`,
      },
      ["div", { class: "custom-callout-box-icon", contenteditable: "false" }, emoji],
      ["div", { class: "custom-callout-box-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBoxNodeView);
  },
});
