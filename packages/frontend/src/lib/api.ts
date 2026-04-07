import { getToken } from "./session";

/** Server-side URL (Docker: http://backend:4000), falls back to public URL */
const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Render's hostport property returns "host:port" without protocol — ensure https:// is present
const BASE = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;

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

  try {
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
  } catch (err) {
    console.error("[api] fetch error:", `${BASE}${path}`, err);
    return { error: "Could not reach the server. Please try again later.", status: 0 };
  }
}
