import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

turndown.addRule("resizableImage", {
  filter: "img",
  replacement: (_content, node) => {
    const el = node as HTMLElement;
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "";
    return `![${alt}](${src})`;
  },
});

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html);
}

export function buildMarkdownFile(
  title: string,
  description: string,
  tags: string,
  html: string,
): string {
  const md = htmlToMarkdown(html);
  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    tagList.length > 0
      ? `tags: [${tagList.map((t) => `"${t}"`).join(", ")}]`
      : "tags: []",
    `date: ${new Date().toISOString().split("T")[0]}`,
    "---",
    "",
  ].join("\n");
  return frontmatter + md;
}
