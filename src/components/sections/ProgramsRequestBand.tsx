import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import Parallax from "@/components/motion/Parallax";
import Counter from "@/components/motion/Counter";
import MagneticButton from "@/components/motion/MagneticButton";
import Img from "@/components/ui/img";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { impactStats } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * All three paragraphs verbatim from docs/site-audit.md §7.1 Section 2, with
 * the build-prompt §6.5 "`\"yes!\" to` spacing fix" applied: the original
 * post ran `says "yes!"to virtually all requests` with no space before
 * "to" — a space is inserted here, nothing else in the sentence changes.
 */
const PARAGRAPH_1 =
  "Our services range from something as simple as buying a gift card for a birthday that would otherwise be forgotten, to sending a child to summer camp, to subsidizing transportation to get to a job, to paying rent to prevent a young adult from becoming homeless when aging out of Child Welfare.";

const PARAGRAPH_2_PREFIX = "Thanks to the generous contributions of our supporters, 4Montgomery’s Kids ";
const PARAGRAPH_2_HIGHLIGHT = 'says "yes!" to virtually all requests';
const PARAGRAPH_2_SUFFIX =
  " made to us by Montgomery County social workers, who know the needs of each child and young person in their caseload.";

const PARAGRAPH_3 =
  "The support that 4Montgomery’s Kids provides has played an important role in helping children and young people succeed. We’ve helped children and youth of all ages, enabling them to do better in school, participate in new activities, and reach goals like learning trades or attending college. But as proud as we are about where our “kids” go when they leave us, our goal is not about where they end up. It is about giving these kids a little bit of normalcy here and now, for those everyday things they otherwise might not get.";

/**
 * Highlighter-swipe effect (build-prompt §6.5 Section 2(B)): a `sun`-colored
 * band sweeps in behind the phrase the first time it scrolls into view, like
 * a highlighter dragging across the text.
 *
 * The brief describes this as a `background-size` animation from 0% to
 * 100%, but that's implemented here as a `clip-path` reveal on an
 * absolutely-positioned bar behind the text instead: this app's own
 * performance guardrail (§8, quoted directly in `TiltCard.tsx`'s comment) is
 * "animate only transform/opacity/clip-path", and `clip-path` is already
 * used the same way elsewhere in this app (`HomeImpact.tsx`'s hero-image
 * reveal) — a colored band sweeping left-to-right behind the phrase is the
 * exact same visual result through a property this codebase's animation
 * stack is designed around. `#FFB400` is `tailwind.config.ts`'s `brand.sun`.
 */
function HighlighterSwipe({ text }: { text: string }) {
  const reducedMotion = useReducedMotion();

  const barClassName = "absolute inset-x-0 bottom-[0.08em] -z-10 h-[0.5em] bg-brand-sun";

  return (
    <span className="relative inline-block whitespace-normal">
      {reducedMotion ? (
        <span aria-hidden="true" className={barClassName} style={{ clipPath: "inset(0 0% 0 0)" }} />
      ) : (
        <motion.span
          aria-hidden="true"
          className={barClassName}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        />
      )}
      <span className="relative z-10 font-bold text-brand-ink">{text}</span>
    </span>
  );
}

/**
 * PROGRAMS Section 2 — "No Request Too Big Or Too Small", per
 * docs/BUILD-PROMPT.md §6.5 Section 2. Left third: `tug-of-war.jpg` in a
 * tall rounded, parallaxing frame (the audit's original
 * `2022/02/left-side-hug.jpg` isn't in `public/images/`, so this substitutes
 * `tug-of-war.jpg`, per the brief). Right two-thirds: the H2 rendered via
 * `HandWrittenTitle` (its tangerine ellipse draws on view), the three
 * verbatim paragraphs (with the highlighter-swipe phrase), a Learn More
 * button, and the 10+/2,852 counters.
 */
export default function ProgramsRequestBand() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-3 lg:gap-16 lg:px-8">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[32px] shadow-[0_30px_60px_-25px_rgba(28,42,32,.4)] ring-1 ring-brand-ink/10 lg:col-span-1 lg:mx-0">
          <Parallax speed={10} className="aspect-[3/4] w-full">
            <Img
              src="tug-of-war.jpg"
              alt="Children pulling together on a rope during a tug-of-war game"
              width={507}
              height={338}
              className="h-full w-full object-cover"
            />
          </Parallax>
        </div>

        <div className="lg:col-span-2">
          {/* The H2 + divider from build-prompt §6.5 Section 2(A) is
              `HandWrittenTitle` itself per §6.5 Section 2(B): its tangerine
              ellipse draws around the headline on view, standing in for a
              plain divider rule. */}
          <HandWrittenTitle
            as="h2"
            title="No Request Too Big Or Too Small"
            subtitle="Our services range from a birthday gift card to a first month's rent."
          />

          <div className="-mt-6 flex flex-col gap-5 text-body text-brand-ink-soft">
            <p>{PARAGRAPH_1}</p>
            <p>
              {PARAGRAPH_2_PREFIX}
              <HighlighterSwipe text={PARAGRAPH_2_HIGHLIGHT} />
              {PARAGRAPH_2_SUFFIX}
            </p>
            <p>{PARAGRAPH_3}</p>
          </div>

          <MagneticButton className="mt-8 inline-block">
            <Button asChild size="lg">
              {/*
                The visible label stays "Learn More" (§6.5's copy); the
                destination is appended as visually-hidden text. A bare "Learn
                More" is the textbook generic link: it tells a screen-reader
                user cycling the links list nothing about where it goes, and
                Lighthouse's `link-text` audit flagged it, holding /programs
                at 92 SEO while every other page scored 100.

                Extra text inside the link rather than an `aria-label` on it,
                because `link-text` reads the link's text content — an
                `aria-label` alone left the audit failing (measured).
              */}
              <Link to="/our-stories">
                Learn More
                <span className="sr-only">&nbsp;about the stories we&rsquo;ve helped write</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>

          <div className="mt-12 flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <Counter value={impactStats.yearsServing} suffix="+" className="text-4xl font-bold text-brand-tangerine-deep md:text-5xl" />
              <p className="mt-2 max-w-[10rem] text-eyebrow uppercase text-brand-ink-soft">
                Years serving children and youth
              </p>
            </div>
            <div>
              <Counter value={impactStats.requestsFulfilled} className="text-4xl font-bold text-brand-tangerine-deep md:text-5xl" />
              <p className="mt-2 max-w-[10rem] text-eyebrow uppercase text-brand-ink-soft">
                Fulfilled requests
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
