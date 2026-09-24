// The 6 community partners, from docs/site-audit.md §6 Section 5 (logos +
// outbound URLs) and §7 (Board section reuses the same list on About).
// Also used for the Home "Backed by" strip (build-prompt §6.1 Section 1)
// and the Partners grid (build-prompt §6.3 Section 5 / §6.1 Section 5).
// §12 fix applied: "Norah Roberts Foundation" → "Nora Roberts Foundation".
// The Phase Foundation has no logo on the current site (text-only, in an
// H1) and no URL is given anywhere in the audit — `logo` and `url` are
// both `null` for it, which is correct, not a gap.
export interface Partner {
  name: string;
  /** Kebab-case filename in public/images/, or null for a text-only mark. */
  logo: string | null;
  alt: string | null;
  url: string | null;
}

export const partners = [
  {
    name: "100 Who Care Alliance",
    logo: "partner-100-who-care.png",
    alt: "100 Who Care Alliance",
    url: "https://www.100whocarealliance.org/",
  },
  {
    name: "The Phase Foundation",
    logo: null,
    alt: null,
    url: null,
  },
  {
    name: "Saint Anne's Episcopal Church, Damascus",
    logo: "partner-st-annes.png",
    alt: "Saint Anne's Episcopal Church, Damascus",
    url: "https://www.saintannesdamascus.net/",
  },
  {
    name: "Women Who Care in Lower MoCo",
    logo: "partner-women-who-care-lower-moco.png",
    alt: "Women Who Care in Lower MoCo",
    url: "https://lowermocowwc.com/",
  },
  {
    name: "Nora Roberts Foundation",
    logo: "partner-nora-roberts.png",
    alt: "Nora Roberts Foundation",
    url: "https://norarobertsfoundation.org/",
  },
  {
    name: "Healthcare Initiative Foundation",
    logo: "partner-hif.png",
    alt: "Healthcare Initiative Foundation",
    url: "https://hifmc.org/",
  },
] satisfies Partner[];
