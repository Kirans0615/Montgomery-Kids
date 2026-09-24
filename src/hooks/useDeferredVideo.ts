import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Holds a background hero video's `<source>` back until the page has finished
 * its initial load and the main thread is idle, then attaches it and lets
 * `autoplay` take over.
 *
 * Why: both hero videos are ~3 MB MP4s. With a plain `<video autoplay
 * preload="metadata">` the browser treats autoplay as an explicit play
 * request and starts pulling the whole file immediately — in parallel with,
 * and competing for bandwidth against, the JS and CSS the first paint
 * actually depends on. Lighthouse measured that single request at 3,117 kB
 * of a 12,871 kB page, alongside a 6.7s First Contentful Paint whose
 * Largest Contentful Paint was 93% "render delay".
 *
 * Deferring costs nothing visually: the `poster` is the same optimized WebP
 * still that already renders behind the hero copy, so the hero looks
 * identical until the video fades in a beat later — which is what a
 * background video should do anyway.
 *
 * @param videoRef  the `<video>` element; `.load()` is called on it once the
 *                  `<source>` has been attached, because a `<source>` added
 *                  after mount is ignored until the element re-evaluates its
 *                  candidate sources.
 * @param enabled   pass `false` (e.g. reduced motion, or an errored video) to
 *                  keep the source permanently detached.
 */
export function useDeferredVideoSource(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
): boolean {
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || ready) return undefined;

    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const schedule = () => {
      // `requestIdleCallback` where available (Chrome/Edge/Firefox), a short
      // timeout otherwise (Safari) — either way the video starts loading
      // after, not during, the critical rendering path.
      const ric = (window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;

      if (typeof ric === "function") {
        idleId = ric(() => setReady(true), { timeout: 2000 });
      } else {
        timeoutId = window.setTimeout(() => setReady(true), 300);
      }
    };

    if (document.readyState === "complete") {
      schedule();
      return () => {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
      };
    }

    window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (idleId !== null) {
        const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void })
          .cancelIdleCallback;
        cic?.(idleId);
      }
    };
  }, [enabled, ready]);

  useEffect(() => {
    if (!ready || loadedRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    loadedRef.current = true;
    video.load();
  }, [ready, videoRef]);

  return ready && enabled;
}
