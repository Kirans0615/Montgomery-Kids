import type { MouseEvent } from "react";
import { site } from "@/data/site";

/** Exact confetti palette and count per docs/BUILD-PROMPT.md §9. */
const CONFETTI_COLORS = ["#FFB400", "#8EC63F", "#F28C28", "#FFF8EC"];
const CONFETTI_PARTICLE_COUNT = 60;
const OPEN_DELAY_MS = 350;

export const DONATE_URL = site.donationUrl;

/**
 * Handler for every Donate/DONATE button/link in the site.
 *
 * Per §9: fires a confetti burst from the clicked element's position, then
 * after 350ms opens the donation form in a new tab. The element this is
 * attached to must remain a real `<a href={DONATE_URL} target="_blank"
 * rel="noopener">` so it keeps working with JS disabled and on middle-click
 * — this handler only calls `preventDefault()` on a plain left-click (no
 * modifier keys), leaving every other click type (middle-click, cmd/ctrl-
 * click, shift-click) to the browser's native "open in new tab" behavior.
 */
export function openDonate(event: MouseEvent<HTMLAnchorElement>): void {
  const isPlainLeftClick =
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

  if (!isPlainLeftClick) return;

  event.preventDefault();

  const rect = event.currentTarget.getBoundingClientRect();
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };

  // canvas-confetti is imported lazily, not at module scope: it's ~12 kB
  // gzipped that nothing needs until someone actually clicks Donate, and
  // `donate.ts` is imported by the Navbar, the Footer, the sticky bar and
  // half the sections — so a static import put it in the entry chunk, on
  // the critical path for the first paint of every page. The burst still
  // lands comfortably inside the 350 ms window before the donation form
  // opens (the chunk is tiny and same-origin); if the import somehow fails,
  // the catch below keeps the donation flow itself working, which is the
  // part that matters.
  void import("canvas-confetti")
    .then(({ default: confetti }) =>
      confetti({
        particleCount: CONFETTI_PARTICLE_COUNT,
        spread: 70,
        origin,
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      }),
    )
    .catch(() => {
      /* Confetti is decoration — never block the donation on it. */
    });

  window.setTimeout(() => {
    window.open(DONATE_URL, "_blank", "noopener");
  }, OPEN_DELAY_MS);
}
