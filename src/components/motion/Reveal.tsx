import { Children, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Global framer-motion easing per docs/BUILD-PROMPT.md §3.4. */
const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.8;
const STAGGER_MS = 80;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** When true, staggers direct children by 80ms per §8.2. */
  stagger?: boolean;
  /** Extra delay (seconds) before the reveal (or the first staggered item) starts. */
  delay?: number;
  /** Distance (px) the content rises from. */
  y?: number;
  /** Re-play every time the element scrolls into view instead of once. */
  once?: boolean;
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

/**
 * Default scroll-triggered entrance wrapper: fade-up, once, per
 * docs/BUILD-PROMPT.md §3.4/§8.2. Fully static (no animation at all, content
 * simply present and readable) when `prefers-reduced-motion: reduce` is set
 * — never merely "faster", per §10/§13.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (!stagger) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once, margin: "-80px" }}
        transition={{ duration: DURATION, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: STAGGER_MS / 1000, delayChildren: delay },
        },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div variants={{ ...childVariants, hidden: { opacity: 0, y } }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
