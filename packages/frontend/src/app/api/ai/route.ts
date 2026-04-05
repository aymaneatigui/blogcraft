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

When the user provides a topic or prompt, generate a complete blog article about it.`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI is not configured. Add GEMINI_API_KEY to .env" }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const { prompt, mode } = (await request.json()) as {
      prompt: string;
      mode: "generate" | "improve" | "continue";
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
