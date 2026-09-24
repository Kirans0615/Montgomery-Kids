import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import BlogPostCover from "@/components/sections/BlogPostCover";
import type { Post } from "@/data/posts";
import { formatPostDateShort, getPostPath, getReadingTimeMinutes } from "@/lib/blog";

export interface PostRelatedProps {
  /** Already computed by `lib/blog.ts`'s `getRelatedPosts` — same category first, then newest others. */
  posts: Post[];
}

/**
 * 3 related posts at the end of a post, per docs/BUILD-PROMPT.md §6.7. Cards
 * mirror `BlogGrid.tsx`'s `BlogPostCard` styling (same cover component,
 * date/reading-time formatting) but stay static — no filter/pagination
 * state to manage here.
 */
export default function PostRelated({ posts }: PostRelatedProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-brand-mint/30 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h3 text-brand-ink">More stories like this</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.06}>
              <Link
                to={getPostPath(post)}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-brand-paper ring-1 ring-brand-ink/10 transition hover:shadow-[0_20px_44px_-26px_rgba(28,42,32,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <BlogPostCover post={post} className="h-full w-full transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="font-hand text-lg text-brand-tangerine-deep">{post.categories[0] ?? "Blog"}</span>
                  <h3 className="font-display text-base font-semibold leading-snug text-brand-ink">{post.title}</h3>
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs font-semibold text-brand-ink-soft/80">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                      {formatPostDateShort(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {getReadingTimeMinutes(post)} min read
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
