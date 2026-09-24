import { Link } from "react-router-dom";
import { CalendarDays, Clock, User } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import BlogPostCover from "@/components/sections/BlogPostCover";
import type { Post } from "@/data/posts";
import { formatPostDateLong, getReadingTimeMinutes } from "@/lib/blog";

export interface PostHeroProps {
  post: Post;
}

/**
 * BLOG POST hero, per docs/BUILD-PROMPT.md §6.7: a Home/Blog breadcrumb,
 * category chips, the title in Fraunces, a meta row (author · date ·
 * reading time, via `lib/blog.ts`), and the cover (real photo or
 * `IllustratedCover`, via `BlogPostCover` — same component the Blog listing
 * uses, for visual consistency).
 */
export default function PostHero({ post }: PostHeroProps) {
  const readingMinutes = getReadingTimeMinutes(post);

  return (
    <header className="relative bg-brand-cream pb-10 pt-28 md:pb-14 md:pt-36">
      <div className="mx-auto max-w-[68ch] px-6 lg:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-brand-ink-soft">
            <Link to="/" className="transition hover:text-brand-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog" className="transition hover:text-brand-ink">
              Blog
            </Link>
          </nav>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-brand-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-leaf-deep"
              >
                {category}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-hero leading-[1.05] tracking-[-0.03em] text-brand-ink">
            {post.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-brand-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <User aria-hidden="true" className="h-4 w-4" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              {formatPostDateLong(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {readingMinutes} min read
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mx-auto mt-10 max-w-5xl px-6 lg:px-8">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-[32px] shadow-[0_30px_70px_-30px_rgba(28,42,32,.4)] ring-1 ring-brand-ink/10">
            <BlogPostCover post={post} className="h-full w-full object-cover" />
          </div>
        </div>
      </Reveal>
    </header>
  );
}
