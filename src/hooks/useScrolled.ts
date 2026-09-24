import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD = 20;

/**
 * True once `window.scrollY` exceeds `threshold` (default 20px), used by the
 * Navbar to swap from a transparent to an opaque/blurred background per
 * docs/BUILD-PROMPT.md §6.0.
 */
export function useScrolled(threshold: number = DEFAULT_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold,
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
