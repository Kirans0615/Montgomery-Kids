/**
 * Resolves a `public/`-relative asset path against Vite's configured `base`
 * (`import.meta.env.BASE_URL`), so every reference to a static asset
 * (images, videos, the OG image, favicons) works whether the site is served
 * from a domain root ("/", the real 4montgomeryskids.org deploy) or a
 * GitHub Pages project subpath ("/Montgomery-Kids/", the demo deploy — see
 * `GH_PAGES` in vite.config.ts).
 *
 * Accepts the path with or without a leading slash.
 */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/" or "/Montgomery-Kids/" — always trailing-slash
  return base + path.replace(/^\/+/, "");
}
