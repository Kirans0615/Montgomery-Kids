import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { cn } from "@/lib/utils";

/**
 * Approximates "past the hero" per docs/BUILD-PROMPT.md §6.2 — every page's
 * hero is roughly full-viewport-height or taller (Home/About/Stories all
 * ship a full-bleed hero per the plan), so 60% of the viewport height is a
 * reasonable, page-agnostic proxy without coupling this component to any one
 * page's exact hero markup (route content is still stubbed in Task 7).
 */
const HERO_SCROLL_RATIO = 0.6;

interface StickyDonateBarProps {
  /** Hide while the mobile nav overlay is open, per §6.2. */
  mobileMenuOpen: boolean;
}

/**
 * Mobile-only sticky "Help a child today" donate bar (NEW, §6.2): slides up
 * from the bottom once the user has scrolled past the hero, and hides again
 * while the mobile menu is open or the real Footer is in view (via an
 * IntersectionObserver on `#site-footer`, so the two bars never overlap).
 */
export default function StickyDonateBar({ mobileMenuOpen }: StickyDonateBarProps) {
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => setPastHero(window.scrollY > window.innerHeight * HERO_SCROLL_RATIO);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !mobileMenuOpen && !footerVisible;

  return (
    // `<aside>` (a complementary landmark) rather than a bare `<div>`: this
    // bar is a direct child of the page shell, outside <main>, so as a div
    // its text sat in no landmark at all — axe's `region` rule ("All page
    // content should be contained by landmarks") fired on every one of the
    // 10 routes at 390px in Task 15's audit. An explicit aria-label keeps
    // the landmark distinguishable from any other complementary region.
    <aside
      aria-label="Donate"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-brand-ink/10 bg-brand-cream/95 px-5 py-3 shadow-[0_-4px_16px_rgba(28,42,32,.12)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="text-sm font-semibold text-brand-ink">Help a child today</p>
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener"
        tabIndex={visible ? 0 : -1}
        onClick={openDonate}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-brand-sun px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-ink"
      >
        <Heart aria-hidden="true" className="h-4 w-4" fill="currentColor" />
        Donate
      </a>
    </aside>
  );
}
