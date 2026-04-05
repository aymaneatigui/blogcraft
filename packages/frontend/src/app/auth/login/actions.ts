"use server";

import { api } from "@/lib/api";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(_prev: unknown, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "All fields are required." };

  const { data, error } = await api<{ token: string; user: { id: string; email: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );

  if (error || !data) return { error: error ?? "Invalid email or password." };

  await createSession(data.token);
  redirect("/dashboard");
}
