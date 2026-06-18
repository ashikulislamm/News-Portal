import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";

import EditorToolbar from "./EditorToolbar";
import {
  CustomImage,
  BreakingNews,
  QuickFacts,
  KeyTakeaways,
  PullQuote,
  RelatedStory,
  CalloutBox,
} from "./extensions/CustomExtensions.jsx";


const RichTextEditor = React.memo(({ value, onChange, placeholder = "Write your article..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "custom-code-block rounded-xl p-4 bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto my-4",
          },
        },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-amber-600 hover:text-amber-700 underline font-semibold transition",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "custom-task-list space-y-1.5 my-4",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "custom-task-item flex items-start gap-2.5",
        },
      }),
      CharacterCount,
      CustomImage,
      BreakingNews,
      QuickFacts,
      KeyTakeaways,
      PullQuote,
      RelatedStory,
      CalloutBox,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[350px] max-h-[600px] overflow-y-auto p-5 text-slate-800",
        placeholder,
      },
    },
  });

  // Sync value from parent if it changes (e.g. initial loads or draft restoration)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML && value !== undefined) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const wordCount = editor?.storage.characterCount.words() || 0;
  const charCount = editor?.storage.characterCount.characters() || 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500/70 transition-all flex flex-col">
      {/* Interactive Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Body */}
      <div className="flex-grow">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Status Bar with Word counts */}
      <div className="flex justify-between items-center bg-slate-50 border-t border-slate-150 px-4 py-2 text-xs font-bold text-slate-500 select-none">
        <div className="flex gap-4">
          <span>Words: <strong className="text-slate-700">{wordCount}</strong></span>
          <span>Characters: <strong className="text-slate-700">{charCount}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span>⏱️ Est. Reading Time:</span>
          <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md font-extrabold">
            {readingTime} {readingTime === 1 ? "min" : "mins"}
          </span>
        </div>
      </div>
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
