import { useEffect, useState, type RefObject } from "react";

/**
 * Scroll-driven reading progress (0–100) for a single element (`targetRef`),
 * not the whole document — so a post's top progress bar reaches 100% right
 * as the reader finishes the post's own content (hero through the
 * end-of-post Donate CTA), rather than only after also scrolling past the
 * prev/next nav, the 3 related posts, and the global footer below it.
 *
 * Same convention as the project's other scroll listeners (see
 * `useScrolled.ts` / `Navbar.tsx`'s `useHideOnScrollDown`): a plain passive
 * `scroll` listener recomputing state directly, no rAF throttle — Lenis
 * (see `SmoothScroll.tsx`) still updates real `window.scrollY` and still
 * fires native `scroll` events, so this works the same with or without it.
 * Also listens for `resize` (viewport height and article height both feed
 * the calculation) and measures once on mount so a post loaded already
 * scrolled starts with a correct value instead of 0 until the next scroll.
 */
export function useReadingProgress(targetRef: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = targetRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;

      if (scrollableDistance <= 0) {
        // The whole article already fits within the viewport at once —
        // there's nothing to "scroll through", so just reflect whether it
        // has scrolled past (fully read) or not.
        setProgress(rect.bottom <= viewportHeight ? 100 : 0);
        return;
      }

      const scrolledPastTop = -rect.top;
      const fraction = scrolledPastTop / scrollableDistance;
      setProgress(Math.min(100, Math.max(0, fraction * 100)));
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [targetRef]);

  return progress;
}
