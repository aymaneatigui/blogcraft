"use client";

import { useEffect, useRef, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { EditorTopbar } from "./EditorTopbar";
import { EditorSidebar } from "./EditorSidebar";
import { Preview } from "./Preview";
import { DEFAULT_TEMPLATES } from "../templates-data";

interface BlogEditorProps {
  isLoggedIn: boolean;
  selectedTemplateId?: string;
  initialData?: {
    id: string;
    title: string;
    description: string;
    body: string;
    tags: string;
  };
}

type EditorSnapshot = {
  title: string;
  description: string;
  body: string;
  tags: string[];
};

export function BlogEditor({
  isLoggedIn,
  selectedTemplateId,
  initialData,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [tags, setTags] = useState<string[]>(
    initialData?.tags
      ? initialData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiMode, setAiMode] = useState<"generate" | "improve" | "continue">(
    "generate",
  );
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [lastClearedSnapshot, setLastClearedSnapshot] =
    useState<EditorSnapshot | null>(null);
  const [recoverNotice, setRecoverNotice] = useState<string | null>(null);

  const isFullyCleared =
    title.trim() === "" &&
    description.trim() === "" &&
    body.trim() === "" &&
    tags.length === 0;

  function applyTemplate(templateId: string) {
    const template = DEFAULT_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    setTitle(template.title);
    setDescription(template.description);
    setBody(template.body);
    setTags(template.tags);
    setIsPreview(false);
  }

  useEffect(() => {
    if (!selectedTemplateId || initialData?.id) return;
    applyTemplate(selectedTemplateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId, initialData?.id]);

  function clearEverything() {
    setLastClearedSnapshot({ title, description, body, tags: [...tags] });
    setTitle("");
    setDescription("");
    setBody("");
    setTags([]);
    setIsPreview(false);
    setIsConfirmClearOpen(false);
    setRecoverNotice("Cleared. Press Cmd/Ctrl+Z to restore.");
  }

  useEffect(() => {
    if (!recoverNotice) return;
    const timeoutId = window.setTimeout(() => setRecoverNotice(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [recoverNotice]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const undoPressed =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z";
      if (!undoPressed || !lastClearedSnapshot || !isFullyCleared) return;

      event.preventDefault();
      setTitle(lastClearedSnapshot.title);
      setDescription(lastClearedSnapshot.description);
      setBody(lastClearedSnapshot.body);
      setTags(lastClearedSnapshot.tags);
      setLastClearedSnapshot(null);
      setRecoverNotice("Previous content restored.");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullyCleared, lastClearedSnapshot]);

  function handleAiAction(mode: "generate" | "improve" | "continue") {
    setAiMode(mode);
    if (mode === "generate") {
      setAiPromptOpen(true);
    } else {
      runAi(mode, body);
    }
  }

  async function runAi(mode: "generate" | "improve" | "continue", prompt: string) {
    setIsAiLoading(true);
    setAiPromptOpen(false);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "AI generation failed");
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let fullText = mode === "continue" ? body : "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setBody(fullText);
      }
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const { savePost, updatePost } = await import("@/app/dashboard/actions");
      const tagsStr = tags.join(", ");
      if (initialData?.id) {
        await updatePost(initialData.id, {
          title,
          description,
          body,
          tags: tagsStr,
        });
      } else {
        await savePost({ title, description, body, tags: tagsStr });
      }
    } catch {
      // handle error silently
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorTopbar
        title={title}
        description={description}
        tags={tags.join(", ")}
        body={body}
        isLoggedIn={isLoggedIn}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        isSaving={isSaving}
        onSave={handleSave}
        onRequestClear={() => setIsConfirmClearOpen(true)}
        onAiAction={handleAiAction}
        isAiLoading={isAiLoading}
      />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          tags={tags}
          setTags={setTags}
          isLoggedIn={isLoggedIn}
        />
        <div className="flex-1 overflow-y-auto">
          {isPreview ? (
            <Preview title={title} description={description} body={body} tags={tags} />
          ) : (
            <div className="flex h-full flex-col p-4">
              <RichTextEditor value={body} onChange={setBody} />
            </div>
          )}
        </div>
      </div>

      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/12 bg-[#13141a] p-5 shadow-2xl shadow-black/70">
            <h2 className="text-base font-semibold text-white">Clear everything?</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              This will remove title, description, tags, and editor content. You can
              restore it right away with Cmd/Ctrl+Z.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="cursor-pointer rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={clearEverything}
                className="cursor-pointer rounded-full border border-red-400/35 bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/25"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {recoverNotice && (
        <div className="fixed bottom-5 right-5 z-82 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3.5 py-2 text-xs text-cyan-100 shadow-xl">
          {recoverNotice}
        </div>
      )}

      {aiPromptOpen && (
        <AiPromptDialog
          mode={aiMode}
          onSubmit={(prompt) => runAi(aiMode, prompt)}
          onCancel={() => setAiPromptOpen(false)}
        />
      )}
    </div>
  );
}

function AiPromptDialog({
  mode,
  onSubmit,
  onCancel,
}: {
  mode: string;
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  function handleSubmit() {
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <>
      <div className="fixed inset-0 z-80 bg-black/55 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 z-81 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#141418] shadow-2xl shadow-black/70">
        <div className="px-6 pt-6 pb-4">
          <div className="mb-1 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <p className="text-[14px] font-semibold text-white">
              {mode === "generate"
                ? "Generate Article with AI"
                : mode === "improve"
                  ? "Improve Content"
                  : "Continue Writing"}
            </p>
          </div>
          <p className="mb-3 text-[12px] text-zinc-500">
            Describe what you want to write about. Be specific for better results.
          </p>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") onCancel();
            }}
            rows={4}
            placeholder="e.g. A beginner's guide to building REST APIs with Node.js and Express, covering routing, middleware, error handling, and deployment..."
            className="w-full resize-none rounded-lg border border-white/10 bg-white/4 px-3.5 py-2.5 text-[13px] text-white/85 outline-none placeholder:text-white/22 focus:border-white/20 focus:bg-white/6 transition-all"
          />
        </div>
        <div className="flex items-center justify-between border-t border-white/6 px-6 py-4">
          <span className="text-[10px] text-zinc-600">Cmd/Ctrl+Enter to submit</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[12px] font-medium text-white/60 transition-all hover:bg-white/8 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="cursor-pointer rounded-full border border-purple-500/25 bg-purple-500/15 px-4 py-2 text-[12px] font-medium text-purple-300 transition-all hover:bg-purple-500/25 disabled:opacity-40"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
