"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
  as?: "h1" | "h2";
  strokeClassName?: string;
}

export function HandWrittenTitle({
  title = "Hand Written",
  subtitle,
  as = "h2",
  strokeClassName = "text-brand-tangerine",
}: HandWrittenTitleProps) {
  const reduce = useReducedMotion();
  const draw: Variants = {
    hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  return (
    <div className="relative mx-auto w-full max-w-4xl py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="h-full w-full"
        >
          <motion.path
            d="M 950 90 C 1250 300, 1050 480, 600 520 C 250 520, 150 480, 150 300 C 150 120, 350 80, 600 80 C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className={`${strokeClassName} opacity-90`}
          />
        </motion.svg>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/*
          `reduce` gates the heading and subtitle too, not just the stroke.
          Previously only the SVG `draw` variants checked it, so under
          `prefers-reduced-motion: reduce` the title still started at
          `opacity: 0, y: 20` and animated in on a half-second delay — a
          Playwright reduced-motion sweep in Task 15 caught the "Thank You"
          H2 sitting at opacity 0.25 partway through that fade. With
          `reduce`, both start at their final values and never animate.
        */}
        <Heading
          className="font-display text-4xl md:text-6xl tracking-tight text-brand-ink"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? undefined : { delay: 0.5, duration: 0.8 }}
        >
          {title}
        </Heading>
        {subtitle && (
          <motion.p
            className="mt-3 font-hand text-2xl md:text-3xl text-brand-ink-soft"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={reduce ? undefined : { delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
