import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type ScribbleVariant = "underline" | "circle" | "arrow" | "star" | "squiggle";

interface ScribbleProps {
  variant: ScribbleVariant;
  className?: string;
  color?: "tangerine" | "leaf";
  strokeWidth?: number;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
  /**
   * "view" (default): draws once the first time it scrolls into the
   * viewport, exactly as before.
   *
   * "hover": renders no `initial`/`animate`/`whileInView` of its own and
   * instead exposes framer-motion `variants` ("rest" / "active") so an
   * ancestor `motion` element can drive it via variant propagation, e.g.
   * `<motion.div initial="rest" whileHover="active" animate={isActive ?
   * "active" : "rest"}>` — used by Navbar's hand-drawn hover underline.
   */
  trigger?: "view" | "hover";
}

const COLOR_CLASS: Record<NonNullable<ScribbleProps["color"]>, string> = {
  tangerine: "text-brand-tangerine",
  leaf: "text-brand-leaf",
};

const VARIANTS: Record<
  ScribbleVariant,
  { viewBox: string; d: string; preserveAspectRatio: string }
> = {
  // Stretches to fill a wide, short box (e.g. under a word).
  underline: {
    viewBox: "0 0 200 20",
    d: "M4 12 C 50 4, 150 4, 196 12",
    preserveAspectRatio: "none",
  },
  // Keeps its shape — meant to sit around a word at roughly its own aspect ratio.
  circle: {
    viewBox: "0 0 200 80",
    d: "M100 8 C 40 8, 8 30, 10 45 C 12 65, 55 74, 100 74 C 150 74, 190 62, 190 42 C 190 18, 145 8, 100 10",
    preserveAspectRatio: "xMidYMid meet",
  },
  // A curly arrow pointing at a CTA.
  arrow: {
    viewBox: "0 0 120 80",
    d: "M6 8 C 40 10, 80 24, 96 50 M96 50 L 78 42 M96 50 L 88 68",
    preserveAspectRatio: "xMidYMid meet",
  },
  // A single continuous 4-point sparkle/star outline.
  star: {
    viewBox: "0 0 40 40",
    d: "M20 2 C 21 14, 26 19, 38 20 C 26 21, 21 26, 20 38 C 19 26, 14 21, 2 20 C 14 19, 19 14, 20 2 Z",
    preserveAspectRatio: "xMidYMid meet",
  },
  // Stretches to fill a wide, short box (marquee chips, section dividers).
  squiggle: {
    viewBox: "0 0 160 24",
    d: "M4 16 C 20 2, 36 2, 52 12 C 68 22, 84 22, 100 12 C 116 2, 132 2, 156 14",
    preserveAspectRatio: "none",
  },
};

/**
 * Hand-drawn SVG mark that draws itself on scroll via `pathLength`, per
 * docs/BUILD-PROMPT.md §3.3/§8.9: underlines beneath key words, circles
 * around words, small stars/sparkles, curly arrows pointing at CTAs.
 *
 * Purely decorative — always `aria-hidden`. With reduced motion, renders
 * fully drawn immediately (no draw animation), since it's static texture,
 * not motion, per §10/§13.
 */
export default function Scribble({
  variant,
  className,
  color = "tangerine",
  strokeWidth = 6,
  duration = 0.9,
  delay = 0,
  trigger = "view",
}: ScribbleProps) {
  const reducedMotion = useReducedMotion();
  const { viewBox, d, preserveAspectRatio } = VARIANTS[variant];

  // Hover-driven flourish is purely decorative motion (not information), so
  // under reduced motion it's skipped entirely rather than shown static —
  // that would draw a permanent underline under every nav link, which isn't
  // what "active route" styling is for. Active-route indication uses its
  // own always-visible marker (see Navbar), independent of this component.
  if (reducedMotion && trigger === "hover") {
    return null;
  }

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={cn("pointer-events-none block", COLOR_CLASS[color], className)}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(trigger === "hover"
          ? {
              variants: {
                rest: { pathLength: 0, opacity: 0 },
                active: { pathLength: 1, opacity: 1 },
              },
            }
          : reducedMotion
            ? { animate: { pathLength: 1, opacity: 1 } }
            : {
                initial: { pathLength: 0, opacity: 0 },
                whileInView: { pathLength: 1, opacity: 1 },
                viewport: { once: true, margin: "-40px" },
              })}
        transition={{ duration, ease: [0.43, 0.13, 0.23, 0.96], delay }}
      />
    </svg>
  );
}
