import { Helmet } from "react-helmet-async";

const SITE_ORIGIN = "https://4montgomeryskids.org";
const DEFAULT_OG_IMAGE = "/og/og-default.jpg";

interface SeoProps {
  title: string;
  /** Meta description — keep ≤155 chars per §11. */
  description: string;
  /** Route path, e.g. "/about-us" — canonical is always `${SITE_ORIGIN}${path}`. */
  path: string;
  /** Defaults to /og/og-default.jpg. Relative paths are resolved against SITE_ORIGIN. */
  ogImage?: string;
  /** Arbitrary JSON-LD object (or array of objects), rendered as application/ld+json. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /**
   * Emits `<meta name="robots" content="noindex, follow">`. Only the 404
   * page sets this: it's served at whatever bad URL the visitor hit, so
   * without it every typo'd or dead inbound link becomes an indexable
   * "Page Not Found" duplicate in search results.
   */
  noindex?: boolean;
}

/**
 * Thin per-route wrapper over react-helmet-async's <Helmet>, per
 * docs/BUILD-PROMPT.md §11/plan Task 5: title, description, a canonical
 * link that's always `https://4montgomeryskids.org{path}`, OG tags (default
 * image /og/og-default.jpg), and twitter:card=summary_large_image always.
 */
export default function Seo({ title, description, path, ogImage, jsonLd, noindex }: SeoProps) {
  const canonical = `${SITE_ORIGIN}${path}`;
  const resolvedOgImage = ogImage ?? DEFAULT_OG_IMAGE;
  const absoluteOgImage = resolvedOgImage.startsWith("http")
    ? resolvedOgImage
    : `${SITE_ORIGIN}${resolvedOgImage}`;

  return (
    // `defer={false}` commits title/meta/link changes synchronously instead
    // of react-helmet-async's default (batches the DOM write behind a
    // `requestAnimationFrame`, which never fires — so the tags never
    // actually reach the DOM — in any tab that never gets a paint, e.g. this
    // repo's own automated verification tooling (a backgrounded browser
    // tab, `document.hidden === true`), and plausibly some static-export/
    // prerendering crawlers too. Confirmed via direct testing while
    // building Task 9: with the default `defer: true`, `<title>`/meta/
    // canonical never updated in that backgrounded tab even after
    // seconds — `defer={false}` fixed it immediately, with no visual
    // difference for a normal, focused browser tab.
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteOgImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
