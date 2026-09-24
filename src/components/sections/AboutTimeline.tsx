import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { timeline } from "@/data/timeline";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MilestoneCardProps {
  yearLabel: string;
  facts: string[];
  className?: string;
}

function MilestoneCard({ yearLabel, facts, className }: MilestoneCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl bg-brand-paper p-7 shadow-[0_25px_50px_-30px_rgba(28,42,32,.4)] ring-1 ring-brand-ink/10",
        className,
      )}
    >
      <span className="font-display text-4xl font-bold text-brand-leaf-deep">{yearLabel}</span>
      <ul className="space-y-2 text-brand-ink-soft">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </div>
  );
}

/** Vertical stacked fallback: mobile/tablet (< lg) and always under reduced motion. */
function VerticalTimeline() {
  return (
    <ol className="relative mx-auto mt-12 max-w-2xl space-y-8 px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-[15px] top-2 w-px bg-brand-leaf/40"
      />
      {timeline.map((milestone) => (
        <li key={milestone.order} className="relative pl-10">
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf ring-4 ring-brand-cream"
          />
          <Reveal y={16}>
            <MilestoneCard yearLabel={milestone.yearLabel} facts={milestone.facts} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/**
 * ABOUT US NEW Section 2b — Our journey timeline, per
 * docs/BUILD-PROMPT.md §6.3 NEW Section 2b. Facts only from
 * `src/data/timeline.ts` (Task 3), 2015 through 2025.
 *
 * Desktop (≥1024px, motion allowed): a GSAP ScrollTrigger pins the section
 * and translates the card track horizontally as the page scrolls, drawing a
 * horizontal line and popping each milestone in with a spring
 * (`back.out`) timed to its position along the track. Mobile and reduced
 * motion both get a plain vertical stacked list instead — a deliberate,
 * documented fallback (see task-9-report.md) rather than forcing the pin
 * mechanic onto a viewport/preference it doesn't suit.
 */
export default function AboutTimeline() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (reducedMotion) return undefined;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const pinTarget = pinRef.current;
        if (!track || !pinTarget) return undefined;

        const totalScroll = Math.max(track.scrollWidth - pinTarget.clientWidth, 0);
        if (totalScroll <= 0) return undefined;

        const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinTarget,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: -totalScroll, ease: "none", duration: 1 }, 0);

        if (lineRef.current) {
          tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
        }

        cards.forEach((card, index) => {
          const at = cards.length > 1 ? index / (cards.length - 1) : 0;
          tl.fromTo(
            card,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, ease: "back.out(2.2)", duration: 0.22 },
            Math.max(at - 0.1, 0),
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  if (reducedMotion) {
    return (
      <section className="bg-brand-cream py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="font-hand text-2xl text-brand-tangerine-deep">our journey</p>
            <h2 className="mt-1 font-display text-h2 text-brand-ink">
              A decade of showing up for Montgomery County&rsquo;s kids
            </h2>
          </Reveal>
        </div>
        <VerticalTimeline />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-cream">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-8 lg:pb-0">
        <Reveal>
          <p className="font-hand text-2xl text-brand-tangerine-deep">our journey</p>
          <h2 className="mt-1 font-display text-h2 text-brand-ink">
            A decade of showing up for Montgomery County&rsquo;s kids
          </h2>
        </Reveal>
      </div>

      {/* Desktop: pinned horizontal scroll track. */}
      <div ref={pinRef} className="relative hidden h-screen w-full items-center overflow-hidden lg:flex">
        <div
          ref={lineRef}
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-1 w-full origin-left -translate-y-1/2 bg-brand-leaf/40"
        />
        <div
          ref={trackRef}
          className="relative flex w-max items-center gap-10 px-[6vw] will-change-transform"
        >
          {timeline.map((milestone, index) => (
            <div
              key={milestone.order}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-[360px] shrink-0"
            >
              <MilestoneCard yearLabel={milestone.yearLabel} facts={milestone.facts} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/tablet: vertical stacked list. */}
      <div className="lg:hidden">
        <VerticalTimeline />
      </div>
    </section>
  );
}
