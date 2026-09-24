import type { Post, PostBlock } from "@/data/posts";

/** Reading-time WPM, per plan Task 12 / docs/BUILD-PROMPT.md §6.6. */
const WORDS_PER_MINUTE = 200;

/** Canonical category tab order, per docs/BUILD-PROMPT.md §6.6. */
export const BLOG_CATEGORIES = [
  "News",
  "Success Stories",
  "Donor Spotlight",
  "What your money supports",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** "All" plus the four real categories, in tab display order. */
export const BLOG_FILTER_VALUES = ["All", ...BLOG_CATEGORIES] as const;

export type BlogFilterValue = (typeof BLOG_FILTER_VALUES)[number];

/**
 * Route path for a post, matching the exact `/:year/:month/:slug` shape
 * `src/App.tsx` (Task 7) registers — the original WordPress permalink
 * structure these posts were published under.
 */
export function getPostPath(post: Post): string {
  return `/${post.year}/${post.month}/${post.slug}`;
}

/** Newest-first by ISO `date`. Never mutates the input array. */
export function sortPostsByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Word count of a post's actual prose — concatenates every `p`/`h3` block's
 * text and every `ul` block's items, per plan Task 12's exact spec.
 * `quote`/`video`/`image`/`footnote` blocks are intentionally excluded, same
 * as the brief describes.
 */
export function getPostWordCount(post: Post): number {
  const words = post.body.reduce((total: number, block: PostBlock) => {
    if (block.type === "p" || block.type === "h3") {
      return total + countWords(block.text);
    }
    if (block.type === "ul") {
      return total + block.items.reduce((sum, item) => sum + countWords(item), 0);
    }
    return total;
  }, 0);

  return words;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

/** Reading time in whole minutes at 200wpm, floored at 1 so it's never "0 min read". */
export function getReadingTimeMinutes(post: Post): number {
  return Math.max(1, Math.round(getPostWordCount(post) / WORDS_PER_MINUTE));
}

/** e.g. "Nov 30, 2025" — compact form for cards/meta rows. */
export function formatPostDateShort(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** e.g. "November 30, 2025" — full form for the featured card. */
export function formatPostDateLong(dateIso: string): string {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * How many posts (out of `posts`) fall in each category, plus "All" =
 * `posts.length`.
 *
 * Callers should pass the *full* archive here (all 21 posts, featured one
 * included), not just the grid's rendered pool (20, with the featured post
 * held back so it isn't shown twice) — the tab badge answers "how many
 * posts exist in this category site-wide," not "how many cards does the
 * grid below currently render," so it stays correct and stable regardless
 * of the featured-post-exclusion display choice. See BlogGrid.tsx's
 * comment on this exact reconciliation.
 */
export function getCategoryCounts(posts: Post[]): Record<BlogFilterValue, number> {
  const counts = Object.fromEntries(BLOG_FILTER_VALUES.map((value) => [value, 0])) as Record<
    BlogFilterValue,
    number
  >;
  counts.All = posts.length;
  for (const post of posts) {
    for (const category of post.categories) {
      if (Object.prototype.hasOwnProperty.call(counts, category)) {
        counts[category as BlogFilterValue] += 1;
      }
    }
  }
  return counts;
}

export interface AdjacentPosts {
  /** Published immediately before `post` (older). `null` if `post` is the oldest. */
  prev: Post | null;
  /** Published immediately after `post` (newer). `null` if `post` is the newest. */
  next: Post | null;
}

/**
 * `post`'s chronological neighbors within `allPosts`, per plan Task 13 /
 * docs/BUILD-PROMPT.md §6.7 "prev/next post navigation (chronological)":
 * `prev` is the post published just before it, `next` the one published
 * just after. Several posts in `src/data/posts.ts` share an identical
 * `date` (scraped without exact per-post dates); ties are broken by
 * `Array.prototype.sort`'s stability, i.e. their existing relative order in
 * `allPosts` — deterministic, not arbitrary, since it's driven entirely by
 * the real data file rather than any value invented here.
 */
export function getAdjacentPosts(post: Post, allPosts: Post[]): AdjacentPosts {
  const chronological = [...allPosts].sort((a, b) => a.date.localeCompare(b.date));
  const index = chronological.findIndex((candidate) => candidate.slug === post.slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? chronological[index - 1] : null,
    next: index < chronological.length - 1 ? chronological[index + 1] : null,
  };
}

/**
 * Up to `count` related posts for `post`, never including `post` itself:
 * posts sharing at least one category first (newest of those first), then
 * the newest remaining posts fill any leftover slots — per plan Task 13 /
 * docs/BUILD-PROMPT.md §6.7 "3 related posts (same category first, then
 * newest others)".
 */
export function getRelatedPosts(post: Post, allPosts: Post[], count = 3): Post[] {
  const others = sortPostsByDateDesc(allPosts.filter((candidate) => candidate.slug !== post.slug));
  const sameCategory = others.filter((candidate) =>
    candidate.categories.some((category) => post.categories.includes(category)),
  );
  const rest = others.filter((candidate) => !sameCategory.includes(candidate));
  return [...sameCategory, ...rest].slice(0, count);
}

/** Distinct years present across `posts`, newest-first, deduped, not hardcoded. */
export function getDistinctYearsDesc(posts: Post[]): string[] {
  const seen = new Set<string>();
  const years: string[] = [];
  for (const post of sortPostsByDateDesc(posts)) {
    if (!seen.has(post.year)) {
      seen.add(post.year);
      years.push(post.year);
    }
  }
  return years;
}
