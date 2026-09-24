import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import MagneticButton from "@/components/motion/MagneticButton";
import Img from "@/components/ui/img";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Two blob outlines with identical path-command structure (M + 4 C segments
 * + Z), differing only in coordinates, so framer-motion's numeric-token
 * interpolation on the `d` attribute produces a genuine morph rather than a
 * jump-cut between shapes.
 */
const BLOB_PATH_A =
  "M180 24C244 40 300 92 296 156C292 220 228 268 164 284C100 300 32 284 16 224C0 164 24 96 76 56C112 28 140 12 180 24Z";
const BLOB_PATH_B =
  "M164 12C224 8 292 44 304 104C316 164 272 232 208 268C144 304 60 296 28 240C-4 184 12 108 60 60C88 32 124 16 164 12Z";

function MorphingBlob() {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 320 320"
      aria-hidden="true"
      className="absolute -inset-6 -z-10 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-brand-mint sm:-inset-10 sm:h-[calc(100%+5rem)] sm:w-[calc(100%+5rem)]"
    >
      <motion.path
        fill="currentColor"
        d={BLOB_PATH_A}
        {...(reducedMotion
          ? {}
          : {
              animate: { d: [BLOB_PATH_A, BLOB_PATH_B, BLOB_PATH_A] },
              transition: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            })}
      />
    </svg>
  );
}

interface PolaroidProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  finalRotate: number;
  positionClassName: string;
}

/**
 * Renders "stacked" (no rotation, nudged toward center) and fans out to its
 * final tilted resting position — set via plain absolute-position Tailwind
 * classes rather than motion `x`/`y`, so the "fan apart" transform (which
 * framer-motion applies as an inline `transform`) never has to fight a
 * Tailwind `translate-*` utility's own `transform` value for the same node.
 */
function Polaroid({ src, alt, width, height, caption, finalRotate, positionClassName }: PolaroidProps) {
  const reducedMotion = useReducedMotion();

  const finalState = { rotate: finalRotate, x: 0, y: 0, opacity: 1 };
  const stackOffset = finalRotate < 0 ? 18 : -18;

  return (
    <motion.div
      className={cn("absolute", positionClassName)}
      initial={reducedMotion ? finalState : { rotate: 0, x: stackOffset, y: -16, opacity: 0 }}
      whileInView={finalState}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-56 rounded-sm bg-brand-paper p-3 pb-6 shadow-[0_30px_60px_-20px_rgba(28,42,32,.35)] ring-1 ring-brand-ink/10 sm:w-64">
        <Img src={src} alt={alt} width={width} height={height} className="aspect-[4/3] w-full rounded-[2px] object-cover" />
        <p className="mt-3 text-center font-hand text-xl text-brand-ink-soft">{caption}</p>
      </div>
    </motion.div>
  );
}

export default function HomeAboutStrip() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
        <Reveal>
          <div>
            <h2 className="font-display text-h2 text-brand-ink">
              About{" "}
              <span className="relative inline-block whitespace-nowrap">
                4Montgomery's Kids
                <Scribble
                  variant="underline"
                  color="leaf"
                  className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full"
                />
              </span>
            </h2>

            <p className="mt-6 max-w-md font-display text-2xl italic leading-snug text-brand-ink-soft">
              &ldquo;{site.pullQuote}&rdquo;
            </p>

            <MagneticButton className="mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link to="/about-us">
                  About
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </Reveal>

        <div className="relative mx-auto h-[420px] w-full max-w-md sm:h-[480px]">
          <MorphingBlob />

          <Polaroid
            src="tug-of-war.jpg"
            alt="Laughing kids pulling together in a game of tug of war"
            width={507}
            height={338}
            caption="pulling together"
            finalRotate={-6}
            positionClassName="left-2 top-6 sm:left-6 sm:top-10"
          />
          <Polaroid
            src="double-dutch.jpg"
            alt="A child leaps mid-air over double-dutch jump ropes as a crowd cheers"
            width={1450}
            height={801}
            caption="big dreams, small dreams"
            finalRotate={5}
            positionClassName="bottom-6 right-2 sm:bottom-10 sm:right-6"
          />
        </div>
      </div>
    </section>
  );
}
