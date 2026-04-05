"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "./actions";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-[var(--white)]">Create Account</h1>

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
            placeholder="Password (min. 8 characters)"
            required
            minLength={8}
            className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none placeholder:text-[var(--light-gray)]/40 focus:border-[var(--accent)]"
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirm password"
            required
            className="rounded-lg border border-[var(--border-color)] bg-transparent px-4 py-3 text-sm text-[var(--white)] outline-none placeholder:text-[var(--light-gray)]/40 focus:border-[var(--accent)]"
          />

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-full bg-[var(--accent-strong)] py-3 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--light-gray)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[var(--accent-strong)] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
