// Single source of truth for the site's nav links, per docs/BUILD-PROMPT.md
// §5's "same six nav items, same order, same labels" rule. DONATE is not
// listed here — it's a distinct external-link pill styled and wired
// separately (via `openDonate`/`DONATE_URL` from src/lib/donate.ts) in every
// place it appears (Navbar, MobileMenu, Footer, StickyDonateBar).
export interface NavLinkItem {
  label: string;
  to: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Our Stories", to: "/our-stories" },
  { label: "Programs", to: "/programs" },
  { label: "Blog", to: "/blog" },
];
