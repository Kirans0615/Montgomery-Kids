# 4Montgomery's Kids — website

Vite + React + TypeScript + Tailwind CSS + shadcn/ui rebuild of the
4Montgomery's Kids (4MK) nonprofit site: Home, About Us, Our Stories,
Programs, Blog (21 real posts at their original URLs), and a post/404 page.

## Running locally

```bash
npm install
npm run dev
```

Opens a local dev server (Vite prints the URL, typically `http://localhost:5173`).

## Building

```bash
npm run build
```

This runs, in order:

1. `prebuild` (runs automatically before `build`):
   - `scripts/optimize-images.mjs` — generates responsive `.webp` variants
     of every photo under `public/images/opt/`, plus `public/og/og-default.jpg`.
   - `scripts/generate-sitemap.mjs` — generates `public/sitemap.xml` from the
     5 static top-level routes plus all 21 real blog post URLs in
     `src/data/posts.ts`.
2. `tsc -b && vite build` — typechecks and builds the production bundle to `dist/`.

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run preview     # serve the built dist/ locally
```

## GitHub Pages demo (client-preview only — not the production deploy)

A live demo is published automatically to GitHub Pages on every push to
`main`: `.github/workflows/gh-pages.yml` builds with `GH_PAGES=true` (which
sets Vite's `base` to `/Montgomery-Kids/` — see `vite.config.ts`, and every
image/video/favicon reference in `src/` resolves through `publicUrl()` in
`src/lib/publicUrl.ts` so it works under that subpath), copies the built
`index.html` to `404.html` so deep links and hard refreshes work (GitHub
Pages has no server-side rewrite, so a 404 is what actually serves that file
for any URL that isn't a real static asset — the SPA then boots from it and
renders the right page off the real address-bar URL), and adds `.nojekyll`
so `_headers`/`_redirects` aren't silently stripped by Jekyll's
underscore-file convention (unused on this host either way, but harmless to
keep).

This demo intentionally still reports `4montgomeryskids.org` as its
canonical/OG domain (see `SITE_ORIGIN` in `src/components/layout/Seo.tsx`) —
that's the real site's eventual identity, not a bug in the demo. The
`_redirects`/`vercel.json` legacy-URL redirects also don't apply here (GitHub
Pages doesn't run them), so `/25726-2/`-style old links only 301 on the real
Cloudflare/Vercel deploy below.

## Deploying to Cloudflare Pages

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20.19+ (20.x) or 22.13+ (22.x) — Node 24+ also works. This
  is the real minimum across the toolchain's own `engines` constraints (Vite 7
  and `@vitejs/plugin-react` need `^20.19.0 || >=22.12.0`; `eslint`/`@eslint/js`
  need `^20.19.0 || ^22.13.0 || >=24`, which is what pushes the 22.x floor up
  from 22.12 to 22.13). A plain "Node 18" claim will fail `npm install`/`vite`
  outright — don't go by that if you see it anywhere else.

Cloudflare Pages automatically copies everything in `public/` into the
build output, so `dist/robots.txt`, `dist/sitemap.xml`, and `dist/_redirects`
are all present and picked up without extra configuration — `_redirects` is
Cloudflare Pages' native redirects format and needs no further setup.

A `vercel.json` is also included at the repo root (same redirect rules plus
a SPA rewrite, in Vercel's own config format) in case the site is ever
deployed to Vercel instead of or alongside Cloudflare Pages — it is not
needed for a Cloudflare Pages deploy. Its `headers` section carries the same
three Cache-Control rules as `public/_headers` below (JSON has no comment
syntax, so the rationale lives here instead of inline in the file, to keep
Vercel's schema — which rejects unrecognized keys like a `comment` field —
happy):
- `/assets/(.*)` → cached forever (`immutable`). Everything under `/assets`
  is content-hashed by Vite, so a filename never changes without the
  content changing too.
- `/(images|og)/(.*)` → a long but revalidatable TTL
  (`stale-while-revalidate`). Photos and OG art keep stable filenames (so
  the client can swap a photo without a code change), so they can't be
  cached as aggressively as the hashed assets.
- `/index.html` → never cached (`max-age=0, must-revalidate`). It's the SPA
  shell every route rewrites to — caching it would hide a new deploy's
  updated asset hashes from returning visitors.

`public/_headers` is the file Cloudflare Pages actually reads for this same
policy (Cloudflare Pages does not read `vercel.json`) — see below.

## Cache-Control headers (`public/_headers`)

Cloudflare Pages reads a `public/_headers` file (Cloudflare's own format —
see [Cloudflare Pages: headers](https://developers.cloudflare.com/pages/configuration/headers/)),
not `vercel.json`. `public/_headers` mirrors the same three rules described
above, translated into Cloudflare's `path` + indented `header: value` block
syntax, so the cache policy actually takes effect on the primary
(Cloudflare Pages) deploy target rather than only existing on paper in
`vercel.json`. If the two files are ever changed, keep them in sync.

## Where to swap the two hero videos

Both hero video URLs live in `src/data/site.ts`:

```ts
export const HERO_VIDEO_HOME = "https://...";     // Home page hero
export const HERO_VIDEO_STORIES = "https://...";  // Our Stories page hero
```

Replace either constant with a URL to the new footage (any URL an
HTML5 `<video>` element can play). No other file needs to change — both
`Home`'s and `Our Stories`' hero components import these constants directly.

## How to add a blog post

All 21 posts live as one typed array in `src/data/posts.ts`. To add a new
one, append a new object to the `posts` array matching the existing `Post`
shape:

```ts
{
  slug: "your-post-slug",       // used in the URL: /:year/:month/:slug
  year: "2026",                 // 4-digit string
  month: "01",                  // 2-digit, zero-padded string
  date: "2026-01-15",           // ISO date, used for sorting and <lastmod>
  title: "Your Post Title",
  author: "4Montgomery's Kids", // or "Alan Kraut" for his bylined posts
  categories: ["News"],         // one or more of: News, Success Stories,
                                 // Donor Spotlight, What your money supports
  iconForCover: "HeartHandshake", // a lucide-react icon name (used when there's
                                   // no real photo) — OR use `cover: "file.jpg"`
                                   // if there's a real photo already in
                                   // public/images/ (never use the favicon)
  excerpt: "One-sentence summary shown on the Blog index cards.",
  body: [
    { type: "p", text: "A paragraph. **bold** and *italic* markup both work." },
    { type: "h3", text: "A sub-heading" },
    { type: "ul", items: ["A bullet", "Another bullet"] },
    { type: "quote", text: "A pull-quote.", cite: "Optional attribution" },
    { type: "video", youtubeId: "dQw4w9WgXcQ" },
    { type: "footnote", text: "Small italic footnote text." },
  ],
},
```

New posts are picked up automatically by:
- the Blog index (chronological order, category filters, year jump-list, pagination),
- the individual post page (`/:year/:month/:slug`, prev/next and related posts),
- `scripts/generate-sitemap.mjs` (re-run automatically by `npm run build`'s `prebuild` step).

No other file needs to be touched.

## Content decisions for the client to confirm (Leslie Shedlin / Agnes Leshner)

Per the build spec's §12 ("Content fixes to apply"), a few pieces of content
were intentionally left exactly as found in the original site/newsletters
rather than silently "fixed" or guessed at, because doing so would risk
inventing facts. These need a human decision from the client, not a
developer's guess:

### 1. Four different "kids helped" numbers appear on the site, unreconciled

The build spec was explicit: *"keep each number exactly where it appears in
the original... Do not reconcile them silently."* All four are real, sourced
from the actual site/newsletter content — they just don't agree with each other:

| Number | Where it appears | File / location |
|---|---|---|
| **"over 2,800 kids"** | Home page impact stat, and repeated on the About Us journey timeline's 2025 milestone ("a record-breaking year... over 2,800 kids' helped") | `src/components/sections/HomeImpact.tsx`, `src/data/timeline.ts` |
| **"2,852"** ("fulfilled requests") | Home page stat tile, Programs page animated counter, and the Our Stories hero's "stories · requests fulfilled" line | `src/components/sections/HomeImpact.tsx`, `src/components/sections/ProgramsRequestBand.tsx`, `src/components/sections/StoriesHero.tsx` |
| **"2,500 Kids"** | Title of the November 2025 blog post, "You Made It Happen: 2,500 Kids Supported and Counting" | `src/data/posts.ts` |
| **"over 2,600 children"** | Body text of that *same* November 2025 post ("We have supported over 2,600 children in foster care since our founding.") | `src/data/posts.ts` |

**Ask the client:** which figure (if any) is the current, correct total, so a
future update can either reconcile these or confirm they're meant to
represent different things (e.g. "total ever helped" vs "requests
fulfilled" vs a point-in-time figure from when each piece was written).

### 2. Old, non-linked email addresses inside older blog posts

Two email addresses appear as **plain text** (never as clickable links, and
never touched otherwise) inside older post bodies, exactly as originally
published:

| Email | Post | Context |
|---|---|---|
| `info@4montgomeryskids.org` | "Spring 2018 News" (`src/data/posts.ts`, slug `spring-2018-news`) | "If you would like to be a mentor please contact us at info@4montgomeryskids.org." |
| `montgomeryskids@montgomeryskids.org` | "How you can help" (`src/data/posts.ts`, slug `how-you-can-help`, 2017 — the oldest post) | "...send us their emails to montgomeryskids@montgomeryskids.org so we can share more of our needs..." |

**Ask the client:** whether either mailbox is still monitored. If not, these
are historical text as originally written and don't need to change — but if
someone might actually email them expecting a reply today, the client may
want a note added or the address updated (current active address per
`src/data/site.ts` is `lkshedlin@4montgomeryskids.org` / `aleshner@4montgomeryskids.org`).

### 3. `// AUDIT-GAP` placeholders

