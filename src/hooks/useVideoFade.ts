import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Custom JS fade system for the Our Stories hero video, transcribed exactly
 * from docs/BUILD-PROMPT.md §6.4 Section 1:
 *
 *   - 250ms requestAnimationFrame fade-in on load and at each loop start
 *   - 250ms fade-out when 0.55s remain before the video ends (from `timeupdate`)
 *   - a `fadingOutRef` boolean prevents re-triggering the fade-out from
 *     repeated `timeupdate` events
 *   - on `ended`: set opacity 0, wait 100ms, set `currentTime = 0`, `play()`,
 *     fade back in, and reset `fadingOutRef`
 *   - each new fade cancels any running animation frame (stored in a ref) so
 *     fades never compete
 *   - fades resume from the current opacity (no snapping)
 *   - the caller must NOT put a `loop` attribute on the <video> — this hook
 *     handles looping itself via the `ended` handler above
 *
 * All fading is done via inline `style.opacity` (no CSS transitions on the
 * video element, per the spec). With reduced motion, this hook does nothing:
 * the caller is expected to not render a <video> at all and show the poster
 * image only instead.
 */

const FADE_DURATION_MS = 250;
const FADE_OUT_LEAD_SECONDS = 0.55;
const ENDED_RESTART_DELAY_MS = 100;

export function useVideoFade<T extends HTMLVideoElement = HTMLVideoElement>() {
  const videoRef = useRef<T | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return undefined;

    const cancelRunningFade = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    /**
     * Fades from whatever opacity the video is CURRENTLY at (read from
     * opacityRef, which always mirrors the last value written to
     * video.style.opacity) to `target`, over `duration` ms. Cancels any
     * fade already in progress first, so fades never compete/race.
     */
    const fadeTo = (target: number, duration: number, onComplete?: () => void) => {
      cancelRunningFade();

      const startOpacity = opacityRef.current;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const value = startOpacity + (target - startOpacity) * t;

        opacityRef.current = value;
        video.style.opacity = String(value);

        if (t < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          rafIdRef.current = null;
          onComplete?.();
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    };

    const fadeIn = () => fadeTo(1, FADE_DURATION_MS);

    const handleLoadedData = () => {
      fadeIn();
    };

    const handleTimeUpdate = () => {
      // The fadingOutRef guard stops repeated timeupdate events (which fire
      // several times a second) from re-triggering the fade-out once it has
      // already started.
      if (fadingOutRef.current) return;

      const { duration, currentTime } = video;
      if (!Number.isFinite(duration)) return;

      const remaining = duration - currentTime;
      if (remaining <= FADE_OUT_LEAD_SECONDS) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_DURATION_MS);
      }
    };

    const handleEnded = () => {
      // No `loop` attribute is used, so this fires for real — we own the
      // restart. Snap to 0 immediately (already faded out by handleTimeUpdate
      // in the normal case), wait 100ms, restart from the top, then fade
      // back in and clear the guard so the next loop's fade-out can trigger.
      cancelRunningFade();
      opacityRef.current = 0;
      video.style.opacity = "0";

      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
        fadeIn();
        fadingOutRef.current = false;
      }, ENDED_RESTART_DELAY_MS);
    };

    // Start fully transparent; the first fade-in happens on `loadeddata`.
    opacityRef.current = 0;
    video.style.opacity = "0";

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // If the video is already decoded (e.g. served from cache before this
    // effect ran), `loadeddata` will never fire — fade in immediately.
    if (video.readyState >= 2) {
      fadeIn();
    }

    return () => {
      cancelRunningFade();
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [reducedMotion]);

  return videoRef;
}
