import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import BlogFilters from "@/components/sections/BlogFilters";
import BlogYearRail from "@/components/sections/BlogYearRail";
import BlogPostCover from "@/components/sections/BlogPostCover";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Post } from "@/data/posts";
import {
  formatPostDateShort,
  getPostPath,
  getReadingTimeMinutes,
  type BlogFilterValue,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

/** 9 per page, per docs/BUILD-PROMPT.md §6.6. */
const PAGE_SIZE = 9;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How long an `AnimatePresence` exit (filter change removing cards) gets to
 * finish before the bounded recovery below forces a clean remount — same
 * value and same reasoning as `StoriesGrid.tsx`'s `EXIT_STUCK_TIMEOUT_MS`:
 * `exit` is `requestAnimationFrame`-driven, which a backgrounded tab can
 * stall indefinitely (confirmed directly on this project), so a normal tab
 * gets the smooth re-flow and a stalled one still self-heals.
 */
const EXIT_STUCK_TIMEOUT_MS = 800;

function YearHeading({ year, reducedMotion }: { year: string; reducedMotion: boolean }) {
  const className = "col-span-full mt-2 flex items-center gap-4 first:mt-0";
  const content = (
    <>
      <h2 id={`blog-year-${year}`} className="scroll-mt-28 font-display text-2xl font-semibold text-brand-ink">
        {year}
      </h2>
      <span className="h-px flex-1 bg-brand-ink/10" aria-hidden="true" />
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
      transition={{ duration: 0.3, ease: EASE }}
      className={className}
    >
      {content}
    </motion.div>
  );
}

function BlogPostCard({
  post,
  staggerIndex,
  reducedMotion,
}: {
  post: Post;
  staggerIndex: number;
  reducedMotion: boolean;
}) {
  const readingMinutes = getReadingTimeMinutes(post);
  const category = post.categories[0] ?? "Blog";

  const className =
    "group flex flex-col overflow-hidden rounded-[24px] bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_16px_40px_-24px_rgba(28,42,32,.35)] transition hover:shadow-[0_24px_50px_-24px_rgba(28,42,32,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2";

  const content = (
    <Link to={getPostPath(post)} className={className}>
      <div className="aspect-[4/3] w-full overflow-hidden">
        <BlogPostCover
          post={post}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-hand text-lg text-brand-tangerine-deep">{category}</span>
        <h3 className="font-display text-lg font-semibold leading-snug text-brand-ink">
          {post.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">
          {post.excerpt}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-brand-ink-soft/80">
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {formatPostDateShort(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {readingMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  );

  if (reducedMotion) {
    return content;
  }

  return (
    <motion.div
      layout
      custom={staggerIndex}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: staggerIndex * 0.05, ease: EASE } }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE } }}
    >
      {content}
    </motion.div>
  );
}

function EmptyState({ onReset, reducedMotion }: { onReset: () => void; reducedMotion: boolean }) {
  const className =
    "col-span-full flex flex-col items-center justify-center gap-4 rounded-[28px] bg-brand-paper py-20 text-center ring-1 ring-brand-ink/10";
  const content = (
    <>
      <p className="font-hand text-2xl text-brand-tangerine-deep">No posts in this category yet</p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-brand-ink/20 px-5 py-2 text-sm font-bold text-brand-ink transition hover:bg-brand-ink/5"
      >
        Show all posts
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
      transition={{ duration: 0.3 }}
      className={className}
    >
      {content}
    </motion.div>
  );
}

export interface BlogGridProps {
  /** Every post except the one already shown by `BlogFeatured`, newest-first. */
  posts: Post[];
  /** Every distinct year across the *full* archive (featured post included) — the rail's stable list. */
  years: string[];
  /**
   * Category tab badge counts, computed by the caller over the *full*
   * archive (featured post included) — see this component's own comment
   * on why, right above where this is consumed.
   */
  counts: Record<BlogFilterValue, number>;
}

/**
 * BLOG Section 3 — category tabs + sticky year rail + the chronological,
 * paginated grid, per docs/BUILD-PROMPT.md §6.6. Owns all of that section's
 * interactive state (category filter, "Load more" pagination, and the
 * year-rail jump) itself, so `src/routes/Blog.tsx` stays a thin composition
 * of `BlogHero` / `BlogFeatured` / this / the donate band.
 *
 * Year-rail vs. pagination: clicking a year whose posts aren't all loaded
 * yet under the current 9-per-page cap would otherwise jump to a heading
 * with some (or none) of that year's cards actually in the DOM. Resolved by
 * having `handleJumpToYear` compute exactly how many posts (in the current
 * filtered, sorted order) it takes to include *every* post in that year,
 * bump `visibleCount` to that number in one step (i.e. load however many
 * "pages" it takes), and only then scroll — so a jump always lands on a
 * fully-rendered year group, never a partial one. A year with zero posts
 * under the active category filter is shown disabled in the rail instead of
 * silently doing nothing.
 *
 * `counts` (the tab badges) are computed by the *caller* (`Blog.tsx`) over
 * the full 21-post archive, not derived here from `posts` (the 20-post
 * grid pool with the featured post held back). Deriving them from `posts`
 * would make the "All" badge read 20 while the hero states "21 posts" one
 * scroll above it — individually correct under the featured-post-exclusion
 * design, but a visitor reasonably reads two different totals on the same
 * page as a bug. A tab badge answers "how many posts exist in this
 * category site-wide," not "how many cards does the grid below currently
 * render" — those are allowed to differ by one (the featured post) for
 * whichever category it belongs to, same as "All" already differs by one
 * from the grid's own rendered count when unfiltered.
 */