**None found.** The build spec's process (`docs/PLAN.md`) calls for any data
value referenced by the spec but genuinely missing from the source audit
(`docs/site-audit.md`) to be flagged inline with a `// AUDIT-GAP:` comment.
This was checked directly (not just taken on faith from earlier task
reports): a full-tree search of `src/` and `docs/` for `AUDIT-GAP` turns up
zero placeholders — every data file (`src/data/*.ts`) was built entirely
from real, sourced content. No client confirmation needed here; listed for
completeness since it was explicitly part of the ask.

### 4. The `leaf-deep` brand green was darkened for genuine accessibility compliance

The build spec's own color list described `leaf-deep` (the green used for
text and icons on light backgrounds) as already meeting "AA contrast" at its
original value, `#4F8A1E`. That claim was checked directly and found to be
false: measured against the site's actual page backgrounds, `#4F8A1E` only
reaches **4.14:1** contrast — below the 4.5:1 minimum WCAG AA requires for
text. During the accessibility pass (Task 15), this token was changed to a
darker green, **`#437517`**, which genuinely passes AA (5.24:1+ depending on
the background it sits on).

This is a real, visible color change — not an invisible code fix — and it
affects **15 elements that render on every page load, across all 6 pages**:

- **Home & Programs:** the "DisplayCards" stack (card titles and the
  "Approved" pill)
