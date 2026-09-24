import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import MagneticButton from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { cn } from "@/lib/utils";

/**
 * Preset amounts: the donation form's own presets ($50/$100/$250/$500/$1,000
 * — audit §12 "Step 1 AMOUNT") merged with the "How you can help" post's
 * amounts ($100/$150/$200 — audit §11.21), per build-prompt §6.1 NEW
 * Section 6. $250 (form-only, no matching audit fact) is dropped in favor of
 * $150/$200, which do have facts — every card below traces to an audit
 * sentence, nothing is invented.
 */
const GIFT_LEVELS = [
  {
    amount: 50,
    blurbs: ["helps provide a simple gift card for a birthday that would otherwise be forgotten"],
  },
  {
    amount: 100,
    blurbs: ["helps provide transportation for a child going to summer camp"],
  },
  {
    amount: 150,
    blurbs: [
      "helps provide tutoring for youth who has not done well in school this semester",
      "helps provide a community pool membership",
    ],
  },
  {
    amount: 200,
    blurbs: ["helps provide books and new clothes for children at the beginning of the school year"],
  },
  {
    amount: 500,
    blurbs: [
      "Scholarships, ranging from $500 – $1,000, to high school graduates in foster care who are pursuing further education.",
    ],
  },
  {
    amount: 1000,
    blurbs: [
      "Scholarships, ranging from $500 – $1,000, to high school graduates in foster care who are pursuing further education.",
    ],
  },
] as const;

const SPARKLE_POSITIONS = [
  { className: "left-[8%] top-[18%] h-6 w-6", delay: 0 },
  { className: "right-[12%] top-[28%] h-4 w-4", delay: 0.6 },
  { className: "left-[20%] bottom-[16%] h-5 w-5", delay: 1.2 },
  { className: "right-[18%] bottom-[22%] h-7 w-7", delay: 1.8 },
];

function FloatingSparkles() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPARKLE_POSITIONS.map((sparkle, index) => (
        <motion.div
          key={index}
          className={cn("absolute text-brand-ink/25", sparkle.className)}
          animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, delay: sparkle.delay, ease: "easeInOut" }}
        >
          <Scribble variant="star" color="tangerine" />
        </motion.div>
      ))}
    </div>
  );
}

export default function HomeDonateBand() {
  const [selected, setSelected] = useState<number>(100);
  const active = GIFT_LEVELS.find((level) => level.amount === selected) ?? GIFT_LEVELS[1];

  return (
    <section className="relative overflow-hidden bg-brand-sun py-24 md:py-32">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute -top-px left-0 h-10 w-full text-brand-cream"
      >
        <path fill="currentColor" d="M0 32C240 6 480 -6 720 10C960 26 1200 44 1440 22V60H0V32Z" />
      </svg>

      <FloatingSparkles />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">
            Make a difference in the life of a child in foster care in Montgomery County.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            role="group"
            aria-label="Choose a donation amount to preview its impact"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {GIFT_LEVELS.map((level) => (
              <button
                key={level.amount}
                type="button"
                onClick={() => setSelected(level.amount)}
                aria-pressed={selected === level.amount}
                className={cn(
                  "min-h-11 rounded-full border-2 px-5 py-2 text-sm font-bold transition",
                  selected === level.amount
                    ? "border-brand-ink bg-brand-ink text-brand-cream"
                    : "border-brand-ink/30 bg-brand-cream/40 text-brand-ink hover:border-brand-ink",
                )}
              >
                ${level.amount.toLocaleString()}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative mx-auto mt-8 min-h-[9rem] max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.amount}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-brand-cream/60 p-6 backdrop-blur-sm"
            >
              <p className="font-display text-lg font-bold text-brand-ink">
                ${active.amount.toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1 text-brand-ink-soft">
                {active.blurbs.map((blurb) => (
                  <li key={blurb}>{blurb}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        <MagneticButton className="mt-10 inline-block">
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener"
            onClick={openDonate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-10 py-4 text-base font-bold uppercase tracking-wide text-brand-cream transition hover:bg-brand-ink/90"
          >
            Donate
          </a>
        </MagneticButton>

        <p className="mt-5 font-hand text-2xl text-brand-ink/80">
          100% of your donations go directly to helping the kids
        </p>
        <p className="mt-2 text-xs text-brand-ink/80">You&rsquo;ll be taken to our secure donation form.</p>
      </div>
    </section>
  );
}
