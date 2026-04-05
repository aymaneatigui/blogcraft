import { scrypt, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// --- Password hashing ---

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [hashedPassword, salt] = hash.split(".");
  if (!hashedPassword || !salt) return false;
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hashedPassword, "hex");
  return timingSafeEqual(buf, storedBuf);
}

// --- Token signing (HMAC) ---

export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
}

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set.");
  return s;
}

export function signToken(userId: string, email: string): string {
  const payload: TokenPayload = { userId, email, exp: Date.now() + EXPIRY_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as TokenPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
