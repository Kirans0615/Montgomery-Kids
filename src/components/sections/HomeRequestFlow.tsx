import { Bus, Laptop, Tent } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import DisplayCards from "@/components/ui/display-cards";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * 3-step model, verbatim from the audit: step 1 is the "Serving the local
 * community" blurb (audit §7 Section 1), step 2 paraphrases the donation-page
 * mission line "...requests made to us by Montgomery County social workers,
 * who know the needs of each child and young person in their caseload."
 * (audit §7 Section 4 "No Request Too Big Or Too Small"), step 3 is verbatim
 * from the "Fall" for Kids post (audit §11.2).
 */
const STEPS = [
  {
    title: "A social worker spots a need",
    body: "We work directly with county social workers to fill the needs they have identified for children in their care.",
  },
  {
    title: "The request comes to us",
    body: "Montgomery County social workers, who know the needs of each child and young person in their caseload.",
  },
  {
    title: "We say yes!",
    body: "Most of the time, we turn around requests in less than 24 hours.",
  },
] as const;

/** All three facts from the "Fall" for Kids post (audit §11.2). */
const REQUEST_CARDS = [
  {
    icon: <Tent className="size-4 text-brand-ink" />,
    title: "Summer camp",
    description: "Eleven kids sent to camp",
    date: "Fall 2025",
  },
  {
    icon: <Laptop className="size-4 text-brand-ink" />,
    title: "Computers",
    description: "Four computers for schoolwork",
    date: "Fall 2025",
  },
  {
    icon: <Bus className="size-4 text-brand-ink" />,
    title: "Emergency ride",
    description: "Uber card on its way within an hour",
    date: "Oct 2025",
  },
] as const;

function Timeline() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative pl-12">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-brand-ink/10">
        <motion.div
          className="w-full origin-top bg-brand-leaf"
          style={{ height: "100%" }}
          initial={reducedMotion ? { scaleY: 1 } : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <ol className="space-y-12">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-12 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-leaf text-[10px] font-bold text-brand-cream ring-4 ring-brand-cream"
            >
              {index + 1}
            </span>
            <h3 className="font-display text-h3 text-brand-ink">{step.title}</h3>
            <p className="mt-2 max-w-md text-body text-brand-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HomeRequestFlow() {
  return (
    <section className="bg-brand-mint/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">How a request becomes a yes</h2>
          <Scribble variant="squiggle" color="leaf" className="mt-3 h-3 w-32" />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <Timeline />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex justify-center py-10 lg:justify-start lg:pl-8">
              <DisplayCards cards={[...REQUEST_CARDS]} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