export default function BlogGrid({ posts, years, counts }: BlogGridProps) {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<BlogFilterValue>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // A year queued to scroll to once `visibleCount` has grown enough to reveal
  // it — a ref (not state) because clearing it is a side effect of
  // `visibleCount` changing, not itself a value anything renders from.
  const pendingYearRef = useRef<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) => post.categories.includes(activeFilter));
  }, [posts, activeFilter]);

  /** First index (within `filteredPosts`) at which each year appears. */
  const yearStartIndex = useMemo(() => {
    const map = new Map<string, number>();
    filteredPosts.forEach((post, index) => {
      if (!map.has(post.year)) map.set(post.year, index);
    });
    return map;
  }, [filteredPosts]);

  const availableYears = useMemo(() => new Set(yearStartIndex.keys()), [yearStartIndex]);

  const visibleCountClamped = Math.min(visibleCount, filteredPosts.length || PAGE_SIZE);
  const visiblePosts = filteredPosts.slice(0, visibleCountClamped);
  const hasMore = visibleCountClamped < filteredPosts.length;

  // Bounded self-recovery for the filter re-flow's exit animations — see
  // `EXIT_STUCK_TIMEOUT_MS`'s comment and StoriesGrid.tsx's identical
  // mechanism, which this mirrors exactly.
  const [resetKey, setResetKey] = useState(0);
  const exitCompletedRef = useRef(true);
  const filteredKey = filteredPosts.map((post) => post.slug).join("|");
  const prevFilteredKeyRef = useRef(filteredKey);

  useEffect(() => {
    if (filteredKey === prevFilteredKeyRef.current) return undefined;
    prevFilteredKeyRef.current = filteredKey;
    exitCompletedRef.current = false;

    const timeoutId = window.setTimeout(() => {
      if (!exitCompletedRef.current) {
        exitCompletedRef.current = true;
        setResetKey((key) => key + 1);
      }
    }, EXIT_STUCK_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filteredKey]);

  const handleFilterChange = (value: BlogFilterValue) => {
    setActiveFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredPosts.length));
  };

  const scrollToYear = (year: string) => {
    document
      .getElementById(`blog-year-${year}`)
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const handleJumpToYear = (year: string) => {
    const startIndex = yearStartIndex.get(year);
    if (startIndex === undefined) return;

    let endIndex = filteredPosts.length;
    for (let i = startIndex; i < filteredPosts.length; i += 1) {
      if (filteredPosts[i].year !== year) {
        endIndex = i;
        break;
      }
    }

    if (endIndex > visibleCountClamped) {
      pendingYearRef.current = year;
      setVisibleCount(endIndex);
    } else {
      scrollToYear(year);
    }
  };

  // Runs after `visibleCount` has committed and the newly-revealed cards for
  // `pendingYearRef` are in the DOM (React commits state synchronously
  // before effects run), so this scroll always has something real to land
  // on. Only reacts to `visibleCountClamped` changing — reading a ref here
  // rather than state is exactly what avoids re-running (and needing to
  // setState) on every render.
  useEffect(() => {
    const year = pendingYearRef.current;
    if (year === null) return;
    scrollToYear(year);
    pendingYearRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCountClamped]);

  const blocks = useMemo(() => {
    const items: Array<
      | { kind: "year"; year: string }
      | { kind: "post"; post: Post; staggerIndex: number }
    > = [];
    let lastYear: string | null = null;
    visiblePosts.forEach((post, index) => {
      if (post.year !== lastYear) {
        items.push({ kind: "year", year: post.year });
        lastYear = post.year;
      }
      items.push({ kind: "post", post, staggerIndex: index % PAGE_SIZE });
    });
    return items;
  }, [visiblePosts]);

  return (
    <section className="bg-brand-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-12">
          <BlogYearRail years={years} availableYears={availableYears} onJump={handleJumpToYear} />

          <div>
            <div className="mb-8">
              <BlogFilters value={activeFilter} onChange={handleFilterChange} counts={counts} />
            </div>

            <div
              className={cn(
                "grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3",
                "items-start",
              )}
            >
              <AnimatePresence
                key={resetKey}
                mode="popLayout"
                initial={resetKey === 0}
                onExitComplete={() => {
                  exitCompletedRef.current = true;
                }}
              >
                {blocks.length === 0 ? (
                  <EmptyState key="empty" onReset={() => handleFilterChange("All")} reducedMotion={reducedMotion} />
                ) : (
                  blocks.map((block) =>
                    block.kind === "year" ? (
                      <YearHeading key={`year-${block.year}`} year={block.year} reducedMotion={reducedMotion} />
                    ) : (
                      <BlogPostCard
                        key={block.post.slug}
                        post={block.post}
                        staggerIndex={block.staggerIndex}
                        reducedMotion={reducedMotion}
                      />
                    ),
                  )
                )}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button type="button" variant="secondary" size="lg" onClick={handleLoadMore}>
                  Load more
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
