"use client";

interface PreviewProps {
  title: string;
  description: string;
  body: string;
  tags: string[];
}

export function Preview({ title, description, body, tags }: PreviewProps) {
  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {title && (
        <h1 className="mb-3 text-3xl font-bold leading-tight text-white">
          {title}
        </h1>
      )}

      {description && (
        <p className="mb-8 text-lg text-zinc-400">{description}</p>
      )}

      <div
        className="prose-preview"
        dangerouslySetInnerHTML={{ __html: body }}
      />

      <style>{`
        .prose-preview p{margin-bottom:1.2em;font-size:1rem;line-height:1.8;color:rgba(255,255,255,0.65);}
        .prose-preview h2{font-size:1.4rem;font-weight:700;color:#fff;margin-top:2em;margin-bottom:0.6em;}
        .prose-preview h3{font-size:1.15rem;font-weight:600;color:#fff;margin-top:1.6em;margin-bottom:0.5em;}
        .prose-preview strong{color:#fff;font-weight:600;}
        .prose-preview ul{list-style-type:disc;padding-left:1.5em;margin-bottom:1.2em;color:rgba(255,255,255,0.65);}
        .prose-preview ol{list-style-type:decimal;padding-left:1.5em;margin-bottom:1.2em;color:rgba(255,255,255,0.65);}
        .prose-preview li{margin-bottom:0.3em;line-height:1.7;}
        .prose-preview code{font-family:ui-monospace,monospace;font-size:0.85em;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:0.1em 0.4em;color:#00F0FF;}
        .prose-preview pre{background:#080910;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem 1.25rem;overflow-x:auto;margin:1.2em 0;}
        .prose-preview pre code{background:none;border:none;padding:0;color:#b3b3b3;font-size:0.875rem;}
        .prose-preview blockquote{border-left:2px solid #00F0FF;background:rgba(0,240,255,0.04);padding:0.8rem 1.1rem;margin:1.2em 0;border-radius:0 8px 8px 0;}
        .prose-preview blockquote p{margin-bottom:0;font-style:italic;}
        .prose-preview a{color:#00F0FF;text-decoration:underline;}
        .prose-preview hr{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:1.8em 0;}
        .prose-preview img{max-width:100%;border-radius:8px;margin:1em 0;}
      `}</style>
    </div>
  );
}
