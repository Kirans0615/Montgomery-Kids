import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /** Split by whole words (default, used for hero H1s) or individual characters. */
  by?: "word" | "char";
  /** Per-unit stagger, in ms. */
  staggerMs?: number;
  delay?: number;
}

const wordVariants: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

/**
 * Splits text into words (or chars) that rise from a masked (overflow
 * hidden) line, per docs/BUILD-PROMPT.md §8.3. The real text is exposed to
 * assistive tech through a visually-hidden copy; the split spans used for
 * the visual effect are `aria-hidden`.
 *
 * That sr-only copy replaced an `aria-label` on the wrapper (Task 15 a11y
 * pass): `aria-label` is *prohibited* on a generic `<span>` — a span has no
 * implicit ARIA role, and ARIA only permits naming on elements that have
 * one — so `as="span"` (the default, used for hero eyebrows and inline
 * phrases) tripped axe's `aria-prohibited-attr` rule on Home, Programs and
 * Blog. A visually-hidden text node works identically for screen readers,
 * is valid on every tag this component can render, and keeps the text
 * selectable/findable by browser find-in-page.
 *
 * The `whileInView` trigger lives on the outer (overflow-hidden, never
 * transformed) wrapper, not on the sliding inner span: the inner span's own
 * bounding box starts translated 110% below that wrapper, so watching IT for
 * intersection would clip its box against its own ancestor and never report
 * "in view" while still in its hidden position — a viewport-detection
 * deadlock. The wrapper's `whileInView="visible"` instead propagates down to
 * the inner span via framer-motion's variant propagation.
 *
 * With reduced motion, renders the plain text with no splitting/animation
 * at all — fully static and readable, per §10/§13.
 */
export default function SplitText({
  text,
  className,
  as = "span",
  by = "word",
  staggerMs = 40,
  delay = 0,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const Tag = as;

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const units = by === "word" ? text.split(" ") : text.split("");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {units.map((unit, index) => {
          // `by="char"` splits on every character, including the spaces
          // between words. A space rendered as the *sole* content of an
          // `inline-block` box (as every other unit below is) collapses to
          // zero width in every browser — an inline-block with only
          // whitespace content is treated as empty — which glues adjacent
          // words together. Word spacing isn't something to mask/rise like
          // a glyph, so it renders as a plain (non-block, `white-space:
          // pre`) space instead, outside the animated wrapper.
          if (by === "char" && unit === " ") {
            return (
              <span key={`space-${index}`} style={{ whiteSpace: "pre" }}>
                {" "}
              </span>
            );
          }

          return (
            <motion.span
              key={`${unit}-${index}`}
              className="inline-block overflow-hidden align-bottom"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.span
                className={cn("inline-block will-change-transform")}
                variants={wordVariants}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: delay + (index * staggerMs) / 1000,
                }}
              >
                {unit.length === 0 ? " " : unit}
                {by === "word" && index < units.length - 1 ? " " : ""}
              </motion.span>
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}
