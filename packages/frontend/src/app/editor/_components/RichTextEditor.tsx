"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ResizableImage } from "./ResizableImage";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useRef, useState, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function PromptDialog({
  open,
  title,
  placeholder,
  secondaryPlaceholder,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  title: string;
  placeholder?: string;
  secondaryPlaceholder?: string;
  submitLabel?: string;
  onSubmit: (value: string, secondaryValue: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setSecondaryValue("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed, secondaryValue.trim());
    else onCancel();
  }

  return (
    <>
      <div className="fixed inset-0 z-80 bg-black/55 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 z-81 w-full max-w-105 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#141418] shadow-2xl shadow-black/70">
        <div className="px-6 pt-6 pb-4">
          <p className="mb-3 text-[14px] font-semibold text-white">{title}</p>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
              if (e.key === "Escape") onCancel();
            }}
            placeholder={placeholder ?? "https://..."}
            className="w-full rounded-lg border border-white/10 bg-white/4 px-3.5 py-2.5 text-[13px] text-white/85 outline-none placeholder:text-white/22 focus:border-white/20 focus:bg-white/6 transition-all"
          />
          {secondaryPlaceholder && (
            <input
              value={secondaryValue}
              onChange={(e) => setSecondaryValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
                if (e.key === "Escape") onCancel();
              }}
              placeholder={secondaryPlaceholder}
              className="mt-2.5 w-full rounded-lg border border-white/10 bg-white/4 px-3.5 py-2.5 text-[13px] text-white/85 outline-none placeholder:text-white/22 focus:border-white/20 focus:bg-white/6 transition-all"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-white/6 px-6 py-4">
          <button type="button" onClick={onCancel} className="cursor-pointer rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[12px] font-medium text-white/60 transition-all hover:bg-white/8 hover:text-white">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="cursor-pointer rounded-full border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 py-2 text-[12px] font-medium text-[#00F0FF] transition-all hover:bg-[#00F0FF]/18">
            {submitLabel ?? "Insert"}
          </button>
        </div>
      </div>
    </>
  );
}

