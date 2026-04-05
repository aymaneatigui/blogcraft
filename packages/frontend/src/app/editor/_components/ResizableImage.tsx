import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

const SIZES = ["25%", "50%", "75%", "100%"] as const;
const ALIGNS = ["left", "center", "right"] as const;

const AlignLeftIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="6" y1="18" x2="21" y2="18" />
  </svg>
);

const alignIcons: Record<string, React.ReactNode> = {
  left: <AlignLeftIcon />,
  center: <AlignCenterIcon />,
  right: <AlignRightIcon />,
};

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const { width, align, src, alt } = node.attrs as {
    width: string;
    align: string;
    src: string;
    alt?: string;
  };

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    justifyContent:
      align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
  };

  return (
    <NodeViewWrapper className="relative my-4 block" style={wrapperStyle}>
      {selected && (
        <div className="absolute -top-9 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-white/10 bg-[#0e0e11] px-1 py-0.5 shadow-xl">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                updateAttributes({ width: size });
              }}
              className={`h-6 rounded px-2 font-mono text-[10px] transition-colors ${
                width === size ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
          <div className="mx-0.5 h-4 w-px bg-white/10" />
          {ALIGNS.map((a) => (
            <button
              key={a}
              type="button"
              title={`Align ${a}`}
              onMouseDown={(e) => {
                e.preventDefault();
                updateAttributes({ align: a });
              }}
              className={`flex h-6 items-center justify-center rounded px-2 font-mono text-[10px] transition-colors ${
                align === a ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              {alignIcons[a]}
            </button>
          ))}
        </div>
      )}
      <div
        className={`overflow-hidden rounded-lg border border-white/10 ${selected ? "ring-2 ring-[#00F0FF]/40" : ""}`}
        style={{ width, maxWidth: "100%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          style={{ width: "100%", maxWidth: "100%", display: "block" }}
          className="rounded-lg border border-white/10"
        />
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (el) => (el as HTMLElement).style.width || "100%",
        renderHTML: (attrs) => ({ style: `width: ${attrs.width}` }),
      },
      align: { default: "center" },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
