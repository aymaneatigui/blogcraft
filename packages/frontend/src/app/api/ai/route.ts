import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a professional blog writing assistant. You generate well-structured blog article content in HTML format suitable for a TipTap rich text editor.

Rules:
- Output ONLY the HTML body content (no wrapping <html>, <body>, or <article> tags)
- Use <h2> and <h3> for headings (never <h1>)
- Use <p> for paragraphs
- Use <ul>/<ol> with <li> for lists
- Use <blockquote> for quotes
- Use <code> for inline code and <pre><code> for code blocks
- Use <strong> for bold and <em> for italic
- Write engaging, clear, and well-organized content
- Include an introduction, structured sections with subheadings, and a conclusion
- Keep a professional but approachable tone
- Aim for 600-1200 words depending on the topic complexity

When a style reference is provided, analyze its structure: heading hierarchy, paragraph length, list usage, tone, and section flow. Mirror that pattern exactly — do not copy any content, only the structural and stylistic approach.

When the user provides a topic or prompt, generate a complete blog article about it.`;

function getOwnerEmail() {
  return (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
}

function getSessionEmail(request: NextRequest): string | null {
  const cookie = request.cookies.get("blog_session")?.value;
  if (!cookie) return null;
  const dot = cookie.lastIndexOf(".");
  if (dot === -1) return null;
  try {
    const payload = JSON.parse(Buffer.from(cookie.slice(0, dot), "base64url").toString()) as {
      email?: string;
      exp?: number;
    };
    if (!payload.email || (payload.exp && payload.exp < Date.now())) return null;
    return payload.email.trim().toLowerCase();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ownerEmail = getOwnerEmail();
    if (ownerEmail) {
      const sessionEmail = getSessionEmail(request);
      if (sessionEmail !== ownerEmail) {
        return new Response(
          JSON.stringify({ error: "Not authorized." }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI is not configured. Add GEMINI_API_KEY to .env" }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const { prompt, mode, example } = (await request.json()) as {
      prompt: string;
      mode: "generate" | "improve" | "continue";
      example?: string;
    };

    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let userPrompt: string;
    if (mode === "improve") {
      userPrompt = `Improve and rewrite the following blog content. Make it more engaging, better structured, and clearer. Return the improved HTML:\n\n${prompt}`;
    } else if (mode === "continue") {
      userPrompt = `Continue writing this blog article from where it left off. Match the tone and style. Return ONLY the new content as HTML (not the existing content):\n\n${prompt}`;
    } else if (example?.trim()) {
      userPrompt = `Write a complete blog article about: ${prompt}

Style/structure reference — mirror the heading hierarchy, paragraph length, section flow, list usage, and overall tone of this example. Do NOT copy any content from it, only the structural and stylistic approach:
--- EXAMPLE START ---
${example.trim()}
--- EXAMPLE END ---`;
    } else {
      userPrompt = `Write a complete blog article about: ${prompt}`;
    }

    const chat = model.startChat({
      systemInstruction: { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    });

    const result = await chat.sendMessageStream(userPrompt);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          console.error("AI stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
