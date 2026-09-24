import { createContext, useContext } from "react";
import type Lenis from "lenis";

/**
 * Provided by `SmoothScroll` (src/components/layout/SmoothScroll.tsx). Split
 * into its own file — rather than living alongside the `SmoothScroll`
 * component — purely so that file can keep a single component export (Fast
 * Refresh/react-refresh requires component-only modules).
 */
export const LenisContext = createContext<Lenis | null>(null);

/**
 * The active Lenis instance, or `null` when smooth scrolling is disabled
 * (reduced motion, or before `SmoothScroll`'s effect has run). Consumers
 * (PageTransition's scroll-to-top, Footer's "Back to top") should fall back
 * to native `window.scrollTo` when this is `null`.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
