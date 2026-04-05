import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "./lib/prisma.js";
import { hashPassword, verifyPassword, signToken, verifyToken, TokenPayload } from "./lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Auth middleware ---

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  const payload = verifyToken(header.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token." });
    return;
  }
  req.user = payload;
  next();
}

// --- Health ---

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, service: "blogcraft-backend" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "database_unreachable", details: error });
  }
});

// --- Auth endpoints ---

app.post("/api/auth/register", async (req, res) => {
  const { email, password, confirm } = req.body;

  if (!email || !password || !confirm) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  if (password !== confirm) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const trimmed = email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email: trimmed }, select: { id: true } });
  if (exists) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const user = await prisma.user.create({
    data: { email: trimmed, passwordHash: await hashPassword(password) },
    select: { id: true, email: true },
  });

  const token = signToken(user.id, user.email);
  res.status(201).json({ token, user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signToken(user.id, user.email);
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: { userId: req.user!.userId, email: req.user!.email } });
});

// --- Public posts listing ---

app.get("/api/posts", async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: { id: true, title: true, description: true, tags: true, updatedAt: true, userId: true },
  });
  res.json(posts);
});

// --- Authenticated posts CRUD ---

app.get("/api/user/posts", requireAuth, async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { userId: req.user!.userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, tags: true, updatedAt: true },
  });
  res.json(posts);
});

app.get("/api/user/posts/:id", requireAuth, async (req, res) => {
  const post = await prisma.post.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  });
  if (!post) {
    res.status(404).json({ error: "Post not found." });
    return;
  }
  res.json(post);
});

app.post("/api/user/posts", requireAuth, async (req, res) => {
  const { title, description, body, tags } = req.body;
  const post = await prisma.post.create({
    data: { title, description: description ?? "", body: body ?? "", tags: tags ?? "", userId: req.user!.userId },
  });
  res.status(201).json(post);
});

app.put("/api/user/posts/:id", requireAuth, async (req, res) => {
  const { title, description, body, tags } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { title, description, body, tags },
    });
    res.json(post);
  } catch {
    res.status(404).json({ error: "Post not found." });
  }
});

app.delete("/api/user/posts/:id", requireAuth, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id, userId: req.user!.userId } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "Post not found." });
  }
});

app.listen(port, () => {
  console.log(`BlogCraft backend running on port ${port}`);
});
