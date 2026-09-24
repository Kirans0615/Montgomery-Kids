import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/**
 * The 3 testimonials this NEW section reuses from Home, per §6.4 Section 3:
 * the Foster Mom (football fee), the Aging Out youth (first apartment) and
 * the Social Worker phone story — matched by `testimonials.ts`'s stable
 * `id`s rather than duplicating any copy.
 */
const VOICE_IDS = [
  "foster-mom-football-fee",
  "aging-out-first-apartment",
  "social-worker-phone-story",
] as const;

const voices: Testimonial[] = VOICE_IDS.map((id) => {
  const testimonial = testimonials.find((entry) => entry.id === id);
  if (!testimonial) {
    throw new Error(`StoriesVoices: missing testimonial id "${id}" in src/data/testimonials.ts`);
  }
  return testimonial;
});

const AUTO_ADVANCE_MS = 6000;

function VoiceCard({ voice }: { voice: Testimonial }) {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <Quote aria-hidden="true" className="h-10 w-10 text-brand-tangerine/40" fill="currentColor" />
      <p className="mt-4 max-w-2xl text-lg text-brand-ink sm:text-xl">&ldquo;{voice.quote}&rdquo;</p>
      <p className="mt-5 font-hand text-2xl text-brand-tangerine-deep">— {voice.attribution}</p>
    </div>
  );
}

/**
 * OUR STORIES NEW Section 3 — "Voices strip": a horizontal auto-advancing
 * quote carousel on `mint`, per §6.4. Auto-advance pauses entirely under
 * reduced motion (no interval is set at all) while the dot navigation
 * remains fully usable, and the content swap itself skips the
 * framer-motion crossfade in that case too — a plain instant swap, never
 * merely "faster", per §10/§13.
 *
 * The card transition is a plain keyed fade-IN (`initial`/`animate` only,
 * no `AnimatePresence`/`exit`/`mode="wait"`) — the same defensive choice
 * made in `StoriesGrid.tsx`. `AnimatePresence mode="wait"` gates mounting
 * the new card on the old one's `exit` animation finishing, which is driven
 * by `requestAnimationFrame`; a backgrounded/throttled tab (confirmed while
 * building this page — see StoriesGrid's comment) can stall that rAF
 * indefinitely, permanently freezing the carousel mid-fade with the dots
 * and the displayed quote out of sync. A real visitor who leaves this tab
 * mid-auto-advance and comes back could hit the exact same freeze, since
 * `setInterval` (driving `index`) keeps ticking in a background tab even
 * when rAF-driven animations stall — so this isn't just a test-sandbox
 * artifact worth working around, it's a real robustness fix.
 */
export default function StoriesVoices() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % voices.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const goTo = (next: number) => setIndex(((next % voices.length) + voices.length) % voices.length);

  return (
    <section className="bg-brand-mint/40 py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">Voices</h2>
          <Scribble variant="squiggle" color="tangerine" className="mx-auto mt-3 h-3 w-32" />
        </Reveal>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="What people say about 4Montgomery's Kids"
          className="relative mt-14 min-h-[220px]"
        >
          {reducedMotion ? (
            <VoiceCard voice={voices[index]} />
          ) : (
            <motion.div
              key={voices[index].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <VoiceCard voice={voices[index]} />
            </motion.div>
          )}
        </div>

        {/*
          The dot stays 10px, but the button around it is padded to a 44x44
          hit area. At the bare 10x10 these were the only thing keeping
          /our-stories off a 100 Accessibility score (Lighthouse `target-size`:
          "10px by 10px, should be at least 24px by 24px"), and they missed
          §10's 44px touch-target floor by a wide margin.
        */}
        <div className="mt-8 flex items-center justify-center">
          {voices.map((voice, dotIndex) => (
            <button
              key={voice.id}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Show quote from ${voice.attribution}`}
              aria-current={dotIndex === index}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-2.5 rounded-full transition-all",
                  dotIndex === index ? "w-6 bg-brand-tangerine" : "w-2.5 bg-brand-ink/25",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
