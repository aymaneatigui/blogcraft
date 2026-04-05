"use server";

import { api } from "@/lib/api";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function register(_prev: unknown, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!email || !password || !confirm) return { error: "All fields are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const { data, error } = await api<{ token: string; user: { id: string; email: string } }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify({ email, password, confirm }) },
  );

  if (error || !data) return { error: error ?? "Registration failed." };

  await createSession(data.token);
  redirect("/dashboard");
}