- **About Us:** the journey timeline's year labels, the "4" postcard stamp,
  board member role pills, board "Read more" links, the Get-Involved icons,
  and the Candid transparency-profile link
- **Our Stories:** all 11 "Read the story" links on the stories grid
- **Blog:** the featured post's call-to-action badge
- **Post** (individual blog post pages): category pills and the
  previous/next post hover links
- **Programs:** the bento grid's "From:" source-attribution links

(A further ~22 occurrences of this same token are keyboard-focus rings,
visible only while tabbing through the page, and one is a decorative
pie-chart segment color — a deliberate consistency choice, not an
accessibility fix. Full detail in `tailwind.config.ts`'s comment on the
`leaf-deep` token, and `.superpowers/sdd/PLAN/task-15-report.md` §3a.)

**Ask the client:** whether this darker green (`#437517`) is an acceptable
brand shade, or to sign off on/request a different shade — as long as any
replacement keeps at least 4.5:1 contrast against the site's cream/paper/
butter/mint backgrounds so the text stays legible and accessible.

---

## Known performance limitation

Mobile Lighthouse **Performance** is below the ≥90 target, and mobile
**Largest Contentful Paint (LCP)** misses the <2.5s target — and this is
**site-wide**: the final whole-branch review independently re-measured this
and found all 6 pages miss the mobile LCP target, not just 2 as an earlier
task's report stated.

The root cause is not the network or images. Lighthouse's own phase
breakdown attributes ~0% of LCP to "load delay" (time waiting on a network
request) and ~87% to "render delay" (time waiting on the browser to
download, parse, and execute JavaScript before it can paint anything). The
app isn't waiting on a slow connection — it's waiting for React to boot and
render client-side before the page has any content at all.

Closing this gap would require build-time prerendering or static-site
generation (SSG) of the static routes, so the initial HTML response already
contains real content instead of an empty shell that has to hydrate. That's
an architectural change beyond this build's scope — the app is a
client-side-rendered Vite + React SPA throughout — and should be scoped as
its own follow-up project if the client wants mobile Performance/LCP closed
to target.

Separately (and much smaller): `npm audit` reports 2 moderate advisories in
`react-router-dom@6.30.6` — an open-redirect issue and an SSR-only
constructor-injection issue. Neither is reachable in this app: there is no
server-side rendering, and every navigation target in the app is a
hardcoded literal path, never user-controlled input. The fix requires a
`react-router-dom` major version upgrade; noted here for awareness, not
urgent.

---

Everything else on the site (copy, quotes, names, board members, timeline,
programs, partner logos) is transcribed verbatim from the real site content
in `docs/site-audit.md`, with only the specific typo/link/byline fixes the
build spec called for in §12 applied — see `docs/BUILD-PROMPT.md` §12 for
that exact list.
