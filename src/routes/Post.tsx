import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import Seo from "@/components/layout/Seo";
import PostProgressBar from "@/components/sections/PostProgressBar";
import PostHero from "@/components/sections/PostHero";
import PostBody from "@/components/sections/PostBody";
import PostDonateCta from "@/components/sections/PostDonateCta";
import PostNav from "@/components/sections/PostNav";
import PostRelated from "@/components/sections/PostRelated";
import NotFound from "@/routes/NotFound";
import { posts } from "@/data/posts";
import { site } from "@/data/site";
import { getAdjacentPosts, getPostPath, getRelatedPosts } from "@/lib/blog";
import { useReadingProgress } from "@/hooks/useReadingProgress";

const SITE_ORIGIN = "https://4montgomeryskids.org";

/**
 * BLOG POST `/:year/:month/:slug` — docs/BUILD-PROMPT.md §6.7 / plan Task
 * 13. Looks the post up by its three route params against
 * `src/data/posts.ts`; any mismatch (bad year, bad month, bad slug, or a
 * slug that exists under a different year/month) renders the same
 * `NotFound` page used by the catch-all `*` route, per the task brief,
 * rather than a broken/blank page.
 *
 * Stays thin: every visual concern is its own `Post*.tsx` component in
 * src/components/sections/. This route owns only the lookup, the
 * reading-progress measurement (the `articleRef` below spans the hero
 * through the end-of-post Donate CTA — see `useReadingProgress`'s comment
 * on why it deliberately excludes the prev/next nav, related posts, and
 * global footer that follow), and the Article+BreadcrumbList JSON-LD.
 */
export default function Post() {
  const { year, month, slug } = useParams<{ year: string; month: string; slug: string }>();
  const articleRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(articleRef);

  // Hooks above this line always run, in the same order, on every render —
  // required by the Rules of Hooks — regardless of whether the lookup below
  // finds a post, so the early NotFound return has to come after them.
  const post = useMemo(
    () => posts.find((candidate) => candidate.year === year && candidate.month === month && candidate.slug === slug),
    [year, month, slug],
  );

  if (!post) {
    return <NotFound />;
  }

  const { prev, next } = getAdjacentPosts(post, posts);
  const relatedPosts = getRelatedPosts(post, posts);
  const canonicalPath = getPostPath(post);
  const isOrgByline = post.author === site.orgName;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        "@type": isOrgByline ? "Organization" : "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: site.orgName,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/images/logo-lockup.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}${canonicalPath}`,
      },
      image: [post.cover ? `${SITE_ORIGIN}/images/${post.cover}` : `${SITE_ORIGIN}/og/og-default.jpg`],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_ORIGIN}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_ORIGIN}${canonicalPath}` },
      ],
    },
  ];

  return (
    <>
      <Seo
        title={`${post.title} | 4Montgomery's Kids`}
        description={post.excerpt}
        path={canonicalPath}
        ogImage={post.cover ? `/images/${post.cover}` : undefined}
        jsonLd={jsonLd}
      />

      <PostProgressBar progress={progress} />

      <div ref={articleRef}>
        <PostHero post={post} />

        <article className="bg-brand-cream pb-8 pt-2 md:pb-12">
          <div className="mx-auto max-w-[68ch] px-6 lg:px-8">
            <PostBody body={post.body} />
            <div className="mt-10">
              <PostDonateCta />
            </div>
          </div>
        </article>
      </div>

      <PostNav prevPost={prev} nextPost={next} />
      <PostRelated posts={relatedPosts} />
    </>
  );
}
