import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import Img from "@/components/ui/img";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { board, type BoardMember } from "@/data/board";
import { cn } from "@/lib/utils";

/** Real intrinsic pixel dimensions (public/images/board-*.jpg), for Img's CLS/srcSet math — board.ts itself only carries the filename. */
const PHOTO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "board-leslie-shedlin.jpg": { width: 365, height: 366 },
  "board-agnes-leshner.jpg": { width: 513, height: 481 },
  "board-ronna-cook.jpg": { width: 1216, height: 1196 },
  "board-alan-kraut.jpg": { width: 878, height: 959 },
  "board-cynde-burgess.jpg": { width: 501, height: 498 },
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Two blob outlines (objectBoundingBox coordinates, same M+4C+Z segment structure) that frame the "rest" and hover-morphed portrait mask. */
const BLOB_REST =
  "M0.62 0.06C0.80 0.10 0.94 0.28 0.92 0.48C0.90 0.68 0.72 0.84 0.52 0.88C0.32 0.92 0.10 0.84 0.05 0.64C0 0.44 0.08 0.24 0.26 0.14C0.38 0.07 0.47 0.03 0.62 0.06Z";
const BLOB_HOVER =
  "M0.56 0.02C0.74 -0.02 0.92 0.10 0.96 0.30C1.0 0.50 0.88 0.72 0.70 0.84C0.52 0.96 0.28 0.96 0.14 0.80C0 0.64 0.02 0.36 0.16 0.20C0.26 0.08 0.40 0.05 0.56 0.02Z";

function BoardPortrait({ photo, alt, index }: { photo: string; alt: string; index: number }) {
  const reducedMotion = useReducedMotion();
  const clipId = `board-blob-${index}`;
  const dimensions = PHOTO_DIMENSIONS[photo] ?? { width: 600, height: 600 };

  return (
    <motion.div
      className="group relative mx-auto h-48 w-48 sm:h-56 sm:w-56"
      {...(!reducedMotion && { whileHover: "hover" })}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <motion.path
              d={BLOB_REST}
              variants={reducedMotion ? undefined : { hover: { d: BLOB_HOVER } }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </clipPath>
        </defs>
      </svg>

      <div
        className="h-full w-full overflow-hidden bg-brand-mint ring-1 ring-brand-ink/10"
        style={{ clipPath: `url(#${clipId})` }}
      >
        <Img
          src={photo}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
    </motion.div>
  );
}

function BoardCard({ member, index }: { member: BoardMember; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout className="flex flex-col items-center text-center">
      <BoardPortrait photo={member.photo} alt={member.alt} index={index} />

      <h3 className="mt-6 font-display text-xl font-semibold text-brand-ink">{member.name}</h3>
      <span className="mt-2 inline-flex items-center rounded-full bg-brand-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-leaf-deep">
        {member.title}
      </span>

      <motion.div layout className="mt-4 max-w-sm">
        <p className={cn("text-sm leading-relaxed text-brand-ink-soft", !expanded && "line-clamp-4")}>
          {member.bio}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 text-sm font-bold text-brand-leaf-deep underline underline-offset-4 transition hover:text-brand-ink"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </motion.div>
    </motion.div>
  );
}

interface BoardRowProps {
  members: BoardMember[];
  startIndex: number;
  delay?: number;
}

function BoardRow({ members, startIndex, delay = 0 }: BoardRowProps) {
  return (
    // Per-card `<Reveal>` (not `stagger` mode on one wrapping Reveal) is
    // deliberate: `Reveal`'s `stagger` mode inserts its own unstyled
    // `motion.div` between this flex container and whatever child it's
    // given, so a width class placed on that child lands on a *grandchild*
    // of the flex container, not the flex item itself — a flex item's
    // default `flex-basis: auto` sizes from its own content, and a
    // percentage/calc width on a descendant is treated as `auto` for that
    // computation, so every card rendered one-per-row at its content's
    // intrinsic width instead of 3-then-2 equal columns. Putting the width
    // class directly on each card's own `<Reveal className="...">` (the
    // same per-item pattern `HomeImpact.tsx`'s STAT_TILES already uses)
    // makes that Reveal's own `motion.div` the actual flex item, and the
    // 80ms stagger is reproduced manually via `delay` instead.
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-14">
      {members.map((member, i) => (
        <Reveal
          key={member.name}
          delay={delay + i * 0.08}
          className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.667rem)]"
        >
          <BoardCard member={member} index={startIndex + i} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * ABOUT US Section 3 — Board of Directors, per docs/BUILD-PROMPT.md §6.3
 * Section 3 / docs/site-audit.md §7 Section 3. All 5 bios come verbatim from
 * `src/data/board.ts` (Task 3), which already carries the §12 "wefare" →
 * "welfare" fix. Layout: 3 + 2 centered, first row staggering in before the
 * second (no empty third column in the second row).
 *
 * Portraits sit in an organic blob mask (SVG `clipPath`, objectBoundingBox
 * units) that morphs to a second blob shape on hover while the photo itself
 * scales up (`group-hover:scale-110`); bios clamp to 4 lines with a
 * "Read more" toggle that expands via a framer-motion `layout` animation
 * rather than an abrupt height snap.
 */
export default function AboutBoard() {
  const firstRow = board.slice(0, 3);
  const secondRow = board.slice(3);

  return (
    <section className="bg-brand-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-h2 text-brand-ink">Board of Directors</h2>
          <Scribble variant="squiggle" color="tangerine" className="mx-auto mt-3 h-3 w-32" />
        </Reveal>

        <div className="mt-16 space-y-14">
          <BoardRow members={firstRow} startIndex={0} />
          <BoardRow members={secondRow} startIndex={firstRow.length} delay={0.25} />
        </div>
      </div>
    </section>
  );
}
