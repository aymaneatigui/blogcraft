import { cookies } from "next/headers";

const SESSION_COOKIE = "blog_session";
const EXPIRY_SECONDS = 7 * 24 * 60 * 60;

export interface SessionPayload {
  userId: string;
  email: string;
}

/** Store the backend token in an httpOnly cookie */
export async function createSession(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRY_SECONDS,
  });
}

/** Read the raw token (for API calls) */
export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** Decode the token payload (base64url.sig) to get userId/email */
export async function getSession(): Promise<SessionPayload | null> {
  const token = await getToken();
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.slice(0, dot), "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
