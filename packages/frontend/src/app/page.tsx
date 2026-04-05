import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="home-shell relative min-h-screen overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="fade-up flex items-center justify-between rounded-2xl border border-(--border-color)/70 bg-black/20 px-4 py-3 backdrop-blur-xl sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--white)">
            BlogCraft
          </p>
          <Link
            href={session ? "/dashboard" : "/auth/login"}
            className="rounded-full border border-(--border-color) px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-(--light-gray) transition-colors hover:border-(--white) hover:text-(--white)"
          >
            {session ? "Open Dashboard" : "Sign In"}
          </Link>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="fade-up fade-up-delay-1 space-y-7">
            <p className="inline-flex rounded-full border border-(--border-color) bg-black/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-(--accent)">
              Easy blog writing tool
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-(--white) sm:text-5xl lg:text-6xl">
              Write your post in minutes
              <span className="block bg-[linear-gradient(120deg,var(--accent-strong),#9efec7)] bg-clip-text text-transparent">
                with templates and AI.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-(--light-gray) sm:text-lg">
              Choose a template, let AI help you write, and export your post.
              If you create an account, your posts are saved in your personal list.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/editor"
                className="rounded-full bg-(--accent-strong) px-6 py-3 text-sm font-semibold text-(--background) transition-transform duration-300 hover:scale-[1.03]"
              >
                Start Writing
              </Link>
              <Link
                href="/editor/templates"
                className="rounded-full border border-(--border-color) px-6 py-3 text-sm font-medium text-(--white) transition-colors hover:border-(--white)"
              >
                Browse Templates
              </Link>
              <Link
                href={session ? "/dashboard" : "/auth/register"}
                className="rounded-full border border-(--border-color) px-6 py-3 text-sm font-medium text-(--white) transition-colors hover:border-(--white)"
              >
                {session ? "My Saved Posts" : "Create Account"}
              </Link>
            </div>
          </div>

          <div className="fade-up fade-up-delay-2">
            <div className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-[linear-gradient(160deg,rgba(0,0,0,0.68),rgba(0,191,255,0.13))] p-5 shadow-[0_24px_80px_rgba(0,191,255,0.13)] sm:p-6">
              <p className="mb-4 text-sm font-semibold text-(--white)">
                How it works
              </p>
              <div className="space-y-2.5 text-sm text-(--light-gray)">
                <p className="rounded-lg border border-(--border-color)/70 bg-black/30 px-3 py-2">
                  1. Pick a template or start blank.
                </p>
                <p className="rounded-lg border border-(--border-color)/70 bg-black/30 px-3 py-2">
                  2. Write with AI help when you need ideas.
                </p>
                <p className="rounded-lg border border-(--border-color)/70 bg-black/30 px-3 py-2">
                  3. Export Markdown or save posts in your account.
                </p>
              </div>

              <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                Tip: Use the Templates button in the editor to begin even faster.
              </div>
            </div>
          </div>
        </section>

        <section className="fade-up fade-up-delay-3 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-(--border-color)/80 bg-black/20 p-5">
            <h2 className="text-lg font-semibold text-(--white)">AI Writing</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--light-gray)">
              Generate ideas, improve your draft, or continue writing with one click.
            </p>
          </article>
          <article className="rounded-2xl border border-(--border-color)/80 bg-black/20 p-5">
            <h2 className="text-lg font-semibold text-(--white)">Templates</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--light-gray)">
              Choose a ready example with text and images, then edit it to match your topic.
            </p>
          </article>
          <article className="rounded-2xl border border-(--border-color)/80 bg-black/20 p-5">
            <h2 className="text-lg font-semibold text-(--white)">Saved List</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--light-gray)">
              Sign in to store your posts list in the dashboard and continue later.
            </p>
          </article>
        </section>

        <footer className="fade-up fade-up-delay-3 rounded-2xl border border-(--border-color)/80 bg-black/20 px-5 py-4 text-sm text-(--light-gray)">
          <p>
            Need a custom website for your business? Visit{" "}
            <a
              href="https://atigui.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-(--white) underline decoration-cyan-300/50 underline-offset-4 transition-colors hover:text-(--accent-strong)"
            >
              atigui.com
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
