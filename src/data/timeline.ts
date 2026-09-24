// "Our journey" milestones (build-prompt §6.3 Section 2b), verbatim from the
// audit's blog posts (§11), 2015 through 2025. `order` follows the exact
// sequence given in the build prompt (it groups the cumulative "Year ten"
// recap before the newer Boost-program milestone, so it is not strictly
// calendar order — kept as specified rather than re-sorted).
// §12 fix applied: "n our first year" → "In our first year" (missing "I").
export interface TimelineMilestone {
  order: number;
  yearLabel: string;
  facts: string[];
}

export const timeline = [
  {
    order: 1,
    yearLabel: "2015",
    facts: [
      "4Montgomery's Kids began this incredible journey.",
      "In our first year, we could only afford to help 36 children.",
    ],
  },
  {
    order: 2,
    yearLabel: "2017",
    facts: [
      "We expanded to giving partial scholarships to those going on to college or trade school.",
    ],
  },
  {
    order: 3,
    yearLabel: "2018",
    facts: [
      "Spring is here and with it comes our new name, 4Montgomery's Kids.",
      "(formerly Montgomery's Kids)",
    ],
  },
  {
    order: 4,
    yearLabel: "2019",
    facts: ["More than 550 in less than five years!"],
  },
  {
    order: 5,
    yearLabel: "2020–21",
    facts: [
      "We kept at it when the nation was hit by a pandemic.",
      "4Montgomery's Kids bought them laptops, books, school supplies, and more so they could stay connected to school.",
    ],
  },
  {
    order: 6,
    yearLabel: "Year ten",
    facts: [
      "That number soared to an astonishing 364!",
      "More than 2,000 children and youth over those ten years.",
      "48 scholarships since 2017.",
    ],
  },
  {
    order: 7,
    yearLabel: "2024–25",
    facts: [
      "4Montgomery's Kids embarked on a Pilot Guaranteed Income Program: Boost.",
      "$600 a month for one year – no strings attached.",
    ],
  },
  {
    order: 8,
    yearLabel: "2025",
    facts: ["A record-breaking year.", "Over 2,800 kids helped."],
  },
] satisfies TimelineMilestone[];
