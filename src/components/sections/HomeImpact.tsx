import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import Counter from "@/components/motion/Counter";
import Parallax from "@/components/motion/Parallax";
import MagneticButton from "@/components/motion/MagneticButton";
import Img from "@/components/ui/img";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { impactStats, site } from "@/data/site";
import { DONATE_URL, openDonate } from "@/lib/donate";

/** lucide-react@1.47.0 ships no `Facebook` icon — see docs/BUILD-PROMPT.md
 * §4/task-7 "known issue". Same minimal traced glyph used in Footer.tsx. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

interface StatTile {
  value: number;
  suffix: string;
  label: string;
  tooltip?: string;
}

/** Audit §11.13 (10-year post) + §7 Programs counters (§6.5 "10" → "10+" per §12). */
const STAT_TILES: StatTile[] = [
  { value: impactStats.yearsServing, suffix: "+", label: "years serving children and youth" },
  { value: impactStats.requestsFulfilled, suffix: "", label: "fulfilled requests" },
  {
    value: 100,
    suffix: "%",
    label: "of your donations go directly to the kids",
    tooltip: "All administrative costs are covered by our volunteer board.",
  },
];

export default function HomeImpact() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-ink py-24 text-brand-cream md:py-32">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute -top-px left-0 h-10 w-full text-brand-cream"
      >
        <path fill="currentColor" d="M0 32C240 6 480 -6 720 10C960 26 1200 44 1440 22V60H0V32Z" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5 lg:gap-12">
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-h2 text-brand-cream">
              We&rsquo;ve made a difference in the lives of over{" "}
              <span className="relative inline-flex items-center gap-2 whitespace-nowrap">
                {/* Deliberately hardcoded, NOT centralized into site.ts's
                    impactStats alongside requestsFulfilled/yearsServing.
                    This "2,800 kids" figure is a distinct, unreconciled
                    number from the audit (see README's "Content decisions
                    for the client to confirm" §1) — it is not the same
                    thing as impactStats.requestsFulfilled (2,852) even
                    though the two are close. Per the project's explicit
                    rule, these different "kids helped" figures must be
                    kept exactly where they appear and never silently
                    reconciled — do not "finish the job" by folding this
                    into impactStats. */}
                <Counter value={2800} className="text-brand-sun" />
                <Scribble variant="star" color="tangerine" className="h-6 w-6 shrink-0" />
              </span>{" "}
              kids!
            </h2>
            <Scribble variant="underline" color="tangerine" className="mt-3 h-3 w-32" />

            <p className="mt-6 max-w-md text-body text-brand-cream/85">{site.impactParagraph}</p>

            <MagneticButton className="mt-8 inline-block">
              <Link
                to="/about-us"
                className="inline-flex items-center rounded-full border border-brand-cream px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-cream transition hover:bg-brand-cream/10"
              >
                About Us
              </Link>
            </MagneticButton>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={0.1}>
            <div className="relative">
              <motion.div
                className="overflow-hidden rounded-[28px]"
                initial={reducedMotion ? { clipPath: "inset(0% round 28px)" } : { clipPath: "inset(20% round 28px)" }}
                whileInView={{ clipPath: "inset(0% round 28px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Parallax speed={10}>
                  <Img
                    src="double-dutch.jpg"
                    alt="A child leaps mid-air over double-dutch jump ropes as a crowd cheers"
                    width={1450}
                    height={801}
                    className="h-auto w-full rounded-[28px] object-cover"
                  />
                </Parallax>
              </motion.div>

              <div className="absolute -bottom-6 -left-4 hidden -rotate-6 rounded-sm bg-brand-paper p-3 pb-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,.4)] sm:block">
                <div className="h-3 w-24 rounded-sm bg-brand-sun/70" />
                <p className="mt-2 font-hand text-xl text-brand-ink">a leap of joy</p>
              </div>
            </div>

            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-brand-cream/90 underline-offset-4 hover:text-brand-cream hover:underline"
            >
              <FacebookIcon className="h-5 w-5" />
              Follow us on Facebook
            </a>

            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener"
              onClick={openDonate}
              className="ml-6 inline-flex items-center gap-2 rounded-full bg-brand-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90"
            >
              Donate
            </a>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STAT_TILES.map((tile) => (
            <Reveal key={tile.label} className="rounded-3xl border border-brand-cream/15 bg-brand-cream/5 p-6">
              <div className="flex items-center gap-2">
                <Counter value={tile.value} suffix={tile.suffix} className="text-4xl text-brand-sun" />
                {tile.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        aria-label="What does this mean?"
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-cream/40 text-brand-cream/70 hover:text-brand-cream"
                      >
                        <HelpCircle aria-hidden="true" className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent>{tile.tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="mt-2 text-sm text-brand-cream/75">{tile.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
