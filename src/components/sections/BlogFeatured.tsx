import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Star } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import BlogPostCover from "@/components/sections/BlogPostCover";
import type { Post } from "@/data/posts";
import { formatPostDateLong, getPostPath, getReadingTimeMinutes } from "@/lib/blog";

export interface BlogFeaturedProps {
  post: Post;
}

/**
 * BLOG Section 2 — the featured-post hero card, per docs/BUILD-PROMPT.md
 * §6.6 (B): the newest post ("You Made It Happen…") shown wide, with its
 * cover and a "Latest" badge, ahead of the chronological grid below.
 */
export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const readingMinutes = getReadingTimeMinutes(post);
  const category = post.categories[0] ?? "Blog";

  return (
    <section className="bg-brand-cream pb-4 pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <Link
            to={getPostPath(post)}
            className="group grid grid-cols-1 overflow-hidden rounded-[32px] bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_30px_70px_-30px_rgba(28,42,32,.4)] transition hover:shadow-[0_40px_90px_-30px_rgba(28,42,32,.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2 md:grid-cols-2"
          >
            <div className="relative min-h-[280px] overflow-hidden md:min-h-[420px]">
              <BlogPostCover
                post={post}
                className="h-full w-full transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-sun px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink shadow-sm">
                <Star aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" />
                Latest
              </span>
            </div>

            <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
              <span className="font-hand text-2xl text-brand-tangerine-deep">{category}</span>
              <h2 className="font-display text-h2 leading-tight text-brand-ink">{post.title}</h2>
              <p className="line-clamp-3 text-base leading-relaxed text-brand-ink-soft md:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-brand-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  {formatPostDateLong(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="h-4 w-4" />
                  {readingMinutes} min read
                </span>
              </div>

              <span className="mt-3 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-leaf-deep transition group-hover:gap-3">
                Read the full story
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
