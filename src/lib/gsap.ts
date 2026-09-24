import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerClass } from "gsap/ScrollTrigger";

export interface LoadedGsap {
  gsap: typeof GsapNamespace;
  ScrollTrigger: typeof ScrollTriggerClass;
}

let pending: Promise<LoadedGsap> | null = null;

/**
 * Loads GSAP + ScrollTrigger on demand, registering the plugin exactly once.
 *
 * Every GSAP use on this site is scroll-driven (the Home hero's parallax, the
 * pinned story stage, About's scrubbed quote and timeline, the blog post
 * reading-progress bar) — none of it runs, or needs to exist, at first paint.
 * As a static import from `HomeHero`/`HomeStoriesSlider` it was, though:
 * those are on the eagerly-loaded Home route, so Vite emitted a
 * `<link rel="modulepreload">` for the 70 kB (28 kB gzipped) gsap chunk in
 * index.html and the browser fetched and parsed it before the first pixel.
 * Lighthouse attributed 538 ms of main-thread time to it on a throttled
 * mobile profile.
 *
 * Making the import dynamic moves it off the critical path without changing
 * a single animation: the promise is memoised, so the second caller on a page
 * reuses the first caller's module instance (and its already-registered
 * plugin) rather than racing a second `registerPlugin`.
 *
 * Callers should treat resolution as asynchronous and guard against
 * unmounting in between — see `useGsapContext`.
 */
export function loadGsap(): Promise<LoadedGsap> {
  if (!pending) {
    pending = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }
  return pending;
}
