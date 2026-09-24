import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLockBody } from "@/hooks/useLockBody";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen mobile nav overlay per docs/BUILD-PROMPT.md §6.0: body-scroll
 * lock while open (`useLockBody`), a focus trap cycling Tab/Shift+Tab within
 * the menu, Escape-to-close, and focus returned to whatever triggered it
 * (the Navbar hamburger) on close.
 */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const getFocusables = () =>
      container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

    getFocusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = getFocusables();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      id="mobile-menu"
      role="dialog"
      aria-modal={open}
      aria-label="Main menu"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-40 overflow-hidden bg-brand-cream transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Faint blob shapes, purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-mint/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-brand-butter/60 blur-3xl" />
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col items-center justify-center gap-7 transition duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0",
        )}
      >
        {/*
          A real `<nav aria-label="Main">` here, not just a stack of links in
          the dialog. Before this, the only `<nav aria-label="Main">` in the
          document lived in Navbar's `hidden md:flex` desktop list, so below
          768px the site had no navigation landmark at all — flagged as an
          open item in Tasks 7 and 10, closed here. The two are mutually
          exclusive (`hidden md:flex` vs `md:hidden`, i.e. `display: none` on
          whichever doesn't apply), so only ever one reaches the accessibility
          tree and `landmark-unique` stays satisfied — verified with axe-core
          at 390, 768 and 1440px.
        */}
        <nav
          aria-label="Main"
          className="flex flex-col items-center gap-7"
        >
          {NAV_LINKS.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="font-display text-4xl text-brand-ink transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener"
          tabIndex={open ? 0 : -1}
          onClick={(event) => {
            openDonate(event);
            onClose();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-sun px-8 py-3.5 text-lg font-bold uppercase tracking-wide text-brand-ink"
        >
          <Heart aria-hidden="true" className="h-5 w-5" fill="currentColor" />
          Donate
        </a>

        <p className="font-hand mt-6 text-2xl text-brand-ink-soft">One child at a time.</p>
      </div>
    </div>
  );
}
