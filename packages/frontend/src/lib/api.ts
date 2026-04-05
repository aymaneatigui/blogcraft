import { getToken } from "./session";

/** Server-side URL (Docker: http://backend:4000), falls back to public URL */
const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string; status: number }> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.error || `Request failed (${res.status})`, status: res.status };
  }

  const data = await res.json().catch(() => null);
  return { data: data as T, status: res.status };
}
