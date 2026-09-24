import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, GraduationCap, UtensilsCrossed, Wallet, type LucideIcon } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import MagneticButton from "@/components/motion/MagneticButton";
import DisplayCards from "@/components/ui/display-cards";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supportsList, namedPrograms } from "@/data/programs";
import { publicUrl } from "@/lib/publicUrl";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Resolves the 3 icon names `src/data/programs.ts` uses for `namedPrograms`. */
const NAMED_PROGRAM_ICONS: Record<string, LucideIcon> = {
  Wallet,
  GraduationCap,
  UtensilsCrossed,
};

/**
 * A single hand-drawn stroke that reads as both a checkmark (the tick) and a
 * leaf (the asymmetric curve into the tick, like a leaf's midrib), per
 * build-prompt §6.5 Section 1(B) "hand-drawn `leaf` checkmark drawing itself
 * before each item". Drawn via `pathLength`, exactly like every other
 * hand-drawn mark in the app (see `Scribble.tsx`), rather than a rigid
 * lucide `Check` icon.
 */
const LEAF_CHECK_PATH = "M2.5 12.8 C 5 12, 7.5 14.5, 9.5 18 C 12.5 12, 16.5 5.5, 21 2.5";

const STAGGER_S = 0.06;

const listContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_S } },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const checkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.45, ease: EASE } },
};

function LeafCheck({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brand-leaf" aria-hidden="true">
      <motion.path
        d={LEAF_CHECK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(animated
          ? { variants: checkVariants }
          : { initial: { pathLength: 1, opacity: 1 } })}
      />
    </svg>
  );
}

function SupportsList() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <ul className="mt-8 flex flex-col gap-3">
        {supportsList.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <LeafCheck animated={false} />
            <span className="text-body text-brand-cream/90">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className="mt-8 flex flex-col gap-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={listContainerVariants}
    >
      {supportsList.map((item) => (
        <motion.li key={item} variants={listItemVariants} className="flex items-start gap-3">
          <LeafCheck animated />
          <span className="text-body text-brand-cream/90">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * PROGRAMS Section 1 — Hero, per docs/BUILD-PROMPT.md §6.5 Section 1.
 * `dance-recital.jpg` background with a slow parallax and an ink gradient
 * from the left (so the list stays legible while the photo shows through on
 * the right, behind the DisplayCards stack); H1 rises word-by-word; the
 * 10-item "what your money supports" list (verbatim, audit §9) animates in
 * one-by-one with a hand-drawn leaf checkmark per item; the right third
 * holds the DisplayCards stack of the three named programs.
 */
export default function ProgramsHero() {
  const cards = namedPrograms.map((program) => {
    const Icon = NAMED_PROGRAM_ICONS[program.icon];
    return {
      icon: <Icon className="size-4 text-brand-ink" aria-hidden="true" />,
      title: program.title,
      description: program.description,
      date: program.date,
    };
  });

  return (
    <section className="relative overflow-hidden bg-brand-ink py-28 pt-40 md:py-36 md:pt-48">
      <div className="absolute inset-0 overflow-hidden">
        <Parallax speed={10} className="absolute inset-x-0 -inset-y-[12%]">
          <picture>
            <source
              type="image/webp"
              srcSet={`${publicUrl("images/opt/dance-recital-480.webp")} 480w, ${publicUrl("images/opt/dance-recital-960.webp")} 960w, ${publicUrl("images/opt/dance-recital-1600.webp")} 1600w`}
              sizes="100vw"
            />
            <img
              src={publicUrl("images/dance-recital.jpg")}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </picture>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/80 to-brand-ink/15" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[2fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <h1 className="font-display text-hero leading-[1.0] tracking-[-0.03em] text-brand-cream">
            <SplitText text="What your money supports" as="span" by="word" staggerMs={40} />
          </h1>

          <SupportsList />

          <MagneticButton className="mt-10 inline-block">
            <Button asChild size="lg">
              <Link to="/about-us">
                About 4Montgomery&rsquo;s Kids
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
        </div>

        <div className="flex items-center justify-center py-6 lg:py-0">
          <DisplayCards cards={cards} />
        </div>
      </div>
    </section>
  );
}
