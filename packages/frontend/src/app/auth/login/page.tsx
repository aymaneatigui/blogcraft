"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-[var(--white)]">Sign In</h1>

        <form action={formAction} className="flex flex-col gap-4">
          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {state.error}
            </p>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none placeholder:text-[var(--light-gray)]/40 focus:border-[var(--accent)]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none placeholder:text-[var(--light-gray)]/40 focus:border-[var(--accent)]"
          />

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-full bg-[var(--accent-strong)] py-3 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--light-gray)]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[var(--accent-strong)] hover:underline">
            Register
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-[var(--light-gray)]/60">
          or{" "}
          <Link href="/editor" className="text-[var(--accent)] hover:underline">
            continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
