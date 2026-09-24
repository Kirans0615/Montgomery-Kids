import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IllustratedCover from "@/components/ui/illustrated-cover";
import Img from "@/components/ui/img";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { storiesCta, type StoryCard } from "@/data/stories";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { resolveCoverIcon } from "@/lib/coverIcons";
import { cn } from "@/lib/utils";

/** Real intrinsic pixel dimensions (public/images/*.jpg) for Img's CLS/srcSet math. */
const PHOTO_DIMS: Record<string, { width: number; height: number }> = {
  "toddler-blocks.jpg": { width: 1054, height: 1113 },
  "young-woman-driving.jpg": { width: 680, height: 402 },
  "bike-ride.jpg": { width: 509, height: 339 },
  "graduate.jpg": { width: 509, height: 339 },
  "tug-of-war.jpg": { width: 507, height: 338 },
};

function StoryCover({ story, className }: { story: StoryCard; className?: string }) {
  if (story.cover.kind === "illustrated") {
    return (
      <IllustratedCover
        slug={story.slug}
        icon={resolveCoverIcon(story.cover.icon)}
        category={story.category}
        className={cn("h-full w-full rounded-none", className)}
      />
    );
  }

  const dims = PHOTO_DIMS[story.cover.image] ?? { width: 600, height: 400 };
  return (
    <Img
      src={story.cover.image}
      alt={story.cover.alt}
      width={dims.width}
      height={dims.height}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

interface StoryTileProps {
  story: StoryCard;
  /** Position among the currently-rendered (filtered) cards — drives the entrance stagger delay. */
  index: number;
  onOpen: (slug: string) => void;
  registerTriggerRef: (slug: string, el: HTMLButtonElement | null) => void;
}

/** Per-card entrance stagger, per §6.4 Section 2(B) "Cards animate in with stagger". */
const STORY_TILE_STAGGER_S = 0.05;
const STORY_TILE_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * `initial`/`animate` (staggered by `index`) for mount, `exit` (no stagger —
 * removed cards fade out together, immediately) for a filter change, and
 * `layout` to re-flow the remaining cards' positions.
 */
const storyTileVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * STORY_TILE_STAGGER_S, ease: STORY_TILE_EASE },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: STORY_TILE_EASE } },
};

/**
 * One bento-masonry tile. Photo-covered stories span 2 grid rows (a taller
 * cover that fills the extra row via `flex-1`); illustrated-cover stories
 * span a single row with a fixed 4:3 cover, per §6.4 Section 2(B).
 *
 * Animates in with `initial`/`animate` (staggered by `index`), re-flows via
 * `layout`, and animates out via `exit` when a filter change drops it from
 * `stories` — the `AnimatePresence` wrapping this lives in `StoriesGrid`
 * and includes a bounded self-recovery timeout (see that component's
 * comment) for the case where `exit`'s `requestAnimationFrame`-driven
 * animation stalls (e.g. a backgrounded browser tab).
 */
