// Organization facts, contacts and hero video sources.
// Source of truth: docs/site-audit.md §0.6 (mailing address, contacts),
// §1 (donation URL), §5 (Facebook), §13 "Key messages" (founding year,
// mission, tagline). See docs/BUILD-PROMPT.md §0.6 for the exact address
// wording and §12 for the fixes applied here (none needed for this file).

import { publicUrl } from "@/lib/publicUrl";

export interface Contact {
  name: string;
  title: string;
  email: string;
}

export interface SiteInfo {
  /** Legal/display org name, exactly as used across the current site. */
  orgName: string;
  /** Existing tagline-ish line preserved verbatim (audit §13 "Key messages"). */
  tagline: string;
  /** Existing mission statement, verbatim (audit §7 Section 1 / §12 donation page). */
  mission: string;
  /** Home hero paragraph, verbatim (audit §6 Section 1). */
  heroParagraph: string;
  /** Standalone "pull line", verbatim (audit §13 "Key messages" / §7 Section 2). */
  pullQuote: string;
  /** Full two-sentence version used on Home Section 4, verbatim (audit §6 Section 4 / §7 Section 2). */
  impactParagraph: string;
  foundedYear: number;
  taxStatus: string;
  mailingAddress: {
    line1: string;
    line2: string;
    line3: string;
  };
  donationUrl: string;
  facebookUrl: string;
  contacts: {
    president: Contact;
    boardChair: Contact;
  };
}

export const site = {
  orgName: "4Montgomery's Kids",
  tagline:
    "One child at a time, we provide hope, help restore dignity and increase self-esteem.",
  mission:
    "To improve the lives of abused and neglected children by providing opportunities and services they otherwise might not receive.",
  heroParagraph:
    "4Montgomery's Kids enriches the lives of abused and neglected children and youth in Montgomery County's child welfare system by providing them with opportunities and services they would not otherwise receive. One child at a time, we provide hope, help restore dignity and increase self-esteem.",
  pullQuote: "A need to some is only a dream when it's out of reach.",
  impactParagraph:
    "A need to some is only a dream when it's out of reach. 4Montgomery's Kids helps children in the foster care system in Montgomery County, Maryland achieve their dreams, both big and small.",
  foundedYear: 2015, // audit §11.13 "In 2015, 4Montgomery's Kids began this incredible journey"
  taxStatus: "501(c)(3) nonprofit",
  mailingAddress: {
    line1: "4Montgomery's Kids",
    line2: "P.O. Box 34864, 10421 Motor City Drive",
    line3: "Bethesda, MD 20817",
  },
  donationUrl: "https://secure.4montgomeryskids.org/forms/donations",
  facebookUrl: "https://www.facebook.com/4montgomeryskids",
  contacts: {
    president: {
      name: "Leslie Shedlin",
      title: "President",
      email: "lkshedlin@4montgomeryskids.org",
    },
    boardChair: {
      name: "Agnes Leshner",
      title: "Board Chair",
      email: "aleshner@4montgomeryskids.org",
    },
  },
} satisfies SiteInfo;

/**
 * Headline impact numbers, quoted in four places (Home's impact tiles, Our
 * Stories' hero sub-line, Programs' request band and the 10-year blog post
 * they come from). They lived as bare literals in each of those components
 * until Task 15 — a stat the client will want to update annually should
 * have exactly one place to edit, not three files to remember.
 *
 * Source: docs/site-audit.md §11.13, the "10 Years of Helping Children"
 * post ("In 2015, 4Montgomery's Kids began this incredible journey… 2,852
 * requests fulfilled").
 */
export const impactStats = {
  /** Total requests fulfilled since 2015. */
  requestsFulfilled: 2852,
  /** Years of operation, displayed as "10+". */
  yearsServing: 10,
} as const;

// Hero video sources — placeholder footage, swappable for custom footage
// later (see README "Where to swap the hero videos"). Originally hosted on
// CloudFront as single ~12-16MB 1080p H.264 files at ~10 Mbps; re-encoded
// and self-hosted here as 1280px-wide H.264 (CRF 24) + VP9/WebM (CRF 34)
// pairs — same visual content, ~90% smaller (≤1MB each) and no longer
// dependent on an external asset host. See docs/BUILD-PROMPT.md §6.1/§6.4.
export const HERO_VIDEO_HOME = publicUrl("videos/hero-home.mp4");
export const HERO_VIDEO_HOME_WEBM = publicUrl("videos/hero-home.webm");
export const HERO_VIDEO_STORIES = publicUrl("videos/hero-stories.mp4");
export const HERO_VIDEO_STORIES_WEBM = publicUrl("videos/hero-stories.webm");
