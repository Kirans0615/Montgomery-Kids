import Seo from "@/components/layout/Seo";
import BlogHero from "@/components/sections/BlogHero";
import BlogFeatured from "@/components/sections/BlogFeatured";
import BlogGrid from "@/components/sections/BlogGrid";
import HomeDonateBand from "@/components/sections/HomeDonateBand";
import { posts } from "@/data/posts";
import { getCategoryCounts, getDistinctYearsDesc, sortPostsByDateDesc } from "@/lib/blog";

/**
 * BLOG `/blog` — docs/BUILD-PROMPT.md §6.6 / plan Task 12. Stays thin: all
 * of the real work is in `src/components/sections/Blog*.tsx`. This route
 * just sorts the 21 posts newest-first, splits off the newest one as the
 * featured card, and hands the rest (plus the full archive's distinct
 * years and category counts, for the year rail and filter tabs) to
 * `BlogGrid`.
 *
 * Category counts are computed from `sortedPosts` (all 21, featured post
 * included) rather than `remainingPosts` (20) so the "All" tab badge
 * agrees with the hero's own "{postCount} posts" line — see
 * `BlogGrid.tsx`'s comment on this exact reconciliation.
 */
export default function Blog() {
  const sortedPosts = sortPostsByDateDesc(posts);
  const [featuredPost, ...remainingPosts] = sortedPosts;
  const years = getDistinctYearsDesc(sortedPosts);
  const categoryCounts = getCategoryCounts(sortedPosts);

  return (
    <>
      <Seo
        title="Blog | 4Montgomery's Kids"
        description="News, success stories, and donor spotlights from 4Montgomery's Kids — see exactly what your support makes possible for kids in Montgomery County's foster care system."
        path="/blog"
      />

      <BlogHero postCount={sortedPosts.length} />

      {featuredPost && <BlogFeatured post={featuredPost} />}

      <BlogGrid posts={remainingPosts} years={years} counts={categoryCounts} />

      <HomeDonateBand />
    </>
  );
}
