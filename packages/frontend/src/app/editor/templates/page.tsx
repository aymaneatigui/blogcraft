import Link from "next/link";
import { DEFAULT_TEMPLATES } from "../templates-data";

export default function EditorTemplatesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
              Templates
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Start from an example
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Pick a template and we will open the editor with starter content
              ready.
            </p>
          </div>
          <Link
            href="/editor"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Blank editor
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_TEMPLATES.map((template) => (
            <article
              key={template.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60"
            >
              <div
                role="img"
                aria-label={template.previewAlt}
                className="h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${template.previewImage})` }}
              />
              <div className="flex h-full flex-col p-5">
                <h2 className="text-lg font-semibold text-white">{template.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {template.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[10px] uppercase tracking-wide text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/editor?template=${template.id}`}
                  className="mt-auto inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/20"
                >
                  Use this template
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
