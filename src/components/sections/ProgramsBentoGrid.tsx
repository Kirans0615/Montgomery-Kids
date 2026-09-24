import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Cake,
  Sparkles,
  Tent,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";
import IllustratedCover from "@/components/ui/illustrated-cover";
import Img from "@/components/ui/img";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { programTiles, type ProgramTile } from "@/data/programs";
import { posts } from "@/data/posts";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Real intrinsic pixel dimensions (public/images/*.jpg), for Img's CLS/srcSet math. */
const PHOTO_DIMS: Record<string, { width: number; height: number }> = {
  "graduate.jpg": { width: 509, height: 339 },
  "teen-driver-smiling.jpg": { width: 509, height: 339 },
};

/**
 * Decorative watermark icon for the 3 color-tone tiles (no photo). Purely
 * illustrative — not a fact, so it carries no citation of its own.
 */
const TONE_ICONS: Record<string, LucideIcon> = {
  "boost-guaranteed-income": Wallet,
  "project-turkey": UtensilsCrossed,
  "milestones-birthdays": Cake,
};

const TONE_BG: Record<string, string> = {
  butter: "bg-brand-butter",
  mint: "bg-brand-mint",
  sky: "bg-brand-sky",
};

/**
 * Resolves each tile's citing post from `src/data/posts.ts` by matching the
 * WordPress-style URL slug `programs.ts` recorded in `sourcePost.url` (e.g.
 * `/2025/08/spring-forward-with-4montgomerys-kids/`) against
 * `posts.ts`'s own `slug` field. All 6 tiles resolve to a real post here —
 * verified by cross-reference during Task 11 (see task-11-report.md) — but
 * this still fails soft (renders the citation as plain, unlinked text
 * instead of a dead link) if a future edit to either file ever breaks the
 * match, per the brief's "don't guess / don't link to a wrong or dead
 * route" instruction.
 */
function resolvePostRoute(tile: ProgramTile): { path: string; title: string } | null {
  const slugFromUrl = tile.sourcePost.url.split("/").filter(Boolean).pop();
  const post = posts.find((candidate) => candidate.slug === slugFromUrl);
  if (!post) return null;
  return { path: `/${post.year}/${post.month}/${post.slug}`, title: post.title };
}

function TileCover({ tile }: { tile: ProgramTile }) {
  if (tile.cover.kind === "photo") {
    const dims = PHOTO_DIMS[tile.cover.image] ?? { width: 600, height: 400 };
    return (
      <Img
        src={tile.cover.image}
        alt={tile.cover.alt}
        width={dims.width}
        height={dims.height}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    );
  }

  if (tile.cover.kind === "illustrated") {
    return (
      <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
        <IllustratedCover
          slug={tile.slug}
          icon={illustratedIconFor(tile.cover.icon)}
          category="Summer Camp"
          className="h-full w-full rounded-none"
        />
      </div>
    );
  }

  const Icon = TONE_ICONS[tile.slug];
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", TONE_BG[tile.cover.tone])}>
      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className="h-28 w-28 text-brand-ink/10 transition-transform duration-500 ease-out group-hover:scale-110 sm:h-36 sm:w-36"
        />
      )}
    </div>
  );
}

/** `ProgramTileCover`'s `illustrated` variant only ever names `"Tent"` (per programs.ts), but this stays generic rather than hard-coding a single icon. */
const ILLUSTRATED_ICONS: Record<string, LucideIcon> = { Tent };

function illustratedIconFor(name: string): LucideIcon {
  return ILLUSTRATED_ICONS[name] ?? Sparkles;
}

interface BentoTileProps {
  tile: ProgramTile;
  index: number;
}

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.08, ease: EASE },
  }),
};

function BentoTile({ tile, index }: BentoTileProps) {
  const reducedMotion = useReducedMotion();
  const route = resolvePostRoute(tile);
  const isLarge = tile.size === "large";
  const hasPhotoOrIllustration = tile.cover.kind !== "color";

  const coverHeight = isLarge ? "h-40 sm:h-48" : hasPhotoOrIllustration ? "h-28 sm:h-32" : "h-24";

  const card = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_20px_50px_-25px_rgba(28,42,32,.35)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-20px_rgba(28,42,32,.45)]">
      <div className={cn("relative w-full overflow-hidden", coverHeight)}>
        <TileCover tile={tile} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className={cn("font-display font-semibold text-brand-ink", isLarge ? "text-xl sm:text-2xl" : "text-lg")}>
          {tile.title}
        </h3>

        <ul className="flex flex-col gap-1.5">
          {tile.facts.map((fact) => (
            <li key={fact} className="text-sm leading-snug text-brand-ink-soft">
              {fact}
            </li>
          ))}
        </ul>

        {tile.quote && (
          <p className="font-hand text-lg leading-snug text-brand-tangerine-deep">&ldquo;{tile.quote}&rdquo;</p>
        )}

        {tile.note && <p className="text-xs italic text-brand-ink-soft/80">{tile.note}</p>}

        <div className="mt-auto pt-3">
          {route ? (
            <Link
              to={route.path}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-leaf-deep transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
            >
              From: {route.title}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          ) : (
            <span className="text-xs font-semibold text-brand-ink-soft/80">From: {tile.sourcePost.title}</span>
          )}
        </div>
      </div>
    </article>
  );

  const wrapped = (
    <TiltCard maxTilt={4} className="h-full rounded-[28px]">
      {card}
    </TiltCard>
  );

  if (reducedMotion) {
    return <div className={cn("h-full", isLarge && "sm:col-span-2 lg:col-span-2 lg:row-span-2")}>{wrapped}</div>;
  }

  return (
    <motion.div
      custom={index}
      variants={tileVariants}
      className={cn("h-full", isLarge && "sm:col-span-2 lg:col-span-2 lg:row-span-2")}
    >
      {wrapped}
    </motion.div>
  );
}

/**
 * PROGRAMS NEW Section 3 — the 6-tile programs bento grid, per
 * docs/BUILD-PROMPT.md §6.5 NEW Section 3. Every fact/quote/citation comes
 * verbatim from `src/data/programs.ts`'s `programTiles` (itself traced to
 * the audit's blog posts — see that file's own header comment); each tile
 * links to its real citing post, resolved against `src/data/posts.ts` (see
 * `resolvePostRoute` above). The large "Boost" tile spans 2 columns × 2 rows
 * on desktop (`lg:col-span-2 lg:row-span-2`); row heights are left at CSS
 * Grid's default `auto` sizing (not a fixed pixel value) so each implicit
 * row grows to fit its tallest cell's real content — including the
 * row-spanning tile, whose height then naturally comes out to roughly
 * double a regular tile's, confirmed by measurement (see task-11-report.md)
 * rather than assumed from the CSS alone.
 */
export default function ProgramsBentoGrid() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">Our programs</h2>
          <p className="mt-3 max-w-xl text-body text-brand-ink-soft">
            Every program below is funded entirely by donors like you — read the story behind each one.
          </p>
        </Reveal>

        {reducedMotion ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programTiles.map((tile, index) => (
              <BentoTile key={tile.slug} tile={tile} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {programTiles.map((tile, index) => (
              <BentoTile key={tile.slug} tile={tile} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
