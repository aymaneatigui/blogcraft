import Link from "next/link";
import { getUserPosts, logout, deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const posts = await getUserPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--white)]">My Posts</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="rounded-full bg-[var(--accent-strong)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
          >
            New Post
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">No posts yet.</p>
          <Link
            href="/editor"
            className="mt-3 inline-block text-sm text-[var(--accent-strong)] hover:underline"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-700"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/${post.id}/edit`}
                  className="block truncate text-sm font-medium text-zinc-200 hover:text-white"
                >
                  {post.title || "Untitled"}
                </Link>
                {post.description && (
                  <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                    {post.description}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  {post.tags && (
                    <span className="text-[10px] text-zinc-600">{post.tags}</span>
                  )}
                  <span className="text-[10px] text-zinc-700">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Link
                  href={`/dashboard/${post.id}/edit`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
                >
                  Edit
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] text-red-400/60 transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
