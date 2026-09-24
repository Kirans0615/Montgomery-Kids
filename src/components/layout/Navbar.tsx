import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import Scribble from "@/components/motion/Scribble";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { NAV_LINKS } from "@/lib/nav";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/publicUrl";

/** Navbar becomes hide-on-scroll-down/reveal-on-scroll-up only past this Y. */
const HIDE_REVEAL_THRESHOLD = 400;

interface NavbarProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

/**
 * Tracks scroll direction to hide the bar on scroll-down and reveal it on
 * scroll-up, but only once the page has scrolled past `HIDE_REVEAL_THRESHOLD`
 * — above that the bar always stays put, per docs/BUILD-PROMPT.md §6.0.
 * Forced visible while the mobile menu is open.
 */
function useHideOnScrollDown(forceVisible: boolean): boolean {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= HIDE_REVEAL_THRESHOLD) {
        setHidden(false);
      } else if (currentY > lastY.current) {
        setHidden(true);
      } else if (currentY < lastY.current) {
        setHidden(false);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return !forceVisible && hidden;
}

/**
 * Routes whose hero is bright enough (Home's photo + heavy cream gradient
 * wash; Our Stories' 55%-cream-washed video) that a transparent, unscrolled
 * header still reads. Every other route opens on a full-bleed dark photo
 * hero (About Us, Programs, Blog, every Post, 404) where dark `text-brand-ink`
 * nav links on `bg-transparent` were invisible until the visitor scrolled
 * past 20px — the same problem already fixed for the mobile hamburger below,
 * just never extended to the desktop links or the logo's own legibility.
 * Those routes get the header's cream bar from the very first frame instead
 * of waiting for scroll, so the nav is reachable/visible at all times.
 */
const TRANSPARENT_HERO_ROUTES = new Set(["/", "/our-stories"]);

export default function Navbar({ mobileMenuOpen, onToggleMobileMenu }: NavbarProps) {
  const scrolled = useScrolled(20);
  const hidden = useHideOnScrollDown(mobileMenuOpen);
  const location = useLocation();
  const showBar = scrolled || !TRANSPARENT_HERO_ROUTES.has(location.pathname);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        showBar
          ? "bg-brand-cream/85 shadow-[0_1px_0_rgba(28,42,32,.08)] backdrop-blur-md"
          : "bg-transparent",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      style={{ transitionProperty: "background-color, box-shadow, transform" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex h-16 items-center md:h-20">
          {/*
            The logo deliberately has no `animate-fade-down` entrance (the nav
            links either side of it still do). On mobile this image IS the
            Largest Contentful Paint element, and starting it at `opacity: 0`
            for a 0.7s keyframe animation pushed measured LCP from 3.5s to
            3.9s — a quarter of a second of the metric spent fading in the one
            element the metric is watching. The nav still arrives in motion;
            the mark it arrives around is simply there from the first frame.
          */}
          <Link
            to="/"
            className="block"
            aria-label={`4Montgomery's Kids — home`}
          >
            <picture>
              <source type="image/webp" srcSet={publicUrl("images/opt/logo-lockup.webp")} />
              <img
                src={publicUrl("images/logo-lockup.png")}
                alt="4Montgomery's Kids"
                width={170}
                height={48}
                /* Matches the `<link rel="preload">` for this same file in
                   index.html — on mobile this is the LCP element. Spread as
                   a raw lowercase attribute for the same reason Img.tsx does
                   it that way: React 18's react-dom has no camelCase
                   `fetchPriority` mapping (that landed in React 19), so the
                   JSX prop would warn and set a DOM attribute browsers
                   ignore. */
                {...{ fetchpriority: "high" }}
                className="h-10 w-auto lg:h-12"
              />
            </picture>
          </Link>

          {/*
            §6.0 specifies the desktop nav from `md` up with `gap-8`, a 48px
            logo and an `ml-6` DONATE pill — but those numbers don't actually
            fit at 768px, the exact tablet width §14 says to test. In a real
            768x1024 Playwright screenshot the five links overflowed back over
            the logo and "About Us" / "Our Stories" wrapped to two lines. The
            spec's breakpoint is kept; its spacing is simply tightened for the
            md..lg band (gap-5, 40px logo, ml-3, px-4) and restored to the
            specified values from `lg` up, where they fit.
          */}
          <nav aria-label="Main" className="ml-auto hidden items-center gap-5 md:flex lg:gap-8">
            {NAV_LINKS.map((item, index) => {
              const isActive =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

              return (
                <motion.div
                  key={item.to}
                  initial="rest"
                  animate={isActive ? "active" : "rest"}
                  whileHover="active"
                  className={cn(
                    `animate-fade-down stagger-${index + 2} relative`,
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-leaf"
                    />
                  )}
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className="relative inline-block whitespace-nowrap text-[14px] font-semibold tracking-wide text-brand-ink lg:text-[15px]"
                  >
                    {item.label}
                  </NavLink>
                  <Scribble
                    variant="underline"
                    trigger="hover"
                    color="tangerine"
                    duration={0.35}
                    className="pointer-events-none absolute -bottom-1 left-0 h-2 w-full"
                  />
                </motion.div>
              );
            })}

            <MagneticButton className="ml-3 lg:ml-6">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener"
                onClick={openDonate}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-sun px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-ink lg:px-5"
              >
                <Heart aria-hidden="true" className="h-4 w-4 animate-heart-pulse" fill="currentColor" />
                Donate
              </a>
            </MagneticButton>
          </nav>

          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            /*
             * 44x44, not the `w-10 h-10` (40x40) §6.0 originally specified.
             * §6.0's sizing is a visual suggestion; §10's "every touch target
             * is at least 44x44px" is an accessibility rule, and where the
             * two conflict the accessibility rule wins. The *visible* bars
             * are unchanged (still a 24px-wide, 2px-tall pair); the box just
             * grows by 2px on each side. Flagged in Tasks 7 and 10 as an
             * unresolved spec conflict; resolved here.
             */
            className={cn(
              "relative z-50 ml-auto flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden",
              /*
               * A translucent "paper" disc behind the bars, but only while the
               * header itself is still transparent (i.e. at the top of the
               * page). Blog, Post and 404 all open on a full-bleed dark photo
               * hero, and `bg-brand-ink` bars on that were, in the 390x844
               * Playwright screenshots, completely invisible — the only way
               * into the site's navigation on a phone, unfindable on three of
               * seven routes. The disc reuses the exact treatment already used
               * for the hero's video pause control (`bg-brand-paper/80` +
               * `backdrop-blur-sm`), so it reads as part of the same system,
               * and it disappears once the header picks up its own cream
               * background on scroll.
               */
              showBar
                ? "bg-transparent"
                : "bg-brand-paper/80 shadow-[0_6px_16px_-8px_rgba(28,42,32,.35)] backdrop-blur-sm",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 top-[14px] h-[2px] w-6 -translate-x-1/2 rounded bg-brand-ink transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]",
                mobileMenuOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 top-[21px] h-[2px] w-6 -translate-x-1/2 rounded bg-brand-ink transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]",
                mobileMenuOpen && "-rotate-45",
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
