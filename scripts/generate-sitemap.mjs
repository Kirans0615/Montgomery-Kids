#!/usr/bin/env node
/**
 * Sitemap generator for 4Montgomery's Kids.
 *
 * Emits public/sitemap.xml from:
 *   - the 5 static top-level routes (Home, About Us, Our Stories, Programs,
 *     Blog) — see src/App.tsx for the real route table this must match, and
 *   - every one of the 21 real blog posts in src/data/posts.ts, at their
 *     real `/:year/:month/:slug` URL (matching `getPostPath()` in
 *     src/lib/blog.ts — no trailing slash, same shape `Seo`'s canonical
 *     link and every in-app post link use).
 *
 * This script deliberately avoids importing src/data/posts.ts as a module
 * (it's TypeScript, and this script runs under plain Node with no ts-node/
 * tsx dependency) — instead it reads the file as text and pulls each post's
 * `slug`/`year`/`month` fields with a small regex, since every post object
 * in that file writes those three fields consecutively, in that order, as
 * plain double-quoted string literals (verified against the file's actual
 * formatting; see the sanity check in main()).
 *
 * Run via `npm run prebuild` (wired in package.json alongside
 * optimize-images.mjs) or directly:
 *   node scripts/generate-sitemap.mjs
 */
import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_FILE = path.join(ROOT, "src", "data", "posts.ts");
const OUT_FILE = path.join(ROOT, "public", "sitemap.xml");

const SITE_ORIGIN = "https://4montgomeryskids.org";

/** The 5 static top-level routes, matching src/App.tsx's real route table. */
const STATIC_ROUTES = ["/", "/about-us", "/our-stories", "/programs", "/blog"];

/** Expected post count, per src/data/posts.ts's own header comment and Task 4's report. */
const EXPECTED_POST_COUNT = 21;

async function extractPosts() {
  const source = await readFile(POSTS_FILE, "utf-8");

  // Matches each post object's slug/year/month/date fields, in the exact
  // consecutive order every one of the 21 posts uses.
  const postPattern =
    /slug:\s*"([^"]+)",\s*\n\s*year:\s*"([^"]+)",\s*\n\s*month:\s*"([^"]+)",\s*\n\s*date:\s*"([^"]+)",/g;

  const posts = [];
  for (const match of source.matchAll(postPattern)) {
    const [, slug, year, month, date] = match;
    posts.push({ slug, year, month, date });
  }
  return posts;
}

function urlEntry(loc, lastmod) {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
}

function buildSitemap(posts) {
  const staticEntries = STATIC_ROUTES.map((route) => urlEntry(`${SITE_ORIGIN}${route}`));

  const postEntries = posts.map((post) =>
    urlEntry(`${SITE_ORIGIN}/${post.year}/${post.month}/${post.slug}`, post.date)
  );

  const body = [...staticEntries, ...postEntries].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function main() {
  const posts = await extractPosts();

  if (posts.length !== EXPECTED_POST_COUNT) {
    throw new Error(
      `[generate-sitemap] expected ${EXPECTED_POST_COUNT} posts, found ${posts.length} — the regex may no longer match src/data/posts.ts's formatting, or a post was added/removed without updating this script.`
    );
  }

  const uniqueSlugs = new Set(posts.map((post) => post.slug));
  if (uniqueSlugs.size !== posts.length) {
    throw new Error("[generate-sitemap] duplicate post slug detected — refusing to emit sitemap.xml");
  }

  const xml = buildSitemap(posts);

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, xml, "utf-8");

  console.log(
    `[generate-sitemap] wrote ${path.relative(ROOT, OUT_FILE)} (${STATIC_ROUTES.length} static routes + ${posts.length} posts = ${STATIC_ROUTES.length + posts.length} URLs)`
  );
}

main().catch((err) => {
  console.error("[generate-sitemap] failed:", err.message);
  process.exitCode = 1;
});
