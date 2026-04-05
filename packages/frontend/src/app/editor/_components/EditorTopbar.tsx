"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { buildMarkdownFile } from "@/lib/markdown";

interface EditorTopbarProps {
  title: string;
  description: string;
  tags: string;
  body: string;
  isLoggedIn: boolean;
  isPreview: boolean;
  setIsPreview: (v: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  onRequestClear: () => void;
  onAiAction: (mode: "generate" | "improve" | "continue") => void;
  isAiLoading: boolean;
}

export function EditorTopbar({
  title,
  description,
  tags,
  body,
  isLoggedIn,
  isPreview,
  setIsPreview,
  isSaving,
  onSave,
  onRequestClear,
  onAiAction,
  isAiLoading,
}: EditorTopbarProps) {
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  function handleExport() {
    const content = buildMarkdownFile(title, description, tags, body);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-") || "post"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-6 py-3">
      <Link
        href="/"
        className="text-[12px] text-zinc-400 transition-colors hover:text-zinc-200"
      >
        BlogCraft
      </Link>
      <span className="text-[12px] text-zinc-700">/</span>
      <span className="max-w-50 truncate text-[12px] text-zinc-300">
        {title || "Untitled"}
      </span>

      <div className="ml-auto flex items-center gap-3">
        {/* AI Write */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAiMenuOpen(!aiMenuOpen)}
            disabled={isAiLoading}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-[11px] font-medium text-purple-300 transition-all hover:bg-purple-500/20 disabled:opacity-50"
          >
            {isAiLoading ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            )}
            {isAiLoading ? "Writing..." : "AI Write"}
          </button>
          {aiMenuOpen && (
            <AiDropdown
              onSelect={(mode) => { setAiMenuOpen(false); onAiAction(mode); }}
              onClose={() => setAiMenuOpen(false)}
              hasContent={body.trim().length > 0}
            />
          )}
        </div>

        <Link
          href="/editor/templates"
          className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:text-zinc-100"
        >
          Templates
        </Link>

        {/* Editor / Preview toggle */}
        <div className="flex items-center gap-0.5 rounded-full border border-zinc-700 bg-zinc-900 p-0.5">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ${
              !isPreview ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-150 ${
              isPreview ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Export .md */}
        <button
          type="button"
          onClick={handleExport}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-2 text-[11px] font-medium text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export .md
        </button>

        <button
          type="button"
          onClick={onRequestClear}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-[11px] font-medium text-red-200 transition-all hover:bg-red-500/20"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
            <path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Clear
        </button>

        {/* Save (logged-in only) */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-700 bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-40"
          >
            {isSaving ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

function AiDropdown({
  onSelect,
  onClose,
  hasContent,
}: {
  onSelect: (mode: "generate" | "improve" | "continue") => void;
  onClose: () => void;
  hasContent: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const items = [
    {
      mode: "generate" as const,
      label: "Generate article",
      desc: "Write a full article from a topic",
      always: true,
    },
    {
      mode: "improve" as const,
      label: "Improve content",
      desc: "Rewrite and enhance existing text",
      always: false,
    },
    {
      mode: "continue" as const,
      label: "Continue writing",
      desc: "Extend from where you left off",
      always: false,
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl"
    >
      {items.map((item) => {
        const disabled = !item.always && !hasContent;
        return (
          <button
            key={item.mode}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.mode)}
            className="flex w-full cursor-pointer flex-col px-3.5 py-2.5 text-left transition-colors hover:bg-zinc-800 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span className="text-[12px] font-medium text-zinc-200">{item.label}</span>
            <span className="text-[10px] text-zinc-500">{item.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
