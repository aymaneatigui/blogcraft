"use server";

import { api } from "@/lib/api";
import { getSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return session;
}

export async function getUserPosts() {
  await requireAuth();
  const { data, error } = await api<
    { id: string; title: string; description: string; tags: string; updatedAt: string }[]
  >("/api/user/posts");
  if (error) throw new Error(error);
  return data!;
}

export async function savePost(data: {
  title: string;
  description: string;
  body: string;
  tags: string;
}) {
  await requireAuth();
  const { data: post, error } = await api<{ id: string }>("/api/user/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (error || !post) throw new Error(error ?? "Failed to create post.");
  revalidatePath("/dashboard");
  redirect(`/dashboard/${post.id}/edit`);
}

export async function updatePost(
  id: string,
  data: { title: string; description: string; body: string; tags: string },
) {
  await requireAuth();
  const { error } = await api(`/api/user/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (error) throw new Error(error);
  revalidatePath("/dashboard");
}

export async function deletePost(id: string) {
  await requireAuth();
  const { error } = await api(`/api/user/posts/${id}`, { method: "DELETE" });
  if (error) throw new Error(error);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getPostById(id: string) {
  await requireAuth();
  const { data, error } = await api<{
    id: string;
    title: string;
    description: string;
    body: string;
    tags: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
  }>(`/api/user/posts/${id}`);
  if (error) return null;
  return data!;
}

export async function logout() {
  await clearSession();
  redirect("/");
}
