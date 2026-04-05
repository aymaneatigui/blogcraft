export interface EditorTemplate {
  id: string;
  label: string;
  title: string;
  description: string;
  previewImage: string;
  previewAlt: string;
  tags: string[];
  body: string;
}

export const DEFAULT_TEMPLATES: EditorTemplate[] = [
  {
    id: "how-to",
    label: "How-to Guide",
    title: "How to Ship Your First Side Project in 14 Days",
    description:
      "A practical step-by-step framework for planning, building, and launching quickly.",
    previewImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    previewAlt: "Team planning a project timeline",
    tags: ["guide", "productivity", "shipping"],
    body: `<h2>Introduction</h2><p>Most projects fail before launch because scope grows too quickly. This guide helps you move from idea to release with a fixed two-week timeline.</p><p><img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" alt="Team planning a project timeline" /></p><h2>Step 1: Define one clear outcome</h2><p>Write one sentence describing what users can do after launch. Keep it measurable and simple.</p><h3>Checklist</h3><ul><li>One user problem</li><li>One target audience</li><li>One core feature</li></ul><h2>Step 2: Build the smallest useful version</h2><p>Focus only on features tied directly to the outcome. Cut everything else.</p><blockquote><p>Progress beats perfection when momentum is your advantage.</p></blockquote><h2>Conclusion</h2><p>Launch early, gather feedback, and iterate from real user behavior.</p>`,
  },
  {
    id: "listicle",
    label: "Listicle",
    title: "7 Writing Habits That Make Your Articles Easier to Read",
    description:
      "Simple writing techniques that improve clarity, flow, and reader retention.",
    previewImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    previewAlt: "Notebook and pen for writing ideas",
    tags: ["writing", "blogging", "content"],
    body: `<h2>1) Start with a strong promise</h2><p>Tell readers exactly what they will learn in the first paragraph.</p><h2>2) Keep paragraphs short</h2><p>Aim for 2-4 lines per paragraph to reduce visual fatigue.</p><h2>3) Use subheadings every 2-3 sections</h2><p>Subheadings help scanners find what matters quickly.</p><p><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" alt="Notebook and pen for writing ideas" /></p><h2>4) Use examples</h2><p>Every abstract point should be paired with a concrete example.</p><h2>5) Remove filler words</h2><p>Trim words that do not add meaning or clarity.</p><h2>6) End sections with a takeaway</h2><p>Summarize the key action the reader should remember.</p><h2>7) Add a clear closing CTA</h2><p>Tell readers what to do next after finishing your article.</p>`,
  },
  {
    id: "case-study",
    label: "Case Study",
    title: "Case Study: How We Increased Newsletter Signups by 42%",
    description:
      "A data-backed breakdown of the experiment, implementation, and results.",
    previewImage:
      "https://images.unsplash.com/photo-1551281044-8b5bd4f0f4a4?auto=format&fit=crop&w=1200&q=80",
    previewAlt: "Analytics dashboard on laptop",
    tags: ["case-study", "growth", "analytics"],
    body: `<h2>Context</h2><p>Our newsletter conversion rate had plateaued for three months despite steady traffic growth.</p><p><img src="https://images.unsplash.com/photo-1551281044-8b5bd4f0f4a4?auto=format&fit=crop&w=1200&q=80" alt="Analytics dashboard on laptop" /></p><h2>Problem</h2><p>The signup form was hard to discover and lacked a compelling value proposition.</p><h2>Approach</h2><ol><li>Repositioned the signup block above the fold.</li><li>Rewrote copy to highlight weekly value.</li><li>Added social proof and preview issues.</li></ol><h2>Result</h2><p>Signups increased by <strong>42%</strong> in 21 days and bounce rate improved by 9%.</p><h2>What we learned</h2><p>Small copy and placement changes can outperform major redesigns when intent is already high.</p>`,
  },
];
