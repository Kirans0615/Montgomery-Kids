import { useId, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { allocation } from "@/data/allocation";
import { cn } from "@/lib/utils";

/**
 * Categorical palette for the 5 allocation segments. `brand.sky` (#DCEEFB)
 * is too pale to read as a distinct donut slice against the cream page
 * background, so "Transportation" uses a deeper, chart-only blue in the
 * same family instead — a design choice, not a data change (the `dataviz`
 * skill calls for enough saturation/contrast between categorical slices).
 */
const SEGMENT_COLORS = [
  "#F28C28", // Education — tangerine
  "#3E8FB0", // Transportation — deep sky (chart-only shade)
  "#8EC63F", // Recreational activities — leaf
  // Housing — kept numerically in step with the `leaf-deep` token, which
  // Task 15 darkened from #4F8A1E to #437517. To be clear about what this
  // change is and isn't: an SVG `stroke` on a chart segment is a graphical
  // object, not text, so the only rule that applies is 3:1 against adjacent
  // colours — which #4F8A1E already met, and no audit flagged it. This is a
  // **visual-consistency choice**, so the Housing slice still matches the
  // green used for text elsewhere on the page, not an accessibility fix.
  // Reverting it to #4F8A1E would break nothing; it would just make the
  // slice a slightly different green from the legend text beside it.
  "#437517",
  "#FFB400", // Personal & household needs — sun
];

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 92;
const STROKE_WIDTH = 34;

/**
 * `sr-only` on a `<table>` does NOT hide it from layout: Tailwind's `sr-only`
 * sets `width: 1px`, but CSS `width` on a table is only a *minimum* — the
 * table still expands to its min-content width (measured at 496px here), and
 * because `sr-only` also makes it `position: absolute`, that 496px box joined
 * the page's scrollable overflow area and pushed `documentElement.scrollWidth`
 * to 519px at a 390px viewport (confirmed with Playwright in Task 15's QA
 * pass — Home and Programs both scrolled sideways on a phone because of it).
 * Wrapping the table in an `sr-only` *div* fixes it: a block box does honour
 * `width: 1px`, and the table inside is clipped by the wrapper's
 * `overflow: hidden` + `clip`.
 */
function AccessibleDataTable({ visuallyHidden }: { visuallyHidden: boolean }) {
  const table = (
    <table>
      <caption
        className={cn(
          !visuallyHidden &&
            "mb-4 text-left font-display text-h3 text-brand-ink",
        )}
      >
        Where the money goes ({allocation.sourceLabel})
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            className={
              visuallyHidden
                ? undefined
                : "border-b border-brand-ink/15 px-3 py-2 text-left text-sm font-semibold text-brand-ink"
            }
          >
            Category
          </th>
          <th
            scope="col"
            className={
              visuallyHidden
                ? undefined
                : "border-b border-brand-ink/15 px-3 py-2 text-left text-sm font-semibold text-brand-ink"
            }
          >
            Share of grants
          </th>
        </tr>
      </thead>
      <tbody>
        {allocation.segments.map((segment, index) => (
          <tr key={segment.label}>
            <th
              scope="row"
              className={
                visuallyHidden
                  ? undefined
                  : "flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-brand-ink"
              }
            >
              {!visuallyHidden && (
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                  }}
                />
              )}
              {segment.label}
            </th>
            <td
              className={
                visuallyHidden
                  ? undefined
                  : "px-3 py-2 text-sm text-brand-ink-soft"
              }
            >
              {segment.percent}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return visuallyHidden ? <div className="sr-only">{table}</div> : table;
}

function InteractiveDonut() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();

  const segmentsWithOffset = allocation.segments.reduce<
    Array<(typeof allocation.segments)[number] & { offset: number }>
  >((acc, segment) => {
    const previous = acc[acc.length - 1];
    const offset = previous ? previous.offset + previous.percent / 100 : 0;
    return [...acc, { ...segment, offset }];
  }, []);

  const active = activeIndex !== null ? allocation.segments[activeIndex] : null;

  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>
            Grant allocation by category, {allocation.sourceLabel}
          </title>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#1C2A20"
            strokeOpacity={0.06}
            strokeWidth={STROKE_WIDTH}
          />
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {segmentsWithOffset.map((segment, index) => {
              const isDimmed = activeIndex !== null && activeIndex !== index;
              return (
                // The dim lives on a plain `<g>` wrapper, not on the circle's
                // own `style`. `motion.circle` treats `opacity` as one of its
                // managed motion values and writes its own value over anything
                // in `style` — so the "fade the other segments" effect silently
                // did nothing (every ring read back `opacity: 1` under
                // Playwright, both before and after this task's changes). A
                // bare SVG `<g>` is outside framer-motion's control, so its
                // opacity sticks.
                <g
                  key={segment.label}
                  style={{
                    opacity: isDimmed ? 0.3 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <motion.circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="butt"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: segment.percent / 100 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      pathOffset: segment.offset,
                      // Hover/focus emphasis is opacity + scale only. This used
                      // to grow `strokeWidth` from 34 to 40 — an SVG *geometry*
                      // property, which forces layout and paint on every frame
                      // of the transition and sits outside §8's "animate only
                      // transform, opacity and clip-path" guardrail.
                      //
                      // `scale` is given as framer-motion's own transform
                      // shorthand rather than a raw `transform: "scale(...)"`
                      // string: `motion.circle` composes the element's
                      // `transform` from its transform motion values, so a raw
                      // string in `style` is silently overwritten (verified with
                      // Playwright — every circle read back `scale(1)`).
                      // `transformBox: fill-box` + `transformOrigin: center`
                      // pivot the scale on the circle's own centre rather than
                      // the SVG user-space origin, so the ring grows in place
                      // inside the rotated <g>.
                      scale: activeIndex === index ? 1.045 : 1,
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {active ? (
            <>
              <span className="font-display text-3xl font-bold text-brand-ink">
                {active.percent}%
              </span>
              <span className="mt-1 max-w-[7rem] text-xs font-semibold uppercase tracking-wide text-brand-ink-soft">
                {active.label}
              </span>
            </>
          ) : (
            <span className="max-w-[7rem] font-hand text-2xl text-brand-ink-soft">
              every request, funded
            </span>
          )}
        </div>
      </div>

      <ul className="flex w-full max-w-sm flex-col gap-2">
        {allocation.segments.map((segment, index) => (
          <li key={segment.label}>
            <button
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              className={cn(
                // min-h-11 (44px) keeps every legend row at the §10 touch-target
                // minimum; at py-2 alone these rows measured 36px tall.
                "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep",
                activeIndex === index
                  ? "bg-brand-paper shadow-sm"
                  : "hover:bg-brand-paper/60",
              )}
            >
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                }}
              />
              <span className="flex-1 text-sm font-medium text-brand-ink">
                {segment.label}
              </span>
              <span className="font-display text-sm font-bold text-brand-ink">
                {segment.percent}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeAllocationDonut() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">
            Where the money goes
          </h2>
          <Scribble
            variant="squiggle"
            color="tangerine"
            className="mt-3 h-3 w-32"
          />
        </Reveal>

        <div className="mt-14">
          {reducedMotion ? (
            <AccessibleDataTable visuallyHidden={false} />
          ) : (
            <>
              <InteractiveDonut />
              <AccessibleDataTable visuallyHidden />
            </>
          )}
        </div>

        <p className="mt-10 max-w-xl font-hand text-2xl leading-snug text-brand-ink-soft">
          &ldquo;{allocation.captionQuote}&rdquo;
        </p>
        <p className="mt-1 text-sm text-brand-ink/70">
          — {allocation.sourceLabel}
        </p>
      </div>
    </section>
  );
}
