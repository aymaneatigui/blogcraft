"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";

interface EditorSidebarProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  isLoggedIn: boolean;
}

export function EditorSidebar({
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  isLoggedIn,
}: EditorSidebarProps) {
  const [tagInput, setTagInput] = useState("");

  function addTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  function removeTag(index: number) {
    setTags(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="flex h-full w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-5">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          Title
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-transparent px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          placeholder="Post title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-transparent px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          placeholder="Short description"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-800 bg-transparent p-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="cursor-pointer text-zinc-500 hover:text-zinc-200"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="min-w-20 flex-1 bg-transparent text-[12px] text-zinc-300 outline-none placeholder:text-zinc-600"
            placeholder={tags.length === 0 ? "Add tags..." : ""}
          />
        </div>
        <p className="mt-1 text-[10px] text-zinc-600">Press Enter or comma to add</p>
      </div>

      {/* Guest banner */}
      {!isLoggedIn && (
        <div className="mt-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-center">
          <p className="text-[12px] text-zinc-400">
            Sign in to save your posts
          </p>
          <Link
            href="/auth/login"
            className="mt-2 inline-block text-[12px] font-medium text-[var(--accent-strong)] hover:underline"
          >
            Sign In
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-auto">
          <Link
            href="/dashboard"
            className="block text-center text-[12px] text-zinc-400 hover:text-zinc-200"
          >
            My Posts
          </Link>
        </div>
      )}
    </div>
  );
}
