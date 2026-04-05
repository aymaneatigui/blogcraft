# BlogCraft

A full-stack blog writing platform with a rich text editor, AI-powered writing assistance, and markdown export.

## What It Does

BlogCraft lets users write, edit, and manage blog posts through a custom-built rich text editor. It supports guest mode (write and export without an account) and authenticated mode (save posts to a personal dashboard).

### Features

- **Rich Text Editor** — Built with TipTap. Supports headings, bold/italic/underline/strikethrough, lists, blockquotes, code blocks, links, images (URL or upload with resize/alignment controls), and text alignment.
- **AI Writing Assistant** — Powered by Google Gemini 2.5 Flash. Three modes: generate a full article from a topic, improve existing content, or continue writing from where you left off. Responses stream in real-time.
- **Templates** — Pre-built blog post templates (How-to Guide, Listicle, Case Study) to get started quickly.
- **Markdown Export** — Download any post as a `.md` file with YAML frontmatter (title, description, tags, date).
- **Dashboard** — Authenticated users can save, edit, and delete posts from a personal dashboard.
- **Guest Mode** — Write and export without creating an account.
- **Live Preview** — Toggle between editor and preview modes.
- **Word & Character Count** — Live stats with estimated reading time.

### Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth/login` | Login |
| `/auth/register` | Registration |
| `/editor` | Rich text editor (guest or authenticated) |
| `/editor?template=how-to` | Editor pre-loaded with a template |
| `/editor/templates` | Template gallery |
| `/dashboard` | Saved posts list (protected) |
| `/dashboard/[id]/edit` | Edit a saved post (protected) |

## Tech Stack

### Frontend

- **Next.js 15** (React 19, TypeScript, App Router, Server Actions)
- **Tailwind CSS 4** — Custom dark theme with cyan accents, no component library
- **TipTap 3** — Rich text editor with custom extensions (resizable images, link handling)
- **Google Generative AI SDK** — Gemini 2.5 Flash for AI features
- **Turndown** — HTML to Markdown conversion

### Backend

- **Express.js 4** (Node.js, TypeScript, ES modules)
- **Prisma 5** — ORM for PostgreSQL
- **PostgreSQL 16** — Database
- **Auth** — scrypt password hashing, HMAC-SHA256 token signing, httpOnly cookies

### Infrastructure

- **Docker Compose** — 3 services: `db` (Postgres), `backend` (Express), `frontend` (Next.js)
- **Monorepo** — npm workspaces with `packages/frontend` and `packages/backend`

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check + DB connectivity |
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Authenticate |
| `GET` | `/api/auth/me` | Yes | Current user info |
| `GET` | `/api/posts` | No | Public posts listing |
| `GET` | `/api/user/posts` | Yes | Current user's posts |
| `GET` | `/api/user/posts/:id` | Yes | Single post (owned) |
| `POST` | `/api/user/posts` | Yes | Create post |
| `PUT` | `/api/user/posts/:id` | Yes | Update post |
| `DELETE` | `/api/user/posts/:id` | Yes | Delete post |

## Database Schema

```
User: id, email (unique), passwordHash, createdAt
Post: id, title, description, body, tags, createdAt, updatedAt, userId (FK → User)
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+

### Setup

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env — set SESSION_SECRET and optionally GEMINI_API_KEY

# 2. Start all services
docker compose up --build

# 3. Push the database schema
docker compose exec backend npx prisma db push

# 4. Seed a demo account
docker compose exec backend npx tsx prisma/seed.ts
```

### Local Development (without Docker)

```bash
# Start a local Postgres on port 5433, then:
cd packages/backend && npm run dev
cd packages/frontend && npm run dev
```

### Ports

| Service | Port |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:4000` |
| PostgreSQL | `localhost:5433` |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret for HMAC token signing |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI features |
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL for browser requests |
| `API_URL` | Docker only | Backend URL for server-side requests (e.g. `http://backend:4000`) |