function ToolbarButton({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-100 ${
        active ? "bg-[#00F0FF]/12 text-[#00F0FF] ring-1 ring-inset ring-[#00F0FF]/25" : "text-white/45 hover:bg-white/7 hover:text-white/85"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-white/8" />;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isExternalUpdate = useRef(false);
  const [prompt, setPrompt] = useState<{
    title: string;
    placeholder?: string;
    secondaryPlaceholder?: string;
    submitLabel?: string;
    onSubmit: (value: string, secondaryValue: string) => void;
  } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [stats, setStats] = useState({ words: 0, characters: 0 });

  const updateStats = useCallback((text: string) => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    setStats({ words, characters: text.length });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      ResizableImage.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your post..." }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) onChange(editor.getHTML());
      updateStats(editor.getText());
    },
    editorProps: { attributes: { class: "prose-editor outline-none" } },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      isExternalUpdate.current = true;
      editor.commands.setContent(value, { emitUpdate: false });
      isExternalUpdate.current = false;
      updateStats(editor.getText());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, updateStats]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const addImage = useCallback(() => {
    setPrompt({
      title: "Insert image from URL",
      placeholder: "https://example.com/image.jpg",
      secondaryPlaceholder: "Optional alt text",
      submitLabel: "Insert Image",
      onSubmit: (url, altText) => {
        if (!isValidHttpUrl(url)) {
          setNotice("Please enter a valid http(s) image URL.");
          return;
        }
        setPrompt(null);
        editor?.chain().focus().setImage({ src: url, alt: altText || undefined }).run();
      },
    });
  }, [editor]);

  const uploadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (src && editor) editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const addLink = useCallback(() => {
    setPrompt({
      title: "Insert link URL",
      placeholder: "https://...",
      submitLabel: "Add Link",
      onSubmit: (url) => {
        if (!isValidHttpUrl(url)) {
          setNotice("Please enter a valid http(s) URL.");
          return;
        }
        setPrompt(null);
        editor?.chain().focus().setLink({ href: url }).run();
      },
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/8 bg-[#0d0e13]">
        <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-white/6 bg-[#0e0e11] px-3 py-2">
          <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <span className="font-mono text-[12px] font-bold leading-none">H2</span>
          </ToolbarButton>
          <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <span className="font-mono text-[12px] font-bold leading-none">H3</span>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z" /><path d="M6 12h9a4 4 0 0 1 0 8H6z" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="21" x2="20" y2="21" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h11" /><path d="M9 4v2a3 3 0 0 1-.88 2.12L4 12" /><path d="m14 14 6 6" /><path d="m20 14-6 6" /></svg>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="4" cy="7" r="1.2" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="4" cy="17" r="1.2" fill="currentColor" stroke="none" /><line x1="8" y1="7" x2="21" y2="7" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="17" x2="21" y2="17" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1c0 3-1 4-2 4v2z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1c0 3-1 4-2 4v2z" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2.5" /><path d="m8 10-3 2 3 2" /><path d="m16 10 3 2-3 2" /><path d="m12 8-2 8" /></svg>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Link" active={editor.isActive("link")} onClick={addLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /><path d="m3 3 18 18" /></svg>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Image from URL" onClick={addImage}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Upload image" onClick={() => fileInputRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          </ToolbarButton>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadImage(file); e.target.value = ""; }} />
          <ToolbarDivider />
          <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="8" x2="7" y2="8" /><line x1="3" y1="16" x2="7" y2="16" /></svg>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="14" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="5" y1="18" x2="19" y2="18" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" /></svg>
          </ToolbarButton>
          <ToolbarButton title="Align justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </ToolbarButton>
          <div className="ml-auto flex items-center gap-0.5 border-l border-white/8 pl-2">
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></svg>
            </ToolbarButton>
          </div>
        </div>

        <style>{`
          .prose-editor p{margin-bottom:1.2em;font-size:1rem;line-height:1.8;color:rgba(255,255,255,0.65);}
          .prose-editor h2{font-size:1.4rem;font-weight:700;color:#fff;margin-top:2em;margin-bottom:0.6em;letter-spacing:-0.01em;}
          .prose-editor h3{font-size:1.15rem;font-weight:600;color:#fff;margin-top:1.6em;margin-bottom:0.5em;}
          .prose-editor strong{color:#fff;font-weight:600;}
          .prose-editor em{font-style:italic;}
          .prose-editor u{text-decoration:underline;text-underline-offset:3px;}
          .prose-editor s{text-decoration:line-through;}
          .prose-editor ul{list-style-type:disc;padding-left:1.5em;margin-bottom:1.2em;color:rgba(255,255,255,0.65);}
          .prose-editor ol{list-style-type:decimal;padding-left:1.5em;margin-bottom:1.2em;color:rgba(255,255,255,0.65);}
          .prose-editor li{margin-bottom:0.3em;font-size:1rem;line-height:1.7;}
          .prose-editor li p{margin-bottom:0;}
          .prose-editor code{font-family:ui-monospace,monospace;font-size:0.85em;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:0.1em 0.4em;color:#00F0FF;}
          .prose-editor pre{background:#080910;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem 1.25rem;overflow-x:auto;margin:1.2em 0;}
          .prose-editor pre code{background:none;border:none;padding:0;color:#b3b3b3;font-size:0.875rem;}
          .prose-editor blockquote{border-left:2px solid #00F0FF;background:rgba(0,240,255,0.04);padding:0.8rem 1.1rem;margin:1.2em 0;border-radius:0 8px 8px 0;}
          .prose-editor blockquote p{margin-bottom:0;font-style:italic;}
          .prose-editor a{color:#00F0FF;text-decoration:underline;text-underline-offset:3px;}
          .prose-editor hr{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:1.8em 0;}
          .prose-editor p.is-editor-empty:first-child::before{content:attr(data-placeholder);color:rgba(255,255,255,0.18);pointer-events:none;float:left;height:0;}
        `}</style>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <EditorContent editor={editor} className="prose-editor outline-none" />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/6 bg-[#0b0c11] px-4 py-2.5 text-[11px] text-white/45">
          <p>
            {stats.words} words · {stats.characters} characters · {Math.max(1, Math.ceil(stats.words / 200))} min read
          </p>
          <p>Tip: Select text before adding a link.</p>
        </div>
      </div>

      {notice && (
        <div className="fixed bottom-5 right-5 z-82 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-200 shadow-xl">
          {notice}
        </div>
      )}

      <PromptDialog
        open={!!prompt}
        title={prompt?.title ?? ""}
        placeholder={prompt?.placeholder}
        secondaryPlaceholder={prompt?.secondaryPlaceholder}
        submitLabel={prompt?.submitLabel}
        onSubmit={prompt?.onSubmit ?? (() => {})}
        onCancel={() => setPrompt(null)}
      />
    </>
  );
}
