import IllustratedCover from "@/components/ui/illustrated-cover";
import Img from "@/components/ui/img";
import type { Post } from "@/data/posts";
import { resolveCoverIcon } from "@/lib/coverIcons";
import { cn } from "@/lib/utils";

/**
 * Real intrinsic pixel dimensions for every post `cover` photo that actually
 * exists in `public/images/` — per `src/data/posts.ts`'s own header comment,
 * that's exactly one post today (`peewee-football.jpg`), matching the same
 * dims already used for it elsewhere (e.g. HomeStoriesSlider.tsx).
 */
const PHOTO_DIMS: Record<string, { width: number; height: number }> = {
  "peewee-football.jpg": { width: 506, height: 339 },
};

export interface BlogPostCoverProps {
  post: Post;
  className?: string;
}

/**
 * A post's cover: its real featured photo when `posts.ts` gives one via
 * `cover` (an `Img`, never the site favicon), otherwise the designed
 * `IllustratedCover` placeholder keyed off `iconForCover` — per
 * docs/BUILD-PROMPT.md §6.6, a post never shows the favicon as a cover.
 */
export default function BlogPostCover({ post, className }: BlogPostCoverProps) {
  if (post.cover) {
    const dims = PHOTO_DIMS[post.cover] ?? { width: 600, height: 400 };
    return (
      <Img
        src={post.cover}
        alt={post.title}
        width={dims.width}
        height={dims.height}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <IllustratedCover
      slug={post.slug}
      icon={resolveCoverIcon(post.iconForCover)}
      category={post.categories[0] ?? "Blog"}
      className={cn("h-full w-full rounded-none", className)}
    />
  );
}
