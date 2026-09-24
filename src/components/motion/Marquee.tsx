import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  /** The repeating content — rendered once for screen readers, twice (aria-hidden) for the animated loop. */
  children: ReactNode;
  className?: string;
  /** Applied to each of the two visual copies of `children`. */
  itemClassName?: string;
  /** Pixels per second. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

/**
 * CSS-transform infinite marquee, per docs/BUILD-PROMPT.md §8.5: speed and
 * direction props, pause on hover/focus-within, `aria-hidden` duplicate
 * track plus a visually-hidden real list for screen readers.
 *
 * With reduced motion, renders as a plain static wrapped list (no
 * duplication, no animation) — fully readable, per §10/§13.
 */
export default function Marquee({
  children,
  className,
  itemClassName,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(20);

  /**
   * The animated track is `aria-hidden` (the real content is exposed once,
   * above, in the `sr-only` copy) — but `aria-hidden` does NOT remove its
   * descendants from the tab order. When `children` contains links (the Home
   * "supported by" partner marquee does), that leaves keyboard users tabbing
   * into announced-as-nothing duplicates: axe's `aria-hidden-focus` rule,
   * found on Home in Task 15's audit.
   *
   * `children` is an arbitrary `ReactNode`, so the tabindex can't be pushed
   * down as a prop; this sweeps the rendered duplicates instead. It re-runs
   * whenever `children` changes so newly-rendered focusables are covered too.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    for (const el of track.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])',
    )) {
      el.setAttribute("tabindex", "-1");
    }
  }, [children, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      const setWidth = track.scrollWidth / 2;
      if (setWidth > 0) {
        setDuration(setWidth / speed);
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [speed, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={cn("flex flex-wrap items-center gap-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      {/* Real content, once, for screen readers only. */}
      <div className="sr-only">{children}</div>

      <div
        ref={trackRef}
        aria-hidden="true"
        className={cn(
          "flex w-max items-center gap-4 will-change-transform",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          pauseOnHover &&
            "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className={cn("flex shrink-0 items-center gap-4", itemClassName)}>
          {children}
        </div>
        <div className={cn("flex shrink-0 items-center gap-4", itemClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
