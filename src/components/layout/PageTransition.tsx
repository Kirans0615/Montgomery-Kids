import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";

const TOTAL_SECONDS = 0.6;
const CONTENT_EXIT_SECONDS = 0.3;
const CONTENT_ENTER_DELAY = 0.3;
const CONTENT_ENTER_SECONDS = 0.2;

/**
 * Pixel offset kept clear above an anchor target so the fixed Navbar (h-16 /
 * h-20, per Navbar.tsx) never covers it — mirrors the `scroll-mt-28` utility
 * used on anchor-target sections themselves (e.g. AboutTransparency's
 * `id="transparency"`), which only helps the plain `scrollIntoView` fallback
 * below since Lenis's own `offset` option is a manual number, not CSS-aware.
 */
const HASH_SCROLL_OFFSET = -112;
const HASH_SCROLL_MAX_ATTEMPTS = 30;

/**
 * Scrolls to the element whose id matches `hash` (e.g. "#transparency"),
 * retrying via `requestAnimationFrame` for a few frames in case the target
 * route's content (and any layout-affecting effects, e.g. a pinned
 * ScrollTrigger section) hasn't finished mounting yet — covers both a
 * same-session route change (Home's "Candid Platinum Transparency 2026"
 * pill → `/about-us#transparency`) and a direct/hard load of a URL that
 * already carries the hash, since this runs from an effect that fires on
 * mount either way.
 */
function scrollToHashTarget(hash: string, lenis: Lenis | null): void {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;

  let attempts = 0;
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: HASH_SCROLL_OFFSET });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    attempts += 1;
    if (attempts < HASH_SCROLL_MAX_ATTEMPTS) {
      requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
}

/**
 * Scrolls on every route change, per docs/BUILD-PROMPT.md §5: to the top of
 * the page via Lenis's `scrollTo(0, { immediate: true })` (or plain
 * `window.scrollTo` when Lenis isn't active — reduced motion, or before it
 * has mounted) — UNLESS the new location carries a hash (e.g.
 * `/about-us#transparency`), in which case it scrolls to that element
 * instead of snapping to the top first.
 */
function useScrollOnRouteChange(pathname: string, hash: string): void {
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      scrollToHashTarget(hash, lenis);
      return;
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);
}

/**
 * The small green "4" mark shown on the wipe panel — an abbreviated echo of
 * the "4Montgomery's Kids" wordmark, per docs/BUILD-PROMPT.md §5.
 */
function FourMark() {
  return (
    <span aria-hidden="true" className="font-display text-5xl font-bold text-brand-leaf">
      4
    </span>
  );
}

/**
 * AnimatePresence wrapper implementing the page-transition wipe from
 * docs/BUILD-PROMPT.md §5: the outgoing page fades to 0 and moves 8px up,
 * while a `sun`-colored panel carrying the small green "4" mark wipes up
 * from offscreen-bottom to cover the viewport and back off the top,
 * 0.6s total. Entirely skipped under reduced motion (no wipe, no fade/move —
 * navigation still works, it's just an instant swap).
 *
 * Design note: the content fade/move uses its own `AnimatePresence`
 * (`mode="wait"`) scoped to a plain wrapper div, rather than putting
 * `<Routes>` itself inside AnimatePresence — resolving the route element via
 * `useRoutes()` in the caller and keying this wrapper by pathname avoids the
 * classic React Router + AnimatePresence gotcha where a `<Routes>` still
 * mounted for its exit animation re-subscribes to the now-changed router
 * location and immediately renders the *new* route instead of holding the
 * old one. The sun wipe panel is a separate, non-presence-managed element
 * that just remounts (fresh keyframe run) on every pathname change — it has
 * no exit animation, so it doesn't need `AnimatePresence` at all.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useScrollOnRouteChange(location.pathname, location.hash);

  // The wipe should only ever play on an actual navigation, never on the
  // page's first load (there's nothing to wipe away from yet).
  const initialPathname = useRef(location.pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (location.pathname !== initialPathname.current) {
      setHasNavigated(true);
    }
  }, [location.pathname]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: CONTENT_ENTER_SECONDS,
              delay: CONTENT_ENTER_DELAY,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            y: -8,
            transition: { duration: CONTENT_EXIT_SECONDS, ease: "easeIn" },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {hasNavigated && (
        <motion.div
          key={`wipe-${location.pathname}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-brand-sun"
          initial={{ y: "100%" }}
          animate={{ y: ["100%", "0%", "-100%"] }}
          transition={{ duration: TOTAL_SECONDS, times: [0, 0.5, 1], ease: "easeInOut" }}
        >
          <FourMark />
        </motion.div>
      )}
    </>
  );
}
