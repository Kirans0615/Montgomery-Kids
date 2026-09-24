"use client";
import { cn } from "@/lib/utils";
import { Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  approved?: boolean;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-brand-ink" />,
  title = "Featured",
  description = "",
  date = "",
  titleClassName = "text-brand-leaf-deep",
  approved = true,
  onTouchStart,
  isFocused,
}: DisplayCardProps & {
  onTouchStart?: () => void;
  isFocused?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[18rem] sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 border-brand-ink/10 bg-brand-paper/80 backdrop-blur-sm px-4 py-3 shadow-[0_20px_40px_-20px_rgba(28,42,32,.35)] transition-all duration-700",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[16rem] sm:after:w-[20rem] after:bg-gradient-to-l after:from-brand-cream after:to-transparent after:content-['']",
        "hover:border-brand-sun/60 hover:bg-brand-paper [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        isFocused && "border-brand-sun/60 bg-brand-paper before:opacity-0 grayscale-0",
        className
      )}
      onTouchStart={onTouchStart}
    >
      <div>
        <span className="relative inline-block rounded-full bg-brand-sun p-1">{icon}</span>
        <p className={cn("text-lg font-semibold", titleClassName)}>{title}</p>
        {approved && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.6 }}
            className="relative z-10 ml-auto inline-flex items-center gap-1 rounded-full bg-brand-mint px-2 py-0.5 text-xs font-bold text-brand-leaf-deep"
          >
            <BadgeCheck className="size-3.5" /> Approved
          </motion.span>
        )}
      </div>
      <p className="whitespace-nowrap text-lg text-brand-ink">{description}</p>
      <p className="text-sm text-brand-ink-soft">{date}</p>
    </div>
  );
}

const STACK_BEFORE =
  "before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-brand-ink/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-brand-cream/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0";

const STACK_FOCUSED =
  "before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-brand-ink/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-brand-cream/50 before:opacity-0 grayscale-0 before:transition-opacity before:duration-700 before:left-0 before:top-0";

export default function DisplayCards({ cards }: { cards: DisplayCardProps[] }) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Horizontal fan-out offsets. The base (phone) steps are deliberately
  // smaller than the `sm:` ones: at 390px the card is 18rem/288px wide and
  // the content column is only 342px, so translate-x-8 / translate-x-16
  // (32px / 64px) pushed the third card's right edge to x=403 — 13px past the
  // viewport — and the whole page scrolled sideways (measured with Playwright
  // at 390x844 in Task 15's QA pass). translate-x-3 / translate-x-6 (12px /
  // 24px) keeps the stack inside the viewport while preserving the fanned
  // look; from `sm` up the viewport is wide enough for the original steps.
  const offsets = [
    { base: `[grid-area:stack] hover:-translate-y-10 ${STACK_BEFORE}`, focused: `[grid-area:stack] -translate-y-10 ${STACK_FOCUSED}` },
    { base: `[grid-area:stack] translate-x-3 sm:translate-x-12 translate-y-10 hover:-translate-y-1 ${STACK_BEFORE}`, focused: `[grid-area:stack] translate-x-3 sm:translate-x-12 translate-y-10 -translate-y-1 ${STACK_FOCUSED}` },
    { base: "[grid-area:stack] translate-x-6 sm:translate-x-24 translate-y-20 hover:translate-y-10", focused: "[grid-area:stack] translate-x-6 sm:translate-x-24 translate-y-10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="grid [grid-template-areas:'stack'] place-items-center"
      role="list"
    >
      {cards.map((c, i) => {
        const isFocused = focusedIndex === i;
        const offsetClasses = isFocused ? offsets[i]?.focused ?? offsets[2].focused : offsets[i]?.base ?? offsets[2].base;
        return (
          <div role="listitem" key={i} className="contents">
            <DisplayCard
              {...c}
              className={cn(offsetClasses, c.className)}
              onTouchStart={() => setFocusedIndex(focusedIndex === i ? null : i)}
              isFocused={isFocused}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
