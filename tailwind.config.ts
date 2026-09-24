import type { Config } from "tailwindcss";

// Design tokens per docs/BUILD-PROMPT.md §3.1 (color) and §3.2 (type).
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // §3.1 brand palette — derived from the logo (green + orange script
        // wordmark) and the current site's yellow button color.
        brand: {
          ink: "#1C2A20", // primary text, dark sections
          "ink-soft": "#3E4B41", // secondary text on light
          leaf: "#8EC63F", // brand green (logo "4MONTGOMERY'S", nav active)
          // ── CHANGED IN PLACE, TASK 15. Read this before trusting any
          //    pre-Task-15 screenshot or design comp that contains green text.
          //
          // Was #4F8A1E. §3.1 of the build prompt annotated that value "AA
          // contrast", which was simply not true: measured, it is 4.14:1 on
          // `paper`, 3.99:1 on `cream` and 3.66:1 on `mint` — all under AA's
          // 4.5:1 for the 12–14px bold labels and links that use it. #437517
          // measures 5.44 / 5.24 / 4.81 on those same three backgrounds.
          //
          // Why mutated in place rather than split into a `leaf-deep-text`
          // sibling, the way `tangerine` → `tangerine-deep` was handled two
          // lines below: `tangerine` has real non-text uses (Scribble strokes,
          // donut segments, the Quote glyph) that must stay the exact logo
          // orange, so splitting it kept both needs. `leaf-deep` has no such
          // second job — its own doc comment defines it as "green for
          // text/icons on light bg", and every one of its 44 call sites is
          // either rendered text, an icon, or a focus ring. All of those need
          // AA (a focus indicator needs 3:1 as a non-text UI component;
          // #437517 gives 5.24 on cream). A sibling token would have meant
          // migrating every call site to it and leaving a dead, failing token
          // behind.
          //
          // Blast radius — 44 occurrences across 28 files, of which:
          //   • 15 render a visible colour on every page load: DisplayCards'
          //     card titles + "Approved" pill (Home, Programs), About's
          //     timeline year labels, "4" stamp, board role pills, board
          //     "Read more", Get-Involved icons and the Candid profile link,
          //     Our Stories' 11 "Read the story" affordances, Blog's featured
          //     card CTA, Post's category pills and prev/next hover, Programs'
          //     bento "From:" source links, and the (currently unused) shadcn
          //     Badge `secondary` variant. All six pages are affected.
          //   • 22 are focus rings — only visible while keyboard-focused.
          //   • 1 is the donut's Housing segment, hardcoded as #437517 in
          //     HomeAllocationDonut.tsx (see the note there: a consistency
          //     choice, not an accessibility fix).
          // Full enumeration in .superpowers/sdd/PLAN/task-15-report.md §3a.
          "leaf-deep": "#437517", // green for text/icons on light bg (AA contrast)
          sun: "#FFB400", // brand yellow: primary CTA fills
          tangerine: "#F28C28", // logo "Kids" orange: STROKES/FILLS ONLY — see tangerine-deep
          // Text-safe orange. The logo orange #F28C28 only reaches 2.06–2.41:1
          // against every page background in this design, so it fails WCAG AA
          // for text at any size. Task 15 split the token: `tangerine` stays
          // the literal logo orange for non-text use (Scribble strokes, donut
          // segments, icon fills, rules), and `tangerine-deep` carries every
          // *text* use — 5.28 (paper) / 5.09 (cream) / 4.92 (butter) /
          // 5.35 (mint-tinted). Same hue family, readable.
          "tangerine-deep": "#A14D06",
          cream: "#FFF8EC", // default page background
          paper: "#FFFDF7", // cards
          butter: "#FFE9B8", // soft highlight panels
          mint: "#E6F4D3", // soft green panels
          sky: "#DCEEFB", // occasional cool accent panel (sparingly)
        },
      },
      fontFamily: {
        // §3.2 typography
        display: ["Fraunces", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      fontSize: {
        // Fluid type scale, §3.2. Consumed as text-hero / text-h2 / text-h3 /
        // text-body / text-eyebrow. Color + case utilities (e.g. uppercase,
        // text-brand-leaf-deep) are applied at the call site, not baked in.
        hero: [
          "clamp(2.6rem, 6vw, 5.75rem)",
          { lineHeight: "1", letterSpacing: "-0.03em" },
        ],
        h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.05" }],
        h3: ["clamp(1.35rem, 2vw, 1.75rem)", { lineHeight: "1.2" }],
        body: [
          "clamp(1.0625rem, 1rem + 0.3vw, 1.125rem)",
          { lineHeight: "1.65" },
        ],
        eyebrow: [
          "0.75rem",
          { letterSpacing: "0.22em", lineHeight: "1.5" },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