function StoryTile({ story, index, onOpen, registerTriggerRef }: StoryTileProps) {
  const reducedMotion = useReducedMotion();
  const isPhoto = story.cover.kind === "photo";

  const className = cn(
    "flex flex-col overflow-hidden rounded-[28px] bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_20px_50px_-25px_rgba(28,42,32,.35)]",
    isPhoto && "row-span-2",
  );

  const content = (
    <>
      <div className={cn("relative w-full overflow-hidden", isPhoto ? "min-h-[220px] flex-1" : "aspect-[4/3]")}>
        <StoryCover story={story} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="font-hand text-lg text-brand-tangerine-deep">{story.category}</span>
        <h3 className="mt-1 font-display text-lg font-semibold text-brand-ink">{story.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-ink-soft">
          {story.body}
        </p>
        <button
          ref={(el) => registerTriggerRef(story.slug, el)}
          type="button"
          onClick={() => onOpen(story.slug)}
          className="mt-4 inline-flex items-center gap-1 self-start text-sm font-bold text-brand-leaf-deep transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
        >
          Read the story <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  );

  if (reducedMotion) {
    return <article className={className}>{content}</article>;
  }

  return (
    <motion.article
      layout
      custom={index}
      variants={storyTileVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {content}
    </motion.article>
  );
}

/** The trailing CTA tile (audit §8 item 12) — always present, never filtered. */
function StoryCtaTile() {
  const dims = PHOTO_DIMS[storiesCta.cover.image] ?? { width: 600, height: 400 };

  return (
    <div className="relative row-span-2 flex flex-col overflow-hidden rounded-[28px] ring-1 ring-brand-ink/10 shadow-[0_20px_50px_-25px_rgba(28,42,32,.35)]">
      <Img
        src={storiesCta.cover.image}
        alt={storiesCta.cover.alt}
        width={dims.width}
        height={dims.height}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-sun/75" aria-hidden="true" />
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-6">
        <p className="font-display text-lg font-semibold text-brand-ink">{storiesCta.body}</p>
        <p className="text-sm text-brand-ink/80">{storiesCta.subline}</p>
        <a
          href={storiesCta.donateUrl}
          target="_blank"
          rel="noopener"
          onClick={openDonate}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-cream transition hover:bg-brand-ink/90"
        >
          {storiesCta.buttonLabel}
        </a>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const reducedMotion = useReducedMotion();
  const className =
    "col-span-full flex flex-col items-center justify-center gap-4 rounded-[28px] bg-brand-paper py-20 text-center ring-1 ring-brand-ink/10";

  const content = (
    <>
      <p className="font-hand text-2xl text-brand-tangerine-deep">
        No stories match that — try another word
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-brand-ink/20 px-5 py-2 text-sm font-bold text-brand-ink transition hover:bg-brand-ink/5"
      >
        Reset filters
      </button>
    </>
  );

  if (reducedMotion) {
    return <div className={className}>{content}</div>;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {content}
    </motion.div>
  );
}

export interface StoriesGridProps {
  sectionId: string;
  stories: StoryCard[];
  onResetFilters: () => void;
}

/**
 * OUR STORIES Section 2 — the bento-masonry story grid, per §6.4 Section 2.
 * `stories` is the already-filtered list (search + category, shared filter
 * state lifted to `src/routes/Stories.tsx`); this component only renders it
 * and owns the story-detail Dialog.
 *
 * The Dialog is a single shared instance (not one per card): clicking a
 * card's "Read the story" button sets `openSlug`, and "Next"/"Prev" swap
 * `openSlug` in place while the Dialog stays open, so its content updates
 * without a close/reopen cycle. Radix's `onCloseAutoFocus` is used
 * explicitly (rather than relying on its default target) to guarantee focus
 * returns to the exact card button that originally opened the dialog, even
 * after Next/Prev moved the displayed story elsewhere in the list.
 */
/**
 * How long `AnimatePresence` gets to finish exiting the cards a filter
 * change removed (its `exit` transition is 0.4s) before the bounded
 * recovery safeguard below forces a clean remount. 2x the exit duration:
 * generous for a normal, focused tab (which finishes in ~0.4s), but still
 * a hard bound rather than an indefinite wait.
 */
const EXIT_STUCK_TIMEOUT_MS = 800;

export default function StoriesGrid({ sectionId, stories, onResetFilters }: StoriesGridProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const lastTriggerSlugRef = useRef<string | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Bounded self-recovery for the story grid's filter re-flow. `exit`
  // animations are driven by `requestAnimationFrame`, which browsers can
  // stall indefinitely for a backgrounded tab — confirmed directly while
  // building this page (a `MutationObserver` showed removed cards staying
  // in the DOM, frozen mid-fade, for as long as the tab stayed hidden).
  // Rather than drop `AnimatePresence` (the brief explicitly asks for it
  // here), `onExitComplete` marks the exit as finished, and a timeout of
  // `EXIT_STUCK_TIMEOUT_MS` forces a clean remount (via `resetKey`) only if
  // that hasn't happened by then — so a normal, focused tab always gets
  // the smooth animated re-flow, and the pathological stalled case still
  // self-heals within a bounded window instead of freezing forever.
  //
  // `resetKey` also drives `<AnimatePresence initial={resetKey === 0}>`
  // below: real first mount (`resetKey === 0`) must still play the normal
  // entrance stagger ("Cards animate in with stagger" per §6.4), while a
  // safeguard-triggered remount (`resetKey` bumped to 1, 2, …) must NOT
  // replay that entrance for cards that were already correctly on screen
  // — `initial={false}` only on those later remounts avoids a spurious
  // re-flash. (`initial={false}` unconditionally would silently kill the
  // first-load entrance animation too, since framer-motion's `initial`
  // prop controls exactly that: whether children present at the *first*
  // render of this `AnimatePresence` animate in at all.)
  const [resetKey, setResetKey] = useState(0);
  const exitCompletedRef = useRef(true);
  const storiesKey = stories.map((story) => story.slug).join("|");
  const prevStoriesKeyRef = useRef(storiesKey);

  useEffect(() => {
    if (storiesKey === prevStoriesKeyRef.current) return undefined;
    prevStoriesKeyRef.current = storiesKey;
    exitCompletedRef.current = false;

    const timeoutId = window.setTimeout(() => {
      if (!exitCompletedRef.current) {
        exitCompletedRef.current = true;
        setResetKey((key) => key + 1);
      }
    }, EXIT_STUCK_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [storiesKey]);

  const registerTriggerRef = (slug: string, el: HTMLButtonElement | null) => {
    if (el) triggerRefs.current.set(slug, el);
    else triggerRefs.current.delete(slug);
  };

  const openIndex = stories.findIndex((story) => story.slug === openSlug);
  const openStory = openIndex >= 0 ? stories[openIndex] : null;

  const openStoryDialog = (slug: string) => {
    lastTriggerSlugRef.current = slug;
    setOpenSlug(slug);
  };

  const goToStory = (offset: number) => {
    if (openIndex < 0 || stories.length === 0) return;
    const total = stories.length;
    const nextIndex = ((openIndex + offset) % total + total) % total;
    setOpenSlug(stories[nextIndex].slug);
  };

  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="bg-brand-cream py-24 md:py-32">
      {/*
        The grid's story cards are `<h3>`s, but nothing between them and the
        page `<h1>` was an `<h2>` — so /our-stories went h1 → h3, which axe
        reports as `heading-order` and which leaves screen-reader users with
        a broken outline. This heading is visually hidden rather than shown
        because §6.4's design for this section is a bare bento grid directly
        under the hero (the hero's own copy already introduces it); the
        heading exists purely to restore the document outline.
      */}
      <h2 id={`${sectionId}-heading`} className="sr-only">
        Stories
      </h2>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-flow-row-dense grid-cols-1 gap-6 [grid-auto-rows:minmax(220px,auto)] sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence
            key={resetKey}
            mode="popLayout"
            initial={resetKey === 0}
            onExitComplete={() => {
              exitCompletedRef.current = true;
            }}
          >
            {stories.length === 0
              ? <EmptyState key="empty-state" onReset={onResetFilters} />
              : stories.map((story, index) => (
                  <StoryTile
                    key={story.slug}
                    story={story}
                    index={index}
                    onOpen={openStoryDialog}
                    registerTriggerRef={registerTriggerRef}
                  />
                ))}
          </AnimatePresence>
          <StoryCtaTile key="cta" />
        </div>
      </div>

      <Dialog
        open={openStory !== null}
        onOpenChange={(open) => {
          if (!open) setOpenSlug(null);
        }}
      >
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const slug = lastTriggerSlugRef.current;
            if (slug) triggerRefs.current.get(slug)?.focus();
          }}
          className="max-w-2xl gap-0 overflow-hidden p-0"
        >
          {openStory && (
            <>
              <div className="max-h-64 w-full overflow-hidden sm:max-h-80">
                <StoryCover story={openStory} className="h-full" />
              </div>
              <div className="flex flex-col gap-4 p-6">
                <DialogHeader>
                  <span className="font-hand text-lg text-brand-tangerine-deep">{openStory.category}</span>
                  <DialogTitle>{openStory.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base leading-relaxed text-brand-ink-soft">
                  {openStory.body}
                </DialogDescription>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={DONATE_URL}
                    target="_blank"
                    rel="noopener"
                    onClick={openDonate}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90"
                  >
                    Donate
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToStory(-1)}
                      aria-label="Previous story"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink transition hover:bg-brand-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStory(1)}
                      className="inline-flex items-center gap-1 rounded-full border border-brand-ink/15 px-4 py-2 text-sm font-bold text-brand-ink transition hover:bg-brand-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep"
                    >
                      Next story <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
