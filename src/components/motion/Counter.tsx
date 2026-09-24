import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  /** Seconds. */
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts up from 0 to `value` once it scrolls into view, easeOutExpo,
 * comma-formatted with tabular numerals, per docs/BUILD-PROMPT.md §8.4.
 * With reduced motion, shows the final value immediately (no animation).
 *
 * Viewport detection is deliberately redundant, wired through two
 * independent mechanisms that both just call `setInView(true)` (idempotent,
 * so whichever fires first wins):
 *  1. `whileInView` on a `motion.span`, the same "inView" feature that
 *     drives every other viewport-triggered primitive in this app (Reveal,
 *     SplitText, Scribble), paired with a real (if visually tiny) opacity
 *     animation so the underlying observer actually has something to
 *     animate and reliably calls `onAnimationComplete`.
 *  2. A plain `IntersectionObserver` on the same node, as a fallback for
 *     the case where a page/tab is backgrounded at mount time: that gets a
 *     spec-guaranteed but stale "not intersecting" initial callback and no
 *     further ones until something changes while the page is visible again,
 *     so a `visibilitychange` listener re-checks geometry directly
 *     (`getBoundingClientRect`) the moment visibility resumes.
 */
export default function Counter({
  value,
  duration = 2.2,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);
  const [display, setDisplay] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || inView) return undefined;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const isGeometricallyInView = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < viewportHeight - 80 && rect.bottom > 80;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(node);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isGeometricallyInView()) {
        setInView(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reducedMotion, inView]);

  useEffect(() => {
    if (reducedMotion || !inView) return undefined;

    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / (duration * 1000));
      setDisplay(value * easeOutExpo(t));

      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [inView, reducedMotion, value, duration]);

  const formattedFinal = `${prefix}${formatNumber(value, decimals)}${suffix}`;

  // Fully static with reduced motion: the final value, immediately, with no
  // animation of any kind — not even the brief opacity fade used below to
  // detect viewport entry — per §10/§13.
  if (reducedMotion) {
    return (
      <span className={cn("font-display", className)} style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {formatNumber(value, decimals)}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={cn("font-display", className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
      initial={{ opacity: 0.001 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => setInView(true)}
    >
      {/*
        The final value, once, for assistive tech — not an `aria-label` on the
        wrapping span. `aria-label` is prohibited on a role-less generic
        element like `<span>`, which axe flags as `aria-prohibited-attr`
        (found on Home, About, Programs and Blog in Task 15's audit). A
        visually-hidden text node reads identically and is valid markup.
      */}
      <span className="sr-only">{formattedFinal}</span>
      <span aria-hidden="true">
        {prefix}
        {formatNumber(display, decimals)}
        {suffix}
      </span>
    </motion.span>
  );
}
