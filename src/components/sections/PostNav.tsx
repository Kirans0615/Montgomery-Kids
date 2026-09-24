import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/data/posts";
import { getPostPath } from "@/lib/blog";
import { cn } from "@/lib/utils";

export interface PostNavProps {
  prevPost: Post | null;
  nextPost: Post | null;
}

const CARD_CLASS =
  "group flex flex-col rounded-2xl border border-brand-ink/10 bg-brand-paper p-5 transition hover:border-brand-ink/25 hover:shadow-[0_16px_36px_-24px_rgba(28,42,32,.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2";

/**
 * Prev/next chronological post navigation, per docs/BUILD-PROMPT.md §6.7.
 * "Previous" links to the post published just before this one (older),
 * "Next" to the one published just after (newer) — from
 * `lib/blog.ts`'s `getAdjacentPosts`, driven entirely by `posts.ts`'s real
 * `date` field, never a hardcoded pair.
 */
export default function PostNav({ prevPost, nextPost }: PostNavProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav aria-label="More posts" className="bg-brand-cream pb-16 md:pb-20">
      <div className="mx-auto grid max-w-[68ch] grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:px-8">
        {prevPost ? (
          <Link to={getPostPath(prevPost)} className={CARD_CLASS}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink-soft">
              <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
              Previous post
            </span>
            <span className="mt-2 font-display text-base font-semibold text-brand-ink transition group-hover:text-brand-leaf-deep">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

        {nextPost ? (
          <Link to={getPostPath(nextPost)} className={cn(CARD_CLASS, "sm:items-end sm:text-right")}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink-soft">
              Next post
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <span className="mt-2 font-display text-base font-semibold text-brand-ink transition group-hover:text-brand-leaf-deep">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
