import type { LucideIcon } from "lucide-react";
import Scribble from "@/components/motion/Scribble";
import { cn } from "@/lib/utils";

interface IllustratedCoverProps {
  /** Used to deterministically pick the gradient — same slug always renders the same gradient. */
  slug: string;
  icon: LucideIcon;
  /** Shown in Caveat, e.g. a story/post category. */
  category: string;
  className?: string;
}

/** Two-tone gradient palette, rotated deterministically per slug (§4/§3.3). */
const GRADIENTS = [
  "from-brand-butter to-brand-sun",
  "from-brand-mint to-brand-leaf",
  "from-brand-sky to-brand-mint",
  "from-brand-cream to-brand-tangerine",
] as const;

const SPARKLES: ReadonlyArray<{
  position: string;
  size: string;
  color: "tangerine" | "leaf";
  delay: number;
}> = [
  { position: "left-[8%] top-[14%]", size: "w-6", color: "tangerine", delay: 0 },
  { position: "right-[12%] top-[20%]", size: "w-4", color: "leaf", delay: 0.15 },
  { position: "left-[18%] bottom-[16%]", size: "w-5", color: "leaf", delay: 0.3 },
  { position: "right-[10%] bottom-[12%]", size: "w-7", color: "tangerine", delay: 0.45 },
];

/**
 * Deterministic djb2-style string hash — same slug always maps to the same
 * gradient index. Never `Math.random()`, per docs/BUILD-PROMPT.md §4.
 */
function hashSlug(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 33 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Designed placeholder cover for stories/posts with no matching photo: a
 * rounded panel with a two-tone gradient, a big lucide icon, scattered
 * hand-drawn sparkles and a category label in Caveat, per
 * docs/BUILD-PROMPT.md §4/§3.3. Never falls back to the favicon.
 */
export default function IllustratedCover({
  slug,
  icon: Icon,
  category,
  className,
}: IllustratedCoverProps) {
  const gradient = GRADIENTS[hashSlug(slug) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br ring-1 ring-brand-ink/10 shadow-[0_30px_60px_-20px_rgba(28,42,32,.25)]",
        gradient,
        className,
      )}
    >
      {SPARKLES.map((sparkle, index) => (
        <Scribble
          key={index}
          variant="star"
          color={sparkle.color}
          delay={sparkle.delay}
          className={cn("absolute opacity-70", sparkle.position, sparkle.size)}
        />
      ))}

      <Icon
        className="relative z-10 h-16 w-16 text-brand-ink/80"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <span className="absolute bottom-3 left-4 z-10 rounded-full bg-brand-paper/70 px-3 py-1 font-hand text-lg leading-none text-brand-ink backdrop-blur-sm">
        {category}
      </span>
    </div>
  );
}
