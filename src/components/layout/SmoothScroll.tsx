import { useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LenisContext } from "@/hooks/useLenis";
import { loadGsap } from "@/lib/gsap";

/**
 * Lenis's own documented easing default, spelled out explicitly per
 * docs/BUILD-PROMPT.md §8 point 1 (duration 1.1, this exact easing).
 */
const LENIS_EASING = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const LENIS_DURATION = 1.1;

/**
 * Wires Lenis smooth scrolling to GSAP's ticker (the documented Lenis+GSAP
 * integration: `gsap.ticker.add((time) => lenis.raf(time * 1000))` with
 * `gsap.ticker.lagSmoothing(0)` so GSAP's own frame-skipping doesn't fight
 * Lenis's interpolation) and keeps ScrollTrigger's measurements in sync by
 * calling `ScrollTrigger.update()` on every Lenis scroll event.
 *
 * Entirely disabled under `prefers-reduced-motion`: no Lenis instance is
 * created at all, so the page just uses native scrolling (and consumers of
 * `useLenis()` get `null` and fall back to native APIs) — per
 * docs/BUILD-PROMPT.md §8 point 1 / §10.
 *
 * Both Lenis and GSAP are imported *dynamically* here. This component wraps
 * the entire app, so a static import put ~36 kB gzipped of animation runtime
 * into the entry chunk and onto the critical rendering path — for behaviour
 * (momentum scrolling) that by definition can't happen until the visitor has
 * seen the page and started scrolling. Native scrolling works normally for
 * the fraction of a second before Lenis attaches.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Reduced motion: leave `lenis` at its default `null` (or, if it just
    // flipped on at runtime, the previous effect run's own cleanup below
    // already destroyed the instance and reset it to `null`) — nothing else
    // to do here.
    if (reducedMotion) {
      return undefined;
    }

    let cancelled = false;
    let dispose: (() => void) | null = null;

    void Promise.all([import("lenis"), loadGsap()]).then(
      ([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        // The effect may already have been torn down (unmount, or reduced
        // motion flipping on) while these imports were in flight — in that
        // case never construct the instance at all, or nothing would ever
        // destroy it.
        if (cancelled) return;

        const instance = new LenisCtor({
          duration: LENIS_DURATION,
          easing: LENIS_EASING,
        });

        // Publishing a freshly-constructed external library instance into
        // React state is the standard way to make it available (reactively,
        // to consumers of `useLenis()`) for the rest of its lifecycle —
        // there's no "prop" to derive this from, so this isn't the
        // derived-state antipattern this rule otherwise guards against.
        setLenis(instance);

        const unsubscribe = instance.on("scroll", () => ScrollTrigger.update());

        const onTick = (time: number) => {
          instance.raf(time * 1000);
        };
        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0);

        dispose = () => {
          gsap.ticker.remove(onTick);
          unsubscribe();
          instance.destroy();
          setLenis(null);
        };
      },
    );

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
