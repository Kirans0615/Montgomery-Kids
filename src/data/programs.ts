// "What your money supports" bullet list (audit §9, verbatim), the 3 named
// DisplayCards programs for the Programs hero, and the 6 bento-grid program
// tiles (build-prompt §6.5 Section 3), with their exact facts, quotes and
// source-post citations. Icon values are lucide-react export names,
// resolved to components at the page layer (Task 5/11), not here.
import type { StoryCover } from "./stories";

// ---------------------------------------------------------------------------
// Section 1 — "What your money supports" (audit §9, verbatim, 10 items)
// ---------------------------------------------------------------------------
export const supportsList = [
  "Summer camp fees",
  "Computers and schoolbooks",
  "Transportation to college classes, jobs, and medical appointments",
  "Recreational activities such as soccer and baseball",
  "After school programs in dance, art, and music",
  "College and technical school scholarships",
  "Specialized classes in areas such as nursing, home care and cosmetology",
  "Costs for parental visits with their children in foster care",
  "Security deposits, rents, and furniture for those aging out of foster care",
  "…and much more!",
] satisfies string[];

// ---------------------------------------------------------------------------
// Section 1 — named DisplayCards programs (build-prompt §6.5 Section 1(B))
// ---------------------------------------------------------------------------
export interface NamedProgram {
  icon: string;
  title: string;
  description: string;
  date: string;
}

export const namedPrograms = [
  {
    icon: "Wallet",
    title: "Boost",
    description: "$600 a month for one year",
    date: "Guaranteed income",
  },
  {
    icon: "GraduationCap",
    title: "Scholarships",
    description: "$500 – $1,000 awards",
    date: "Every spring",
  },
  {
    // build-prompt §6.5 offers Drumstick or UtensilsCrossed; UtensilsCrossed
    // reads more clearly as a generic "meal" glyph at small sizes.
    icon: "UtensilsCrossed",
    title: "Project Turkey",
    description: "Thanksgiving for families",
    date: "Every November",
  },
] satisfies NamedProgram[];

// ---------------------------------------------------------------------------
// NEW Section 3 — bento-grid program tiles (build-prompt §6.5 Section 3)
// ---------------------------------------------------------------------------
export type ProgramTileCover =
  | { kind: "color"; tone: "butter" | "mint" | "sky" }
  | StoryCover;

export interface SourcePost {
  title: string;
  /** Original post URL from the audit's post inventory (§5 / §11), kept
   * verbatim so the exact-URL requirement in build-prompt §5 is honored
   * even though this file doesn't depend on Task 4's posts.ts. */
  url: string;
}

export interface ProgramTile {
  slug: string;
  title: string;
  size: "large" | "regular";
  cover: ProgramTileCover;
  facts: string[];
  quote?: string;
  note?: string;
  sourcePost: SourcePost;
}

export const programTiles = [
  {
    slug: "boost-guaranteed-income",
    title: "Boost: guaranteed income",
    size: "large",
    cover: { kind: "color", tone: "butter" },
    facts: [
      "$600 per month for one year to youth who have aged out of foster care.",
      "one of only three we could find anywhere devoted exclusively to those aging out of foster care.",
    ],
    quote:
      "I feel fantastic! I am now employed full time and am very grateful for the opportunity to receive the monthly stipend.",
    note: "Mentorship partner: Empowering the Ages.",
    sourcePost: {
      title: "How scary must it be to have to leave foster care at age 21?",
      url: "/2025/08/how-scary-must-it-be-to-have-to-leave-foster-care-at-age-21/",
    },
  },
  {
    slug: "scholarships-excellence-awards",
    title: "Scholarships & 4MK Excellence Awards",
    size: "regular",
    cover: {
      kind: "photo",
      image: "graduate.jpg",
      alt: "A smiling graduate in cap and gown holding his diploma",
    },
    facts: [
      "$500 – $1,000 to high school graduates in foster care pursuing college or a trade.",
      "15 scholarships this year.",
      "48 scholarships since 2017.",
    ],
    sourcePost: {
      title: "Spring Forward with 4Montgomery's Kids",
      url: "/2025/08/spring-forward-with-4montgomerys-kids/",
    },
  },
  {
    slug: "project-turkey",
    title: "Project Turkey",
    size: "regular",
    cover: { kind: "color", tone: "mint" },
    facts: [
      "With Ingleside residents in Rockville, Giant gift cards for Thanksgiving.",
      "Helped 60 families and more than 100 children and youth this year!",
    ],
    sourcePost: {
      title: "You Made It Happen: 2,500 Kids Supported and Counting",
      url: "/2025/11/you-made-it-happen-2500-kids-supported-and-counting/",
    },
  },
  {
    slug: "summer-camp-activities",
    title: "Summer camp & activities",
    size: "regular",
    cover: { kind: "illustrated", icon: "Tent" },
    facts: [
      "Twelve children to summer programs.",
      "Including traditional sleep-away camp, special-needs camps, sports-themed programs and dance camp.",
    ],
    sourcePost: {
      title: "Spring Forward with 4Montgomery's Kids",
      url: "/2025/08/spring-forward-with-4montgomerys-kids/",
    },
  },
  {
    slug: "emergency-transportation",
    title: "Emergency transportation",
    size: "regular",
    cover: {
      kind: "photo",
      image: "teen-driver-smiling.jpg",
      alt: "A smiling teenager behind the wheel of a car",
    },
    facts: [
      "Within an hour, we had an Uber card on its way.",
      "Plus car insurance, Uber cards and Metro passes.",
    ],
    sourcePost: {
      title: '"Fall" for Kids',
      url: "/2025/10/fall-for-kids/",
    },
  },
  {
    slug: "milestones-birthdays",
    title: "Milestones & birthdays",
    size: "regular",
    cover: { kind: "color", tone: "sky" },
    facts: [
      "Prom and graduation outfits, quinceañera dresses, birthday parties.",
    ],
    quote: "No one deserves to be forgotten.",
    sourcePost: {
      title: "We are Thankful for You",
      url: "/2025/08/fall-2023-we-are-thankful-for-you/",
    },
  },
] satisfies ProgramTile[];
