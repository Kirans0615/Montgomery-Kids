import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getInitialValue(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Live-updating wrapper around `matchMedia('(prefers-reduced-motion: reduce)')`.
 *
 * Per docs/BUILD-PROMPT.md §10/§13, every motion primitive in this app reads
 * this hook and degrades to a fully static, fully readable state when it
 * returns true — never merely "faster" motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(QUERY);
    const handleChange = () => setReduced(mediaQueryList.matches);

    handleChange();

    // Safari < 14 only supports the deprecated addListener/removeListener
    // pair; feature-detect rather than assume the modern API.
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, []);

  return reduced;
}
