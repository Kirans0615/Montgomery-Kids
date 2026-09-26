# Plan: 4Montgomery's Kids full site rebuild

Spec: `docs/BUILD-PROMPT.md` (authoritative, full text — every task below quotes its relevant sections but implementers MUST also open this file for anything not quoted). Content source of truth: `docs/site-audit.md` (744 lines — read it in full before writing any copy). Assets source: `https://github.com/Kirans0615/Montgomery-Kids` (public, clone with `--depth 1`).

## Global Constraints

These bind every task. Re-check your diff against this list before reporting DONE.

### Stack (§2)
## 2. Stack and project setup

- **Vite + React 18 + TypeScript (strict)**
- **Tailwind CSS v3.4** with a `tailwind.config.ts` holding all tokens (§3)
- **shadcn/ui** project structure: `components.json`, `src/lib/utils.ts` with `cn()`, primitives in `src/components/ui/`. Run `npx shadcn@latest init` and add: `button`, `dialog`, `sheet`, `badge`, `tooltip`, `tabs`, `input`, `separator`, `accordion`. The `/components/ui` folder matters because shadcn's CLI and the `@/components/ui/*` import alias both resolve there. Keep the two custom components from §7 in that folder too.
- Path alias `@/` → `src/` in both `tsconfig.json` and `vite.config.ts`.
- **react-router-dom v6** (BrowserRouter) for multi-page routing
- **framer-motion** (component motion, `whileInView`, layout animations, AnimatePresence page transitions)
- **gsap + @gsap/react** with **ScrollTrigger** (scroll-scrubbed parallax, pinned sections, horizontal scroll)
- **lenis** (smooth scroll, synced to GSAP's ticker; disabled when `prefers-reduced-motion: reduce`)
- **lucide-react** for all icons
- **react-helmet-async** for per-route `<title>`, meta description, canonical and OG tags
- **canvas-confetti** (tiny confetti burst on Donate clicks; see §9)
- **sharp** as a devDependency, for the image optimization script in §4
- **No backend.** No forms that POST anywhere. Contact goes through `mailto:` links. Donations go to the external form.
- Output is a static `dist/`. Add SPA fallback plus redirects for Cloudflare Pages/Netlify (`public/_redirects`) and Vercel (`vercel.json`). See §11.


### Design tokens, type, texture (§3 — exact values, do not alter)
## 3. Design direction

**Concept: "One child at a time."** The site should feel warm, hopeful, handmade and premium, like a beautifully printed annual report brought to life. It must not read as a generic charity template. Think sunlit paper, hand-drawn marks, confident editorial type, lots of real kids' faces, generous space, and motion that feels joyful but never childish or chaotic. The audience is donors (often older Montgomery County residents), social workers and community partners, so it has to be legible, trustworthy and calm underneath all the delight.

### 3.1 Color tokens (`tailwind.config.ts` → `theme.extend.colors.brand`)
Derived from the real logo (green + orange script wordmark) and the current site's yellow button color.
| token | hex | use |
|---|---|---|
| `ink` | `#1C2A20` | primary text, dark sections (deep forest ink; replaces flat #2A2A2A) |
| `ink-soft` | `#3E4B41` | secondary text on light |
| `leaf` | `#8EC63F` | brand green (logo "4MONTGOMERY'S", current nav active color) |
| `leaf-deep` | `#4F8A1E` | green for text/icons on light bg (AA contrast) |
| `sun` | `#FFB400` | brand yellow (current button color): primary CTA fills |
| `tangerine` | `#F28C28` | logo "Kids" orange: accents, hand-drawn strokes |
| `cream` | `#FFF8EC` | default page background |
| `paper` | `#FFFDF7` | cards |
| `butter` | `#FFE9B8` | soft highlight panels |
| `mint` | `#E6F4D3` | soft green panels |
| `sky` | `#DCEEFB` | occasional cool accent panel (sparingly) |

Rules: body text is always `ink`/`ink-soft` on cream/paper. `sun` buttons use `ink` text (not white; white on #FFB400 fails contrast). On `ink` backgrounds, use cream text and `sun`/`leaf` accents. Never use pure black or pure #FFFFFF page backgrounds.

### 3.2 Typography (Google Fonts, `display=swap`, preconnect)
- **Display:** `Fraunces` (variable, with opsz, SOFT and WONK axes; weights 500–800). Use `font-variation-settings: "SOFT" 100, "WONK" 1` on big headlines for a warm, slightly quirky serif.
- **Body/UI:** `Plus Jakarta Sans` (400, 500, 600, 700, 800)
- **Handwritten accent:** `Caveat` (500, 700). Use it for annotations, eyebrow scribbles, testimonial attributions and the hand-drawn title labels. Never for paragraphs.
- Tailwind `fontFamily`: `display`, `sans`, `hand`.
- Type scale (fluid, with `clamp()`): hero H1 `clamp(2.6rem, 6vw, 5.75rem)`, leading 1.0, tracking -0.03em. H2 `clamp(2rem, 4vw, 3.5rem)`, leading 1.05. H3 `clamp(1.35rem, 2vw, 1.75rem)`. Body 17–18px, leading 1.65. Small caps eyebrows are 12px, tracking 0.22em, uppercase, `leaf-deep`.
- Numbers (counters/stats) use Fraunces with `font-variant-numeric: tabular-nums`.

### 3.3 Texture, shape and detail language
- A subtle SVG **paper-grain noise** overlay on the body (fixed, `opacity-[0.035]`, `pointer-events-none`, `mix-blend-multiply`).
- **Hand-drawn SVG marks** (inline, stroke `tangerine` or `leaf`, round caps) that draw themselves on scroll with `pathLength`: underlines beneath key words, circles around words, small stars/sparkles, curly arrows pointing at CTAs. Build a `<Scribble variant="underline|circle|arrow|star|squiggle" />` component.
- **Soft organic blob shapes** behind images (SVG `path`, slowly morphing with framer-motion, low-opacity `butter`/`mint`). Keep them subtle, never neon.
- Images get **rounded 28px corners**, a thin `ink/10` ring and a soft long shadow (`0 30px 60px -20px rgba(28,42,32,.25)`). Some images are masked as tilted "polaroids" (white 10px border, rotated -3° to 4°, Caveat caption beneath).
- Section dividers are **wavy SVG edges** (not straight lines) between color changes.
- The yellow "divider bar" from the old site becomes a short **hand-drawn tangerine squiggle** under every section heading (keep the idea, upgrade the execution).
- Buttons: fully rounded pills. Primary: `bg-sun text-ink`, 600 weight, with an arrow icon that slides right on hover and a **magnetic** hover effect (it follows the cursor up to 8px). Secondary: `ink` outline on light, cream outline on dark. Every button has a visible focus ring (`ring-2 ring-offset-2 ring-leaf-deep`).
- Cards: `bg-paper rounded-3xl`, a hairline border, and on hover lift -6px with a gentle 3D tilt (max 6°). Tilt is off on touch devices and with reduced motion.

### 3.4 Global animation keyframes (index.css; keep these exact names and values)
```css
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#FFF8EC;color:#1C2A20}
@keyframes fade-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-down{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
.animate-fade-up{animation:fade-up .8s cubic-bezier(0.16,1,0.3,1) both}
.animate-fade-down{animation:fade-down .7s cubic-bezier(0.16,1,0.3,1) both}
.stagger-1{animation-delay:0ms}.stagger-2{animation-delay:120ms}.stagger-3{animation-delay:240ms}
.stagger-4{animation-delay:360ms}.stagger-5{animation-delay:480ms}.stagger-6{animation-delay:600ms}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
```
Global easing for framer-motion: `[0.16, 1, 0.3, 1]`. Default reveal: `opacity 0→1`, `y 24→0`, 0.8s, `viewport={{ once: true, margin: "-80px" }}`.

### Motion system primitives every later task may use (§8)
## 8. Motion system (more "wow" features; build all of these)

1. **Smooth scroll**: Lenis (duration 1.1, `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`) wired to `gsap.ticker`, with ScrollTrigger updating on Lenis scroll. Off with reduced motion.
2. **`<Reveal>`**: the default entrance wrapper (fade-up, once). `<Reveal stagger>` staggers its children by 80ms.
3. **`<SplitText>`**: splits headings into words (and optionally chars) that rise from masked lines. Accessible: the real text sits in an `aria-label` or sr-only span, and the split spans are `aria-hidden`.
4. **`<Counter>`**: counts up on view (easeOutExpo), formats with commas, tabular nums, and respects reduced motion (shows the final value).
5. **`<Marquee>`**: CSS-transform infinite loop, speed prop, direction prop, pause on hover/focus-within.
6. **`<Parallax>`**: GSAP scrub `yPercent` for images and blobs.
7. **`<MagneticButton>`**: pointer-follow up to 8px with spring return (pointer: fine only).
8. **`<TiltCard>`**: 3D tilt max 6° plus a moving specular highlight (radial gradient following the cursor).
9. **`<Scribble>`**: hand-drawn SVG marks that draw on view (pathLength).
10. **Highlighter swipe**: a `sun/60` background that animates across a key phrase on view.
11. **Cursor sparkles** (desktop only, very subtle): tiny `sun`/`leaf` 4-point stars trail the pointer when it's over the Donate band only (not site-wide). Max 12 particles, canvas-based, off with reduced motion.
12. **Page transition wipe** (§5).
13. **Scroll progress**: a thin `leaf` line at the top on long pages (About, Stories, posts).
14. **Section color morph**: the `<body>` background eases between cream → mint → cream as specific sections enter (GSAP), so color changes feel continuous rather than blocky.
15. **Floating decor**: a few slow-floating hand-drawn doodles (star, heart, paper plane, sun) in section margins on desktop, parallaxed at different speeds, `aria-hidden`.

Performance guardrails: animate only `transform`/`opacity`/`clip-path`. Use `will-change` only while animating. Keep all GSAP work inside `useGSAP` with proper cleanup. No layout thrash. Lazy-load below-fold sections with `React.lazy` + Suspense per route.

### Donate behavior, used by every Donate/DONATE button (§9)
## 9. Donate behavior (`src/lib/donate.ts`)
`openDonate(e)`: fires `canvas-confetti` from the button's position (palette colors `#FFB400 #8EC63F #F28C28 #FFF8EC`, 60 particles, `disableForReducedMotion: true`), then after 350ms calls `window.open(DONATE_URL, "_blank", "noopener")`. It is still a real `<a href target="_blank" rel="noopener">` so it works without JS and for middle-click; call `preventDefault` only on a plain left-click. Every Donate/DONATE button in the site uses this.


### Accessibility (§10 — must pass on every task's output)
## 10. Accessibility (must pass)
- WCAG 2.2 AA contrast on every text/background pair (check `sun` + `ink`, cream-on-ink, and `leaf-deep` on cream).
- One H1 per page. Logical H2/H3 order (fixes the current H3-as-title and H1-for-partner-name problems).
- Skip-to-content link. `<header>`, `<nav aria-label="Main">`, `<main id="main">`, `<footer>` landmarks.
- Every image has the alt text from §4. Decorative SVGs are `aria-hidden`.
- Full keyboard support: menu, slider, dialog, filters, carousels, donut legend. Visible focus rings everywhere.
- `prefers-reduced-motion`: disables Lenis, pinning, parallax, split text, video autoplay (shows the poster), confetti, cursor sparkles and marquees (they become static wrapped lists). Content stays 100% readable and reachable.
- The video has a pause control. Nothing flashes more than 3 times a second.
- Touch targets are at least 44×44px.


### Content fixes — apply ONLY these, otherwise copy is verbatim from the audit (§12)
## 12. Content fixes to apply (and ONLY these; otherwise wording stays verbatim)
Broken links: Home slide 2 Donate → new donation URL · Home slide 3 Donate (`#`) → donation URL · About "View Our Stories" → `/our-stories` · "Follow us on Facebook" → real link.
Mismatch: Home slide 3 title changed to "Staying Connected to High School" to match its body text.
Typos: "wefare" → "welfare" · "n our first year" → "In our first year" · "4Montogmerys Kids" → "4Montgomery's Kids" · "additionalexciting" → "additional exciting" · "team,Due" → "team. Due" · `"yes!"to` → `"yes!" to` · About contact line spacing ("…org or Board Chair…") · missing opening quote on the About quote · "Norah Roberts" → "Nora Roberts" · "10421Westlake Drive" footer address replaced with the About/donation-form address "10421 Motor City Drive" · "what if can do" → "what it can do" · "in the their homes" → "in their homes" · "in the our community" → "in our community" · "Montgomery Kids program" wording inside quotes stays as the youth wrote it (quotes are never edited except for obvious typos).
Stale: footer © year is computed at runtime. Programs counter "10" is shown as "10+".
Numbers: keep each number exactly where it appears in the original (Home "over 2,800 kids", Programs "2852", Nov 2025 post title "2,500 Kids" with body "over 2,600 children"). Do not reconcile them silently. List the inconsistency in the README for the client.
Old emails in posts (`montgomeryskids@montgomeryskids.org`, `info@4montgomeryskids.org`): keep the text but don't make them links. Note them in the README.
Bylines: "kd44montkids" → "4Montgomery's Kids".


### Do NOT (§13)
## 13. Do NOT
- Do not invent statistics, quotes, names, programs, partners, events or photos of children. Every fact must trace to `docs/site-audit.md`.
- Do not use the favicon as a post cover. Do not hotlink Gmail-proxy images or any unverified stock URL.
- Do not use Inter/Roboto/Arial as the primary UI font, purple gradients, glassmorphism everywhere, generic "hero with 3 feature cards" layouts, or emoji as icons.
- Do not add a backend, a CMS, login, cookies/tracking or analytics.
- Do not put the donation form in an iframe. Always link out.
- Do not autoplay audio. Do not remove any original section or copy block unless §12 says so (the empty Divi rows and the orphan `/blog` duplicate are the only things removed).
- Do not leave console errors, TypeScript errors, unused imports or failing lint.


### Full sitemap/nav/routes reference (§5)
## 5. Sitemap, routes and navigation (same six nav items, same order, same labels)

| Nav label (exact) | Route | Notes |
|---|---|---|
| Home | `/` | |
| About Us | `/about-us` | |
| Our Stories | `/our-stories` | |
| Programs | `/programs` | 301 from `/25726-2/` |
| Blog | `/blog` | 301 from `/blog-2/` and `/blog-2/page/*` |
| DONATE | external donation URL | Now styled as the primary `sun` pill button; opens in a new tab with `rel="noopener"` |

Also:
- `/:year/:month/:slug` renders a blog post. **Keep the exact original post URLs from the audit §5** so existing links and SEO survive.
- `/overview` → 301 to `/about-us`
- `*` → a custom 404 page (tug-of-war photo, a Caveat "Oops — this page wandered off", buttons to Home and Our Stories)
- Scroll to top on route change (Lenis `scrollTo(0, {immediate:true})`).
- Page transitions: AnimatePresence. The outgoing page fades to 0 and moves 8px up; a `sun`-colored panel with the small green "4" mark wipes up and away (0.6s total). Skip it with reduced motion.


---

# Task 1: Project scaffold, tokens, fonts, global CSS

Scaffold the Vite + React 18 + TypeScript (strict) project in the current directory (`~/4montgomery-kids`, already a git repo with `docs/BUILD-PROMPT.md` and `docs/site-audit.md` in place — do not overwrite those).

Do exactly what §2 and §3 of `docs/BUILD-PROMPT.md` specify (quoted in Global Constraints above): Vite+TS+Tailwind v3.4+shadcn scaffold, the folder layout from §2, path alias `@/` → `src/` in both `tsconfig.json` and `vite.config.ts`, `tailwind.config.ts` with the full `brand` color palette from §3.1, `fontFamily.display/sans/hand` per §3.2 (Fraunces variable w/ opsz+SOFT+WONK axes, Plus Jakarta Sans, Caveat — Google Fonts with `display=swap` + preconnect in `index.html`), the fluid type scale from §3.2, and `src/index.css` containing **exactly** the CSS block given in §3.4 of the build prompt (keyframe names and values verbatim) plus Tailwind's `@tailwind base/components/utilities` directives before it.

Install all dependencies listed in §2: `@base-ui`-free (shadcn's own deps as needed), `react-router-dom` v6, `framer-motion`, `gsap` + `@gsap/react`, `lenis`, `lucide-react`, `react-helmet-async`, `canvas-confetti` (+ `@types/canvas-confetti` if it exists), `sharp` as a devDependency. Run `npx shadcn@latest init` and add: `button`, `dialog`, `sheet`, `badge`, `tooltip`, `tabs`, `input`, `separator`, `accordion`.

Create the full folder skeleton from §2's layout block (empty/stub files are fine for anything other pages/tasks will fill in — but every file must at least exist and type-check; a stub component may render `null` or a placeholder `<div>` with a `// TODO(task N)` comment naming which later task fills it in).

Wire a minimal `App.tsx` + `main.tsx` (with `HelmetProvider` from react-helmet-async) that renders literally anything (e.g. "4Montgomery's Kids — under construction") so `npm run build` succeeds with zero TypeScript errors and zero build errors. Do not build routing yet — that's Task 7.

**Verify:** `npm run build` exits 0, `npm run typecheck` (`tsc --noEmit`) exits 0, `npm run lint` exits 0 (add an `eslint.config.mjs` if the Vite template didn't include one — the Flat Bridge sibling project at `~/flatbridge/eslint.config.mjs` is a reasonable reference for a strict React+TS config, but this project has no Next.js so don't copy Next-specific rules).

Report the exact versions installed for react-router-dom, framer-motion, gsap and tailwindcss in your report file.

---

# Task 2: Assets pipeline — clone, rename, optimize, OG image

Depends on Task 1 (needs `public/`, `scripts/` to exist and `sharp` installed).

## 4. Images: exact mapping (use ONLY these real photos for people/kids)

Copy every file from the cloned repo into `public/images/` with these new kebab-case names. Then write `scripts/optimize-images.mjs` (sharp), which outputs `.webp` at widths 480/960/1600 (never upscaling past the original) into `public/images/opt/`. Run it as a `prebuild` npm script and once now. Build a `<Img>` component that renders `<picture>` with a webp `srcSet`, a fallback to the original, `width`/`height` attributes (no layout shift), `loading="lazy"` (except hero images: `fetchpriority="high"`, eager), `decoding="async"`, and **meaningful alt text** (given below).

| repo file | new name | what it shows | where it's used | alt text |
|---|---|---|---|---|
| `Untitled-1.png` (800×226) | `logo-lockup.png` | 4Montgomery's Kids wordmark + Candid "Platinum Transparency 2026" seal side by side | Navbar logo (whole lockup), footer (on a paper-colored rounded chip) | "4Montgomery's Kids — Candid Platinum Transparency 2026" |
| `favicon-150x150.png` | `favicon.png` | favicon | `<link rel=icon>` + apple-touch-icon | — |
| `students-377789_1280-1024x679.jpg` | `kids-writing-desks.jpg` | children writing at school desks | Home hero video **poster** + Blog hero bg | "Children concentrating on schoolwork at their desks" |
| `Jumping-rope-wide.jpg` (1450×801) | `double-dutch.jpg` | kid mid-air in a double-dutch jump rope crowd | Home impact section (big parallax image); About hero bg | "A child leaps mid-air over double-dutch jump ropes as a crowd cheers" |
| `shutterstock_539264002-scaled.jpg` (2560×1707) | `dance-recital.jpg` | girls in yellow tutus performing on stage | Programs hero bg | "Young dancers in bright costumes performing on stage" |
| `iStock-481495699.jpg` | `tug-of-war.jpg` | laughing kids playing tug of war | Home "About" strip collage; Stories CTA card; 404 page | "Laughing kids pulling together in a game of tug of war" |
| `iStock-1031634992.jpg` | `graduate.jpg` | smiling young man in cap and gown holding diploma | Story "Graduating in Style" (+ Home slide 2); Programs "Scholarships" tile | "A smiling graduate in cap and gown holding his diploma" |
| `iStock-1289226447.jpg` | `bike-ride.jpg` | teen riding a red bike down a tree-lined path | Story "Providing a Critical Outlet" (+ Home slide 4) | "A young person riding a bicycle down a leafy path" |
| `iStock-1337490943.jpg` | `teen-driver-smiling.jpg` | smiling teen girl with glasses behind the wheel | Home slide 3 image is NOT this (see §6.3); use for the Programs "Emergency transportation" tile | "A smiling teenager behind the wheel of a car" |
| `young-woman-driving-car-gettyimages-680x402-1.jpg` | `young-woman-driving.jpg` | young woman smiling while driving | Story "Fulfilling a Young Girl's Dream to Drive" | "A young woman smiling as she drives" |
| `iStock-139976464.jpg` | `peewee-football.jpg` | young football player (#52) watching his team | Story/slide "The Young Champion"; blog post "Peewee Football Champions" cover | "A young football player in a helmet watching his team on the field" |
| `crop-Depositphotos_247059818_l-2015-e1606228205102.jpg` | `toddler-blocks.jpg` | laughing toddler playing with colorful blocks | Story "Equipping for a Toddler's Future" | "A laughing toddler playing with colorful building blocks" |
| `Leslie-Pic-for-Website-edited-1.jpg` | `board-leslie-shedlin.jpg` | portrait | Board | "Leslie Shedlin, President" |
| `Agnes-Lesner.jpg` | `board-agnes-leshner.jpg` | portrait | Board | "Agnes Leshner, Board Chair" |
| `Ronna-1.jpg` | `board-ronna-cook.jpg` | portrait | Board | "Ronna Cook, Treasurer" |
| `AlanKraut.jpg` | `board-alan-kraut.jpg` | portrait | Board | "Alan Kraut, Board Member" |
| `Cynde-Burgess.jpg` | `board-cynde-burgess.jpg` | portrait | Board | "Cynde R. Burgess, Board Member" |
| `100WCA-horizontal.png` | `partner-100-who-care.png` | logo | Partners | "100 Who Care Alliance" |
| `St-Annes-words-1.png` | `partner-st-annes.png` | logo | Partners | "Saint Anne's Episcopal Church, Damascus" |
| `1-1.png` | `partner-women-who-care-lower-moco.png` | "women who care in lower moco" logo | Partners | "Women Who Care in Lower MoCo" |
| `Nora-Roberts-Foundation-Logo.png` | `partner-nora-roberts.png` | logo | Partners | "Nora Roberts Foundation" |
| `Healthcare-Initiative-Foundation.png` | `partner-hif.png` | logo | Partners | "Healthcare Initiative Foundation" |

**Stories and posts with no matching photo:** do NOT reuse the favicon as a cover (the current site does this, and it looks broken). Do NOT hotlink stock photos you can't verify. Instead build a designed **`<IllustratedCover>`** component: a rounded panel with a soft two-tone gradient from the palette (rotate through butter→sun, mint→leaf, sky→mint, blush→tangerine), a big lucide icon relevant to the story (e.g. `Home` for apartment, `Car` for car repair, `Laptop` for Chromebook, `ShieldCheck` for medical ID, `Scissors` for cosmetology, `GraduationCap`, `Tent`, `Gift`, `HeartHandshake`, `Turtle`, `Bus`), a scattering of hand-drawn sparkles, and the category in Caveat. Deterministic per slug. This looks intentional and on-brand.

**Video:** see §6.1 and §6.8. Hero videos use the two provided CloudFront URLs as sources, but always with a real **poster** from the table above. Put both URLs in `src/data/site.ts` as `HERO_VIDEO_HOME` and `HERO_VIDEO_STORIES` so they can be swapped for custom footage later.


Steps:
1. `git clone --depth 1 https://github.com/Kirans0615/Montgomery-Kids /tmp/mk-assets`
2. Copy every file in the mapping table above from `/tmp/mk-assets` into `public/images/` under its new kebab-case name. If a listed source filename does not exist in the cloned repo, search the repo for the closest match (case-insensitive, ignoring `-scaled`/dimension suffixes) and use that; note any substitution in your report.
3. Write `scripts/optimize-images.mjs` using `sharp`: for every raster image in `public/images/` that is used as a responsive `<Img>` source per the mapping table (the `board-*`, `partner-*`, `kids-writing-desks`, `double-dutch`, `dance-recital`, `tug-of-war`, `graduate`, `bike-ride`, `teen-driver-smiling`, `young-woman-driving`, `peewee-football`, `toddler-blocks` files), generate `.webp` at widths 480/960/1600 into `public/images/opt/<basename>-<width>.webp`, never upscaling past the original width (skip a width larger than the source and log which ones were skipped). Also emit a single 1x `.webp` (no width suffix) for `logo-lockup.png`. Wire it as the `prebuild` npm script and run it once now.
4. Generate `public/og/og-default.jpg` (1200×630) at build time: compose `kids-writing-desks.jpg` (cover-cropped to 1200×630) with the `logo-lockup.png` mark placed bottom-left on a small paper-colored rounded chip, using sharp composite. Add this as a step in `scripts/optimize-images.mjs` (or a second script called from the same `prebuild` step) and run it once now so the file exists.
5. Put both hero video CloudFront URLs into `src/data/site.ts` as named exports `HERO_VIDEO_HOME` and `HERO_VIDEO_STORIES` (exact URLs are in §6.1 and §6.4 of the build prompt — open it and copy them verbatim, do not retype from memory).

**Verify:** every file in the mapping table exists at its new name in `public/images/`; `public/images/opt/` contains the expected `-480/-960/-1600.webp` triples (or fewer, for small originals, with the skip logged); `public/og/og-default.jpg` exists and is 1200×630; `npm run build` still exits 0.

---

# Task 3: Core content data files (everything except blog posts)

Depends on Task 1 (folder skeleton) and Task 2 (image filenames must exist to reference).

Read `docs/site-audit.md` in full first (744 lines — read it to the end, in chunks if needed). It is the ONLY source for facts, numbers, names, quotes and copy. Then write these files in `src/data/`, transcribing copy **verbatim** from the audit except for the exact fixes listed in Global Constraints §12 above:

- `site.ts`: org name, tagline, mailing address (§0.6 of the build prompt: 4Montgomery's Kids, P.O. Box 34864, 10421 Motor City Drive, Bethesda, MD 20817), donation URL (`https://secure.4montgomeryskids.org/forms/donations`), Facebook URL, both contact emails + names/titles (Leslie Shedlin, President; Agnes Leshner, Board Chair), founded year 2015, `HERO_VIDEO_HOME`/`HERO_VIDEO_STORIES` (already added in Task 2 — keep them here, don't duplicate).
- `stories.ts`: the 5 home-page story slides (§6.1 Section 3) AND the 11 Our-Stories cards + CTA card (§6.4 Section 2), with categories (Education/Independence/Wellbeing) per the assignment given there, image or IllustratedCover-icon per the mapping tables in §4/§6.1/§6.4, and the title fix for slide 3 ("Staying Connected to High School") per §12.
- `testimonials.ts`: all 6 home testimonials verbatim with exact attributions, from audit §6 Section 5.
- `board.ts`: the 5 board members with exact bios from audit §7 Section 3 (apply the "wefare"→"welfare" fix), titles as given in §6.3 Section 3 of the build prompt.
- `partners.ts`: the 6 partners from audit + build-prompt §4/§6.1's Home 'Backed by' list and §6.3 Section 5's Partners list, each with logo filename (or null for The Phase Foundation, which is text-only) and outbound URL (100whocarealliance.org, saintannesdamascus.net, lowermocowwc.com, norarobertsfoundation.org, hifmc.org).
- `programs.ts`: the 10-item 'what your money supports' bullet list verbatim (audit §9 of the build prompt / matching section in the audit), the 3 named programs for the Programs hero DisplayCards (Boost, Scholarships, Project Turkey), and the 6 bento-grid program tiles from build-prompt §6.5 Section 3 with their exact facts, quotes and source-post citations.
- `timeline.ts`: the 'Our journey' milestones from build-prompt §6.3 Section 2b, verbatim (2015 through 2025).
- `allocation.ts`: the fiscal-year donut data from the 'Spring Forward' post — Education 20%, Transportation 11%, Recreational activities 15%, Housing 1%, Personal & household needs 53% — plus the exact caption quote given in build-prompt §6.1 Section 4b.

Every data file must be strictly typed (exported `interface`/`type` + `const ... satisfies` or typed array), no `any`. Do not invent anything not present in `docs/site-audit.md` — if a value the build prompt asks for genuinely isn't in the audit, flag it in your report as a NEEDS_CONTEXT-worthy gap rather than inventing it, but still produce your best-effort typed placeholder marked with a `// AUDIT-GAP:` comment so the build doesn't break, and list every such gap in your report.

**Verify:** `npm run typecheck` passes; every image filename referenced exists in `public/images/` (from Task 2); every numeric fact you typed matches a number that actually appears in `docs/site-audit.md` (quote the matching line in your report for at least the headline ones: 2,800, 2,852, 10 years, 2,015 founding, , -,000, 20/11/15/1/53%).

---

# Task 4: Blog post data — all 21 posts, full text

Depends on Task 1. Independent of Task 3 (different data file) but do not start until Task 2 has landed image filenames, since some posts reference covers.

### 6.7 BLOG POST `/:year/:month/:slug`
- The data lives in `src/data/posts.ts`: `{ slug, year, month, date (ISO), title, author, categories[], cover?, iconForCover, excerpt, body }`. Author the `body` as an array of typed blocks (`p`, `h3`, `ul`, `quote`, `video`, `image`, `footnote`) transcribed **in full from audit §11** with bold/italic preserved (inline markup via a tiny renderer; no `dangerouslySetInnerHTML`). Apply the §12 typo fixes.
- Layout: reading-progress bar (a thin `sun` line at the top of the viewport), a hero with title (Fraunces), meta (author · date · categories · reading time), and the cover. The prose column is max 68ch with nice typographic rhythm, pull-quotes styled with a big tangerine quote mark, and lists with leaf checkmarks.
- YouTube embeds in "Moving to Independence" (`SdGjQlQfNbU`, `kGPDdpDPDSw`): use a **lite-embed facade** (thumbnail from `https://i.ytimg.com/vi/{id}/hqdefault.jpg` + play button) that swaps to a `youtube-nocookie.com` iframe on click.
- Inline images that were hot-linked from Gmail proxies in 2018–2019 posts are dropped (they're fragile). Replace the "[image]" slots with a styled pull-quote or omit them. The "Over 550" post's funding graph image isn't available, so render its bullet list nicely instead.
- The end of every post has an inline **Donate CTA card** (every appeal post ends with "please donate", and the current site has no button). Then prev/next post navigation (chronological) and 3 related posts (same category first).
- `Article` JSON-LD per post.

Read `docs/site-audit.md` §11 (the full transcript of all 21 blog posts) end to end before writing anything — it is long; read it in chunks until you reach the end of the posts section. Transcribe **every** post in full, preserving bold/italic via the typed block schema below (never `dangerouslySetInnerHTML`). Apply the exact §12 fixes from Global Constraints above (typos, byline "kd44montkids"→"4Montgomery's Kids" except keep "Alan Kraut" attributed posts as Alan Kraut, old emails kept as plain text not links, numbers left exactly as originally stated per post — do not reconcile the 2,500 vs 2,600 vs 2,800 discrepancy, just transcribe each as written and note it).

Write `src/data/posts.ts`:
```ts
export type PostBlock =
  | { type: "p"; text: string /* inline **bold** / *italic* markup, rendered by a tiny inline renderer, not dangerouslySetInnerHTML */ }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "video"; youtubeId: string }
  | { type: "image"; src: string; alt: string }
  | { type: "footnote"; text: string };

export interface Post {
  slug: string; year: string; month: string; date: string; // ISO
  title: string; author: string; categories: string[];
  cover?: string; iconForCover?: string; // lucide icon name, used by IllustratedCover when cover is absent
  excerpt: string; body: PostBlock[];
}
```
Keep the **exact original post URLs** (slug/year/month) from audit §5 so links survive — cross-check every slug against the audit's URL list, don't guess-format them.

Assign categories per build-prompt §6.6: All posts get at least one of News / Success Stories / Donor Spotlight / What your money supports, per the explicit assignments given there ("You Made It Happen"→What your money supports; "How scary…"→News; "10 Years…"→News; "Spring Forward"→Success Stories; "We are Thankful for You"→Success Stories; "Fall for Kids"→What your money supports; "Spring Arrives"→Success Stories; "Ammerman"→Donor Spotlight; use your best editorial judgment for the rest, consistent with those examples, and list your assignment for every post in your report).

The two YouTube videos in "Moving to Independence" (IDs `SdGjQlQfNbU` and `kGPDdpDPDSw`) become `{ type: "video", youtubeId }` blocks. Inline images that were hot-linked from Gmail proxies in 2018–2019 posts are dropped — replace with a `quote` block pulling the surrounding sentence, or omit if there's nothing to pull. The 'Over 550' post's funding graph image becomes a nicely rendered `ul`.

**Verify:** `npm run typecheck` passes; exactly 21 posts in the array; every post has a non-empty `body`; every slug is unique; report each post's category assignment and flag any post where the audit text was ambiguous about date/URL.

---

# Task 5: Motion primitives, Img/IllustratedCover/Seo, hooks, donate.ts

Depends on Task 1 only (does not need content data).

Build every primitive named in §8 of the build prompt (quoted in Global Constraints above) as its own file under `src/components/motion/`: `Reveal.tsx`, `SplitText.tsx`, `Counter.tsx`, `Marquee.tsx`, `Parallax.tsx`, `MagneticButton.tsx`, `TiltCard.tsx`, `Scribble.tsx` (variants: underline|circle|arrow|star|squiggle, per §3.3). Every primitive must read `prefers-reduced-motion` via the shared `useReducedMotion` hook (below) and degrade exactly as §10/§13 require — static, fully readable, no motion — never merely 'faster'.

### 3.3 Texture, shape and detail language
- A subtle SVG **paper-grain noise** overlay on the body (fixed, `opacity-[0.035]`, `pointer-events-none`, `mix-blend-multiply`).
- **Hand-drawn SVG marks** (inline, stroke `tangerine` or `leaf`, round caps) that draw themselves on scroll with `pathLength`: underlines beneath key words, circles around words, small stars/sparkles, curly arrows pointing at CTAs. Build a `<Scribble variant="underline|circle|arrow|star|squiggle" />` component.
- **Soft organic blob shapes** behind images (SVG `path`, slowly morphing with framer-motion, low-opacity `butter`/`mint`). Keep them subtle, never neon.
- Images get **rounded 28px corners**, a thin `ink/10` ring and a soft long shadow (`0 30px 60px -20px rgba(28,42,32,.25)`). Some images are masked as tilted "polaroids" (white 10px border, rotated -3° to 4°, Caveat caption beneath).
- Section dividers are **wavy SVG edges** (not straight lines) between color changes.
- The yellow "divider bar" from the old site becomes a short **hand-drawn tangerine squiggle** under every section heading (keep the idea, upgrade the execution).
- Buttons: fully rounded pills. Primary: `bg-sun text-ink`, 600 weight, with an arrow icon that slides right on hover and a **magnetic** hover effect (it follows the cursor up to 8px). Secondary: `ink` outline on light, cream outline on dark. Every button has a visible focus ring (`ring-2 ring-offset-2 ring-leaf-deep`).
- Cards: `bg-paper rounded-3xl`, a hairline border, and on hover lift -6px with a gentle 3D tilt (max 6°). Tilt is off on touch devices and with reduced motion.


Build the hooks in `src/hooks/`:
- `useVideoFade.ts`: implement the exact algorithm in build-prompt §6.4 Section 1 (the custom JS fade system: 250ms rAF fade in/out, `fadingOutRef` guard, no `loop` attribute, cancel-and-resume-from-current-opacity semantics). Open §6.4 for the full spec — it is detailed and exact, transcribe the behavior precisely, don't approximate.
- `useScrolled.ts`: boolean, true once `window.scrollY > 20`, for the Navbar's background swap.
- `useReducedMotion.ts`: wraps `matchMedia('(prefers-reduced-motion: reduce)')` with a live-updating listener.
- `useLockBody.ts`: locks `<body>` scroll while a boolean is true (mobile menu / dialog), restores prior overflow on unmount.

Build in `src/components/ui/`:
- `img.tsx` (component name `Img`): renders a `<picture>` with webp `srcSet` (480/960/1600 from `public/images/opt/`) + fallback `<img>` to the original, explicit `width`/`height` (no CLS), `loading="lazy"` by default, a `priority` prop that switches to `fetchpriority="high" loading="eager"`, `decoding="async"`, and a required `alt` prop (TypeScript should make `alt` mandatory, no default).
- `illustrated-cover.tsx` (component `IllustratedCover`): rounded panel, two-tone gradient rotating deterministically per `slug` prop through butter→sun / mint→leaf / sky→mint / cream→tangerine, a lucide icon prop, scattered hand-drawn sparkles (reuse `Scribble` variant="star"), category label in Caveat. Deterministic means the same slug always renders the same gradient — hash the slug string to pick the index, don't use `Math.random`.

Build `src/components/layout/Seo.tsx`: a thin wrapper over `react-helmet-async`'s `<Helmet>` taking `title`, `description`, `path`, optional `ogImage`, optional `jsonLd` (arbitrary object, rendered as a `<script type="application/ld+json">`). Canonical is always `https://4montgomeryskids.org{path}`. Default OG image is `/og/og-default.jpg`. Always emits `twitter:card=summary_large_image`.

Build `src/lib/donate.ts` exactly per §9 of the build prompt (quoted in Global Constraints): `openDonate(e)` fires confetti with the exact palette and counts given, then after 350ms opens the donation URL in a new tab; it must remain a real anchor (`<a href target="_blank" rel="noopener">`) that works with JS disabled and on middle-click — `preventDefault` only on a plain left click.

**Verify:** `npm run typecheck` passes; write a tiny throwaway route or Storybook-less smoke page is NOT required — instead, in your report, list each primitive with a one-line confirmation of how you validated it renders (e.g. temporarily mounted in `App.tsx`, screenshot, then removed) since there's no test runner in this stack per §2 (no backend, no CMS — the build prompt doesn't ask for a unit-test framework; visual/manual verification via the `run` skill happens later in Task 15).

---

# Task 6: The two provided components (DisplayCards, HandWrittenTitle)

Depends on Task 1 (brand tokens must exist in Tailwind config) and Task 5 (uses `cn` from `src/lib/utils.ts`, which Task 1 creates as part of the shadcn scaffold — if it's missing, create it: `export function cn(...inputs){ return twMerge(clsx(inputs)) }`).

## 7. The two provided components, adapted (put them in `src/components/ui/`)

### 7.1 `display-cards.tsx` (re-themed, used on Home 3b and the Programs hero)
Keep the original's stacked, skewed, grayscale-until-hover mechanic, but re-theme it to the palette, add entrance motion, and make it responsive and accessible:
```tsx
"use client";
import { cn } from "@/lib/utils";
import { Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  approved?: boolean;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-brand-ink" />,
  title = "Featured",
  description = "",
  date = "",
  titleClassName = "text-brand-leaf-deep",
  approved = true,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[18rem] sm:w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 border-brand-ink/10 bg-brand-paper/80 backdrop-blur-sm px-4 py-3 shadow-[0_20px_40px_-20px_rgba(28,42,32,.35)] transition-all duration-700",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[16rem] sm:after:w-[20rem] after:bg-gradient-to-l after:from-brand-cream after:to-transparent after:content-['']",
        "hover:border-brand-sun/60 hover:bg-brand-paper [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-brand-sun p-1">{icon}</span>
        <p className={cn("text-lg font-semibold", titleClassName)}>{title}</p>
        {approved && (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.6 }}
            className="relative z-10 ml-auto inline-flex items-center gap-1 rounded-full bg-brand-mint px-2 py-0.5 text-xs font-bold text-brand-leaf-deep"
          >
            <BadgeCheck className="size-3.5" /> Approved
          </motion.span>
        )}
      </div>
      <p className="whitespace-nowrap text-lg text-brand-ink">{description}</p>
      <p className="text-sm text-brand-ink-soft">{date}</p>
    </div>
  );
}

const STACK_BEFORE =
  "before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-brand-ink/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-brand-cream/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0";

export default function DisplayCards({ cards }: { cards: DisplayCardProps[] }) {
  const offsets = [
    `[grid-area:stack] hover:-translate-y-10 ${STACK_BEFORE}`,
    `[grid-area:stack] translate-x-8 sm:translate-x-12 translate-y-10 hover:-translate-y-1 ${STACK_BEFORE}`,
    "[grid-area:stack] translate-x-16 sm:translate-x-24 translate-y-20 hover:translate-y-10",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="grid [grid-template-areas:'stack'] place-items-center"
      role="list"
    >
      {cards.map((c, i) => (
        <div role="listitem" key={i} className="contents">
          <DisplayCard {...c} className={cn(offsets[i] ?? offsets[2], c.className)} />
        </div>
      ))}
    </motion.div>
  );
}
```
On touch devices, tapping a card brings it forward (toggle a state class), since hover doesn't exist there.


### 7.2 `hand-writing-text.tsx` (re-themed, triggers on scroll, used for Partners on Home and "No Request Too Big Or Too Small" on Programs)
```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
  as?: "h1" | "h2";
  strokeClassName?: string;
}

export function HandWrittenTitle({
  title = "Hand Written",
  subtitle,
  as = "h2",
  strokeClassName = "text-brand-tangerine",
}: HandWrittenTitleProps) {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  return (
    <div className="relative mx-auto w-full max-w-4xl py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="h-full w-full"
        >
          <motion.path
            d="M 950 90 C 1250 300, 1050 480, 600 520 C 250 520, 150 480, 150 300 C 150 120, 350 80, 600 80 C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className={`${strokeClassName} opacity-90`}
          />
        </motion.svg>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <Heading
          className="font-display text-4xl md:text-6xl tracking-tight text-brand-ink"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </Heading>
        {subtitle && (
          <motion.p
            className="mt-3 font-hand text-2xl md:text-3xl text-brand-ink-soft"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
```


Transcribe both components into `src/components/ui/display-cards.tsx` and `src/components/ui/hand-writing-text.tsx` exactly as given above — these are provided, working code, not a spec to reinterpret. The only required additions beyond copy-paste: (1) the touch-device tap-to-bring-forward behavior noted after the DisplayCards snippet (hover doesn't exist on touch — toggle a focused/active state class on tap), and (2) confirm every `brand-*` Tailwind class used (`brand-ink`, `brand-sun`, `brand-paper`, `brand-mint`, `brand-leaf-deep`, `brand-cream`, `brand-ink-soft`, `brand-tangerine`) resolves against the `tailwind.config.ts` written in Task 1 — if Task 1 nested the palette differently (e.g. under `colors.brand` vs a flat `colors` map), adjust either the config or these class names so they match, and note which you changed.

**Verify:** `npm run typecheck` and `npm run build` pass; mount both components briefly in `App.tsx` with placeholder props, screenshot with the `run` skill or a quick dev-server check, confirm the stack/skew/grayscale-to-color mechanic and the SVG hand-draw both visually work, then revert `App.tsx` to its Task-1 placeholder state (routing/pages come in later tasks).

---

# Task 7: App shell — routing, Navbar, MobileMenu, Footer, StickyDonateBar, page transitions, smooth scroll

Depends on Tasks 1, 3 (site.ts for nav/contact/address), 5 (motion primitives, useLockBody, useScrolled, useReducedMotion, donate.ts), 6 (not required here but fine if already merged).

## 5. Sitemap, routes and navigation (same six nav items, same order, same labels)

| Nav label (exact) | Route | Notes |
|---|---|---|
| Home | `/` | |
| About Us | `/about-us` | |
| Our Stories | `/our-stories` | |
| Programs | `/programs` | 301 from `/25726-2/` |
| Blog | `/blog` | 301 from `/blog-2/` and `/blog-2/page/*` |
| DONATE | external donation URL | Now styled as the primary `sun` pill button; opens in a new tab with `rel="noopener"` |

Also:
- `/:year/:month/:slug` renders a blog post. **Keep the exact original post URLs from the audit §5** so existing links and SEO survive.
- `/overview` → 301 to `/about-us`
- `*` → a custom 404 page (tug-of-war photo, a Caveat "Oops — this page wandered off", buttons to Home and Our Stories)
- Scroll to top on route change (Lenis `scrollTo(0, {immediate:true})`).
- Page transitions: AnimatePresence. The outgoing page fades to 0 and moves 8px up; a `sun`-colored panel with the small green "4" mark wipes up and away (0.6s total). Skip it with reduced motion.

---

## 6. Pages, section by section

General rule: every section below lists **(A) the original content, which must be kept verbatim** (after the §12 fixes) and **(B) the upgrade**. New sections are marked **NEW**. All NEW sections use only facts that appear in the audit. Do not invent numbers, names, programs or quotes.

### 6.0 Global Navbar (adapted from my "Palomar" hero spec, re-themed)
- `fixed top-0 left-0 right-0 z-50 transition-all duration-300`. When `window.scrollY > 20`: `bg-cream/85 backdrop-blur-md shadow-[0_1px_0_rgba(28,42,32,.08)]`. Otherwise transparent. Hide on scroll-down / reveal on scroll-up after 400px (translateY with a 300ms ease).
- Inner: `max-w-7xl mx-auto px-6 lg:px-8`. Bar: `relative flex items-center h-16 md:h-20`.
- **Left:** logo lockup image (`logo-lockup.png`), height 40px (md: 48px), linking to `/`. Entrance `animate-fade-down stagger-1`.
- **Right (md+):** the five text links, `text-[15px] font-semibold text-ink tracking-wide`, `gap-8`, each `animate-fade-down` staggered (stagger-2…stagger-6). Hover shows a hand-drawn tangerine underline drawing in from left (SVG path, pathLength). The active route shows a small `leaf` dot above the label plus the underline persisting.
- **DONATE** pill on the far right: `ml-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sun text-ink font-bold uppercase tracking-wide text-sm`, with a `Heart` icon that pulses gently every 4s. Magnetic hover. Clicking fires the confetti burst (§9) and opens the donation form in a new tab.
- **Mobile (< md):** hamburger `md:hidden ml-auto z-50 w-10 h-10 aria-label="Toggle menu" aria-expanded`. Two 2px bars (`w-6 h-[2px] bg-ink rounded`), `transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]`, top bar at `top-[6px]` (open: `rotate-45 translate-y-[5px]`), bottom bar at `top-[13px]` (open: `-rotate-45`). When open, lock body scroll.
- **Mobile overlay:** `fixed inset-0 bg-cream z-40`, `transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`, open `opacity-100 pointer-events-auto`, closed `opacity-0 pointer-events-none`. Inner column `flex flex-col items-center justify-center h-full gap-7` with the same ease and `delay-100` (open `translate-y-0 opacity-100`, closed `-translate-y-8 opacity-0`). Links are `font-display text-4xl text-ink`, each staggered by 60ms. A DONATE pill below (`mt-4 px-8 py-3.5 text-lg`). A Caveat line at the bottom: "One child at a time." Faint blob shapes in the background. Clicking any item closes the menu. Escape closes it too. Focus is trapped while open.

### 6.2 Global Footer (replaces the bare bottom bar)
On `bg-ink`, cream text, wavy top edge, large faint "4MK" watermark in Fraunces at 8% opacity.
- Col 1: logo lockup on a paper chip, the mission "To improve the lives of abused and neglected children by providing opportunities and services they otherwise might not receive.", and a "501(c)(3) nonprofit · Founded 2015" badge.
- Col 2: "Explore": the six nav links.
- Col 3: "Get in touch": mailing address (§0.6), both contact emails as mailto, and Facebook with icon.
- Col 4: "Make a difference": short line + DONATE pill.
- Bottom bar: `© 4Montgomery's Kids, {current year computed at runtime}` · "P.O. Box 34864, 10421 Motor City Drive, Bethesda, MD 20817" · "Back to top ↑" (smooth scroll).

**Sticky mobile donate bar (NEW):** on < md, after the user scrolls past the hero, a bottom bar slides up with "Help a child today" + DONATE pill. It hides while the mobile menu is open and when the footer is in view. Include safe-area inset padding.

Build:
- `src/components/layout/SmoothScroll.tsx`: Lenis wired to `gsap.ticker` exactly per build-prompt §8 point 1 (duration 1.1, the exact easing function given there), ScrollTrigger updates on Lenis scroll, entirely disabled under reduced motion. Wrap the app in it.
- `src/components/layout/PageTransition.tsx`: AnimatePresence wrapper implementing the exact wipe described in §5 (outgoing page fades to 0 / moves 8px up; a `sun`-colored panel with the small green "4" mark wipes up and away, 0.6s total; skipped entirely under reduced motion). Scroll-to-top on route change via Lenis `scrollTo(0, {immediate:true})`.
- `src/components/layout/Navbar.tsx` + `MobileMenu.tsx`: build exactly per §6.0 above, including the hide-on-scroll-down/reveal-on-scroll-up behavior after 400px, the hand-drawn tangerine underline hover (use `Scribble variant="underline"`), the active-route green dot, the DONATE pill wired to `openDonate`, and the full mobile overlay spec (hamburger animation, body-scroll lock via `useLockBody`, staggered link entrance, Escape-to-close, focus trap, Caveat tagline at the bottom).
- `src/components/layout/Footer.tsx`: build exactly per §6.2 above (4 columns, wavy top edge SVG, faint "4MK" watermark, runtime-computed `{new Date().getFullYear()}`, both mailto contacts, Facebook link, Back-to-top).
- `src/components/layout/StickyDonateBar.tsx`: per §6.2's sticky mobile donate bar spec — appears on <md after scrolling past the hero, hides while the mobile menu is open or the footer is in view (use an IntersectionObserver on the footer), safe-area inset padding.
- Wire `react-router-dom` v6 `BrowserRouter` in `App.tsx` with routes for `/`, `/about-us`, `/our-stories`, `/programs`, `/blog`, `/blog/:year/:month/:slug` (adjust the path pattern to match whatever exact URL shape Task 4's posts.ts uses — check that file), `/overview` → `<Navigate to="/about-us" replace />`, and `*` → `NotFound`. Every route component may still be a stub from Task 1 — later tasks fill them in. Skip-to-content link, `<header>`, `<nav aria-label="Main">`, `<main id="main">`, `<footer>` landmarks per §10.

**Verify:** `npm run build` passes; click through all 6 nav routes with the `run` skill at 390px/768px/1440px, confirm the mobile menu opens/closes/traps focus/locks scroll, confirm the navbar hides/reveals on scroll, confirm Donate fires confetti and opens the donation URL in a new tab, confirm reduced-motion (emulate via devtools) removes the page-transition wipe and Lenis smoothing without breaking navigation.

---

# Task 8: HOME page `/`

Depends on Tasks 1, 3, 5, 6, 7 (layout shell must exist so this page renders inside it).

### 6.1 HOME `/`
`<title>`: "4Montgomery's Kids | Helping Foster Children in Montgomery County, MD" (fixes the dangling "|")

**Section 1 — Hero (adapted from my Palomar spec: full-viewport video, left-aligned, editorial)**
(A) Keep this exact copy:
> 4Montgomery's Kids enriches the lives of abused and neglected children and youth in Montgomery County's child welfare system by providing them with opportunities and services they would not otherwise receive. One child at a time, we provide hope, help restore dignity and increase self-esteem.

Button: **HOW WE MAKE A DIFFERENCE** → `/our-stories`

(B) Build:
- `section.relative w-full h-screen min-h-[720px] overflow-hidden bg-cream`.
- Video layer `absolute inset-0` with `<video autoPlay muted loop playsInline preload="metadata" poster="/images/opt/kids-writing-desks-1600.webp">`, src = `HERO_VIDEO_HOME` = `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4`, `w-full h-full object-cover object-bottom`. Unlike the Palomar original, this site DOES need a legibility treatment: a left-to-right gradient `from-cream/95 via-cream/70 to-transparent` on md+, and a bottom-up `from-cream via-cream/80` on mobile. With reduced motion, or if the video errors, show the poster image only (`onError` → swap to `<Img>`). Add a small pause/play toggle in the bottom-right (a 44px round button, `aria-label`) for WCAG 2.2.2.
- Content column: `relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-32 md:pt-40 px-6 lg:px-8`.
- **Announcement pill** (`animate-fade-up stagger-3`): `inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/15 bg-paper/70 backdrop-blur-sm hover:bg-paper transition`, a green dot, text "Candid Platinum Transparency 2026", `ArrowRight` 14px. Links to `/about-us#transparency`.
- **H1** (the home page currently has none; use the site's own tagline wording): "One child at a time, we provide hope." in `font-display`, `text-left max-w-4xl leading-[1.0] tracking-[-0.03em]`, `animate-fade-up stagger-4`, with `<br className="hidden sm:block" />` after "time,". The word "hope" gets a tangerine hand-drawn circle that draws in 0.9s after load. Split the text into words that rise from a mask (overflow hidden) with a 40ms stagger.
- **Paragraph**: the full (A) copy above, `text-lg md:text-xl text-ink-soft max-w-2xl mt-6`, `animate-fade-up stagger-5`.
- **CTA row** (`stagger-6`): primary `sun` pill **HOW WE MAKE A DIFFERENCE** → `/our-stories`, plus a text-link "DONATE" with a Caveat curly arrow scribble pointing at it (this one is new; keep it subtle).
- **"Backed by" row, re-themed:** eyebrow label "Thank You to Our Community Partners" (`text-xs tracking-[0.25em] uppercase text-ink/50`), then a row of partner names rendered as **text wordmarks in mixed display fonts** (the Palomar trick), `text-lg md:text-xl lg:text-2xl text-ink/75 whitespace-nowrap`, `gap-6 md:gap-12`, each linked to the partner site:
  - "100 Who Care Alliance" in Fraunces italic 700
  - "THE PHASE FOUNDATION" in Oswald 500 uppercase
  - "St. Anne's Damascus" in Playfair Display 700
  - "Women Who Care" in Montserrat 700
  - "Nora Roberts Foundation" in Roboto Slab 600
  - "Healthcare Initiative Foundation" in Raleway 700

  (Load Oswald, Playfair Display, Montserrat, Roboto Slab and Raleway with only these weights. Use `text=` subsetting in the Google Fonts URL to keep it tiny.) On mobile this row becomes an auto-scrolling marquee.
- Scroll cue at the bottom center: a Caveat "scroll" with a bouncing hand-drawn arrow. Hide it after the first scroll.
- On scroll, the hero content parallaxes up at 0.3× and fades. The video scales 1→1.08 (GSAP scrub).


**Section 2 — About strip**
(A) H2 "About 4Montgomery's Kids" + button **About** → `/about-us`

(B) Build a split layout on `cream`: on the left the H2 (with a leaf-green underline scribble under "4Montgomery's Kids"), the About button, and a pull line (existing site copy) "A need to some is only a dream when it's out of reach." in Fraunces italic. On the right, a **polaroid collage**: `tug-of-war.jpg` and `double-dutch.jpg` as two tilted polaroids that fan apart on scroll into view, with Caveat captions "pulling together" and "big dreams, small dreams". Behind them sits a morphing `mint` blob.

**NEW Section 2b — "What your money supports" marquee**
Two opposing infinite marquees (pause on hover, `aria-hidden` duplicates, and a visually-hidden real list for screen readers) of pill chips with icons, taken verbatim from the Programs list: Summer camp fees · Computers and schoolbooks · Transportation to college classes, jobs, and medical appointments · Recreational activities such as soccer and baseball · After school programs in dance, art, and music · College and technical school scholarships · Specialized classes in areas such as nursing, home care and cosmetology · Costs for parental visits with their children in foster care · Security deposits, rents, and furniture for those aging out of foster care. Chip colors rotate butter/mint/sky. Row 1 slants -2°, row 2 slants +2°.

**Section 3 — "Some of Our Stories" (slider, 5 slides)**
(A) H2 "Some of Our Stories" + divider. 5 slides with the exact titles and body copy from audit §6 Section 3, BUT with the §12 fix to slide 3. Button **Read More Stories** → `/our-stories`.

Slides and images:
1. **Summer Camp**: `IllustratedCover` (Tent icon), no button
2. **Graduating in Style**: `graduate.jpg`, button **Donate** → donation URL (fixed; it currently points to the old Network for Good URL)
3. **Staying Connected to High School** (the title is fixed: this body text is the tablet story, and that is its title on Our Stories): `IllustratedCover` (Tablet icon), button **Donate** → donation URL (fixed; currently `#`)
4. **Providing a Critical Outlet**: `bike-ride.jpg`
5. **The Young Champion**: `peewee-football.jpg`

(B) Build a **pinned, scroll-driven story stage** on desktop (GSAP ScrollTrigger, pin for ~400vh). The left half is a huge image with a slow Ken Burns zoom and a clip-path wipe between slides. The right half holds the slide number in giant outlined Fraunces ("01"/"05"), the title, the body and the button. A vertical progress rail with 5 dots is clickable, and clicking scrolls to that slide. On mobile/tablet it becomes a swipeable card carousel (framer-motion drag, snap, dots, prev/next buttons, keyboard arrows). With reduced motion: no pin, just a stacked list. Each slide carries a Caveat tag ("summer camp", "graduation", "school", "wellbeing", "sports").

**NEW Section 3b — "How a request becomes a yes" (uses my DisplayCards feature)**
Facts (from the audit's key messages and posts): social workers identify a child's need and submit the request; 4MK says "yes" to virtually every request; most requests are turned around in less than 24 hours; no request too big or too small.
Layout: on the left a 3-step vertical timeline with animated connector line drawing on scroll:
1. "A social worker spots a need": "We work directly with county social workers to fill the needs they have identified for children in their care."
2. "The request comes to us": "Montgomery County social workers, who know the needs of each child and young person in their caseload."
3. "We say yes!": "Most of the time, we turn around requests in less than 24 hours."
On the right, the **DisplayCards** stack (§7.1) showing three request cards:
- icon `Tent` · title "Summer camp" · description "Eleven kids sent to camp" · date "Fall 2025"
- icon `Laptop` · title "Computers" · description "Four computers for schoolwork" · date "Fall 2025"
- icon `Bus` · title "Emergency ride" · description "Uber card on its way within an hour" · date "Oct 2025"
(All three facts come from the "Fall" for Kids post.) Each card shows an "Approved ✓" leaf badge that stamps in with a spring when the card enters view.

**Section 4 — Impact (dark)**
(A) Keep verbatim: H2 "We've made a difference in the lives of over 2,800 kids!"; divider; text "A need to some is only a dream when it's out of reach. 4Montgomery's Kids helps children in the foster care system in Montgomery County, Maryland achieve their dreams, both big and small."; outline button **ABOUT US** → `/about-us`; image `double-dutch.jpg`; "Follow us on Facebook"; button **DONATE**.

(B) Build on `bg-ink` with cream text and a wavy top edge. In the H2, "2,800" is an animated counter (0→2,800, 2.2s, easeOutExpo, starts when in view) in `sun`, with a hand-drawn star beside it. The image goes big with a clip-path reveal (inset 20% → 0) and parallax (-10% → 10%), its corners rounded, and a floating polaroid badge with Caveat "a leap of joy". "Follow us on Facebook" becomes a real, obvious link with the `Facebook` icon and hover underline. It also gets three stat tiles (`dataviz` skill) that count up: "10+ years serving children and youth" (founded 2015), "2,852 fulfilled requests", and "100% of your donations go directly to the kids". The last is backed by the audit: admin costs are absorbed by the board. A small `?` tooltip on that tile says "All administrative costs are covered by our volunteer board."

**NEW Section 4b — "Where the money goes" (data viz)**
From the "Spring Forward" post (fiscal year figures): Education 20%, Transportation 11%, Recreational activities 15%, Housing 1%, Personal & household needs 53%. Build an animated SVG **donut** that draws its segments on view, with an interactive legend (hovering or focusing a legend item highlights its segment and shows the label). Use palette colors with a validated contrast ratio (follow the `dataviz` skill). A caption in Caveat quotes the post: "we were able to fill every request we received – no child or family was denied the assistance they sought." Also include a visually-hidden data table for screen readers.

**Section 5 — Testimonials + Partners (light)**
(A) H2 "What Others Are Saying About Us" + divider, then all 6 testimonials verbatim with their exact attributions (audit §6 Section 5). H2 "Thank You to Our Community Partners" + divider, then the partner logos linked as in the audit (100WCA → 100whocarealliance.org; St Anne's → saintannesdamascus.net; Women Who Care → lowermocowwc.com; Nora Roberts → norarobertsfoundation.org; HIF → hifmc.org; "The Phase Foundation" as text only, since there is no logo and no link).

(B) Testimonials become a **masonry wall** of paper cards on `mint` with big tangerine opening-quote glyphs. Attribution is in Caveat 24px. Cards drift at different parallax speeds (GSAP, ±30px) and tilt on hover. The first card is a featured large card. On mobile it's a horizontal snap carousel.
Partners: the H2 uses the **HandWrittenTitle** component (§7.2), with a tangerine hand-drawn ellipse around "Thank You". Logos sit on paper tiles in a responsive grid (2 cols mobile, 3 tablet, 6 desktop), grayscale at 70% opacity by default, full color with a lift on hover. "The Phase Foundation" gets a typographic tile in Oswald so it matches visually. Remove the old empty rows/columns.

**NEW Section 6 — Donate band: "Your gift in action"**
On a `sun` background with a wavy top edge and floating sparkles. The H2 is existing copy: "Make a difference in the life of a child in foster care in Montgomery County." Add an **interactive gift slider**: segmented preset buttons $50 · $100 · $150 · $200 · $500 · $1,000 (the donation form's own presets plus the "How you can help" amounts). As the selection changes, an animated card below swaps (AnimatePresence) to show what that level has funded, using ONLY audit facts:
- $100: "helps provide transportation for a child going to summer camp"
- $150: "helps provide tutoring for youth who has not done well in school this semester" / "helps provide community pool membership"
- $200: "helps provide books and new clothes for children at the beginning of the school year"
- $500 / $1,000: "Scholarships, ranging from $500 – $1,000, to high school graduates in foster care who are pursuing further education"
- $50: show a gentle generic line built from the audit's own wording: "a simple gift card for a birthday that would otherwise be forgotten"

Then a big **DONATE** pill (ink bg, cream text) → donation URL (confetti), plus a Caveat line "100% of your donations go directly to helping the kids". Add a small note: "You'll be taken to our secure donation form."

Build every section (1 through 6, plus 2b, 3b, 4b as NEW sections) exactly as specified, in `src/routes/Home.tsx` composed from section components in `src/components/sections/` named `Home*.tsx` (e.g. `HomeHero.tsx`, `HomeAboutStrip.tsx`, `HomeSupportsMarquee.tsx`, `HomeStoriesSlider.tsx`, `HomeRequestFlow.tsx`, `HomeImpact.tsx`, `HomeAllocationDonut.tsx`, `HomeTestimonials.tsx`, `HomeDonateBand.tsx`). Use `src/data/stories.ts`, `testimonials.ts`, `partners.ts`, `allocation.ts`, `site.ts` from Task 3 — do not re-type copy that already lives in those files; import it. Use `DisplayCards`/`HandWrittenTitle` from Task 6 exactly where named (3b, and note Programs reuses HandWrittenTitle too — that's Task 11). Use the `Img`, `IllustratedCover`, `Counter`, `Marquee`, `Parallax`, `Scribble`, `Reveal`, `MagneticButton`, `TiltCard` primitives from Task 5. Add `<Seo>` with the exact `<title>` given (fixing the dangling "|"), a meta description ≤155 chars written from this page's own copy, and `NGO`/`Nonprofit501c3` JSON-LD per §11 (name, url, logo, the P.O. Box address, `sameAs` Facebook, email).

The pinned scroll-driven story stage (Section 3) and the donut (4b) are the two highest-risk pieces of GSAP/SVG work on this page — build them carefully per spec, and provide a working non-pinned/non-animated fallback under reduced motion (a stacked list for the story stage, a static legend+percentages table for the donut, both still using real data).

**Verify:** `npm run build` passes; `run` skill click-through at 390/768/1440 confirms hero video autoplays+loops+has a working pause toggle, the announcement pill links to `/about-us#transparency`, the partner wordmark row becomes a marquee on mobile, the story stage pins and scrubs on desktop and becomes a swipeable carousel on mobile/reduced-motion, the impact counter animates 0→2,800 once in view, the donut segments draw in and the legend is keyboard-operable, the gift-slider swaps its funded-item card per preset, and every Donate/DONATE control fires confetti + opens the donation URL in a new tab.

---

# Task 9: ABOUT US page `/about-us`

Depends on Tasks 1, 3, 5, 6, 7.

### 6.3 ABOUT US `/about-us`
`<title>`: "About Us | 4Montgomery's Kids"

**Section 1 — Hero** (A) H1 "About Us"; text "4Montgomery's Kids is a 501(c)3 nonprofit working to create a brighter future for abused and neglected children and young adults in Montgomery County, MD." and "For Questions or Comments, please contact President: Leslie Shedlin lkshedlin@4montgomeryskids.org or Board Chair: Agnes Leshner aleshner@4montgomeryskids.org" (both mailto, spacing fixed); button **View Our Stories** → `/our-stories` (fixed; it currently goes to `/`). Three blurbs: **Our Mission**, **Meeting Ongoing Needs**, **Serving the local community**, with exact text from audit §7.
(B) The hero bg is `double-dutch.jpg` with a slow scale and a strong ink→transparent gradient. H1 gets split-letter rise animation. The three blurbs become frosted glass cards (`bg-paper/10 backdrop-blur-md border-cream/15`) stacked on the right, each with an animated lucide icon (Target, Repeat/InfinityIcon, MapPin) and staggered entrance.

**Section 2 — About copy** (A) H2 "About 4 Montgomery's Kids" + both paragraphs pairs + Mailing Address block, verbatim from audit §7 Section 2 (use the Motor City Drive address).
(B) Editorial two-column layout with a drop cap on the first paragraph. The sentence "On any given day, more than 400 children live in foster care." becomes a huge pull-stat ("400+" counter) in the margin. The mailing address sits on a postcard-style card with a stamp graphic (the green "4").

**NEW Section 2b — Our journey timeline** (only audit facts): horizontal scroll-driven timeline on desktop (GSAP pin + horizontal translate), vertical on mobile. The line draws as you scroll, and each milestone pops in with a spring.
- 2015: "4Montgomery's Kids began this incredible journey" / first year: "we could only afford to help 36 children"
- 2017: "we expanded to giving partial scholarships to those going on to college or trade school"
- 2018: "Spring is here and with it comes our new name, 4Montgomery's Kids" (formerly Montgomery's Kids)
- 2019: "More than 550 in less than five years!"
- 2020–21: "we kept at it when the nation was hit by a pandemic" (laptops, books, school supplies)
- Year ten: "that number soared to an astonishing 364!" · "more than 2,000 children and youth" over ten years · "48 scholarships"
- 2024–25: Boost, the Pilot Guaranteed Income Program: "$600 a month for one year"
- 2025: "a record-breaking year" · "over 2,800 kids" helped

**NEW Section 2c — Transparency (`id="transparency"`)**: the Candid Platinum Transparency 2026 seal (crop the right portion of `logo-lockup.png` with CSS `object-position`, or render the lockup), and "100% of your donations go directly to helping those children, teens, and young adults who are the most vulnerable among us." plus "all administrative costs of 4Montgomery's Kids are absorbed by our board members." (both verbatim from posts). Include a sub-link "View our Candid profile" → `https://www.guidestar.org/search?q=4Montgomery%27s%20Kids` (a search link, so it can't 404).

**Section 3 — Board of Directors** (A) H2 "Board of Directors" + divider, then 5 members with exact bios (audit §7 Section 3, with the "wefare"→"welfare" fix). Titles: Leslie Shedlin, President · Agnes Leshner, Board Chair · Ronna Cook, Treasurer · Alan Kraut, Board Member · Cynde R. Burgess, Board Member.
(B) Cards with portrait photos in organic blob masks (SVG clipPath). On hover the portrait scales and the blob morphs. Name in Fraunces, title in a `leaf` pill. The bio is clamped to 4 lines with a "Read more" that expands smoothly (framer layout animation). Layout: 3 + 2 centered (no empty column). The first 3 stagger in, then the other 2.

**Section 4 — Quote** (A) "I am writing this letter to display my utmost gratitude for everything your organization has done for me and my brother. I was able to take a shot like any ordinary kid. . . You have given me hope that I am not forgotten." — L, Foster youth (opening quote mark fixed).
(B) Full-width `butter` band. The quote is set huge in Fraunces italic and revealed word by word as you scroll (opacity 0.15→1, scrubbed). "I am not forgotten" gets the tangerine underline scribble. Attribution in Caveat.

**NEW Section 5 — Get involved / contact**: three cards: "Donate" (→ form), "Spread the word" (verbatim from the 2018 post: "Please, spread the word about our work and encourage others to support us"; Facebook link), "Contact us" (both emails as mailto buttons). End with the Donate band component reused from Home.


Build in `src/routes/About.tsx` + `src/components/sections/About*.tsx`. Section 2c needs `id="transparency"` (the Home hero pill links here). Section 2b's horizontal-on-desktop/vertical-on-mobile timeline uses `src/data/timeline.ts` from Task 3. Section 3 (Board) uses `src/data/board.ts` and the organic-blob SVG clipPath portrait masks described. Section 4's quote gets the word-by-word scroll reveal. Section 5 reuses the Home donate-band component (import it, don't duplicate).

**Verify:** `npm run build` passes; `run` skill confirms the mailto links have correct addresses/spacing (§12 fix), "View Our Stories" goes to `/our-stories` (not `/`), the board bios clamp-then-expand without layout jank, the transparency anchor `#transparency` scrolls correctly from the Home page's announcement pill, and the timeline is horizontally pinned on desktop / vertical on mobile / a plain stacked list under reduced motion.

---

# Task 10: OUR STORIES page `/our-stories`

Depends on Tasks 1, 3, 4 (posts for section citations if any — mainly just Task 3's stories.ts), 5, 6, 7.

### 6.4 OUR STORIES `/our-stories`
`<title>`: "Our Stories | 4Montgomery's Kids"

**Section 1 — Hero (adapted from my second hero spec: JS-faded video + "input box")**
- Full-screen video bg, src `HERO_VIDEO_STORIES` = `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4`, sized **115% width and height**, centered horizontally, anchored to the top (`object-top`). Poster: `graduate.jpg`. A cream wash overlay at 55% keeps the text legible.
- **Custom JS fade system (`useVideoFade` hook, NO CSS transitions on the video):**
  - 250ms `requestAnimationFrame` fade-in on load and at each loop start
  - 250ms fade-out when 0.55s remain before the video ends (from `timeupdate`)
  - a `fadingOutRef` boolean prevents re-triggering the fade-out from repeated `timeupdate` events
  - on `ended`: set opacity 0, wait 100ms, set `currentTime = 0`, `play()`, fade back in, and reset `fadingOutRef`
  - each new fade cancels any running animation frame (store the rAF id in a ref) so fades never compete
  - fades resume from the current opacity (read it from the element; no snapping)
  - do NOT use the `loop` attribute (the hook handles looping). With reduced motion: no video, poster only.
- Content is centered and pulled up with `-mt-[50px]`, with 34px gaps inside the header group and 44px between header and the box:
  - **Badge**: dark pill (`bg-ink`) with a `Star` icon + "New", attached to a light pill "Real stories from real kids". Inter-style small text 14px (use Plus Jakarta here), rounded-full, subtle shadow.
  - **H1** "Our Stories" (the page previously only had an H3) in Fraunces 800 at `clamp(3rem, 8vw, 5rem)`, tracking -0.06em, leading-none, ink, centered. Add a hand-drawn tangerine underline.
  - **Subtitle** (existing copy): "These are just a few stories of how, with support from our donors, 4 Montgomery's Kids has been able to help kids in need." Plus Jakarta 500, 20px, `ink-soft`, max-w-[736px].
  - **Story finder box** (this is the adaptation of the "search input box"): `max-w-[728px] w-full rounded-[18px] p-3 backdrop-blur-xl bg-ink/25` (the example's rgba(0,0,0,0.24), re-toned to ink):
    - Top row (12px, cream, semibold): left "11 stories · 2,852 requests fulfilled" + a small `sun` pill button "Donate" (the equivalent of the "Upgrade" button; opens the donation form). Right: `Sparkles` icon + "Powered by social workers".
    - Main input: white/paper bg, rounded-12px, shadow, a real `<input type="search">` with label (visually hidden) "Search stories", placeholder "Search stories… try "camp", "apartment", "school"", and a 36px round ink submit button with an `ArrowUp` icon. Typing **filters the story grid live** (title + body, case-insensitive, debounced 120ms) and smooth-scrolls to results on Enter/submit.
    - Bottom row: three filter chips (gray/paper bg, rounded 6px) with icons: `GraduationCap` "Education", `Home` "Independence", `HeartPulse` "Wellbeing" (the equivalents of Attach/Voice/Prompts). They toggle category filters. On the right, a live counter "{n}/11 stories" (the equivalent of "0/3,000").

**Section 2 — Story grid**
(A) All 11 story cards with exact titles and text from audit §8, plus the CTA card: "These are just a few stories of how, with support from our donors, 4 Montgomery's Kids has been able to help kids in need." / "Make a difference in the life of a child in foster care in Montgomery County." / **Donate** → donation URL.
Images: 1 Equipping for a Toddler's Future → `toddler-blocks.jpg` · 2 Fulfilling a Young Girl's Dream to Drive → `young-woman-driving.jpg` · 3 Helping a Young Man Move from Foster Care → IllustratedCover(Laptop) · 4 Giving a Gift of Independence → IllustratedCover(ShieldCheck) · 5 Encouraging Higher Education → IllustratedCover(GraduationCap) · 6 Staying Connected to High School → IllustratedCover(Tablet) · 7 A First Apartment → IllustratedCover(KeyRound) · 8 Providing a Critical Outlet → `bike-ride.jpg` · 9 Repairing a Family → IllustratedCover(Car) · 10 Graduating in Style → `graduate.jpg` · 11 Supporting Success → IllustratedCover(Scissors) · 12 CTA → `tug-of-war.jpg` with sun overlay.
Categories for the filters: Education (1, 5, 6, 10), Independence (3, 7, 11, 2), Wellbeing (4, 8, 9).
(B) A **bento-style masonry grid** (CSS grid with varied row spans: photo stories span 2 rows). Cards animate in with stagger and use framer `layout` for smooth re-flow when filtering (AnimatePresence for exit). Each card shows a Caveat category tag, the title, the first 3 lines of text and a "Read the story →" link. Clicking opens a **shadcn Dialog** with a large image, full story text, and Donate + "Next story →" buttons (keyboard accessible, focus returns to the card on close). Empty state when the filter matches nothing: Caveat "No stories match that — try another word" with a reset button.

**NEW Section 3 — Voices strip**: reuse 3 testimonials from Home (the Foster Mom, the Aging Out youth, the Social Worker phone story) as a horizontal auto-advancing quote carousel on `mint`.

**Section 4 — Donate band** (reuse the Home component).

Build in `src/routes/Stories.tsx` + `src/components/sections/Stories*.tsx`, using `src/hooks/useVideoFade.ts` from Task 5 for the hero video (do not add CSS transitions to the video element — the hook is the entire fade mechanism, per its exact spec in §6.4). The story finder box's live search (debounced 120ms, filters title+body case-insensitively) and the 3 category filter chips both drive the same filtered list feeding the bento grid in Section 2 — implement the filter state once, shared. Section 2's shadcn `Dialog` must trap focus, return focus to the triggering card on close, and support "Next story →" without closing/reopening (swap content in place).

**Verify:** `npm run build` passes; `run` skill confirms the video fade loop never CSS-flickers (no transition on the video element itself), the pause/poster fallback under reduced motion, live search actually filters the grid and updates the "{n}/11 stories" counter, filter chips toggle categories, the empty state appears and its reset button works, the dialog opens/closes accessibly with keyboard, and Next/Prev cycle through stories without losing focus management.

---

# Task 11: PROGRAMS page `/programs`

Depends on Tasks 1, 3, 5, 6, 7.

### 6.5 PROGRAMS `/programs`
`<title>`: "Programs | 4Montgomery's Kids"

**Section 1 — Hero** (A) H1 "What your money supports"; the 10-item bullet list verbatim (audit §9, including "…and much more!"); button **About 4Montgomery's Kids** → `/about-us`.
(B) `dance-recital.jpg` as the background with slow parallax and an ink gradient from the left. The H1 uses split-word rise. The list items animate in one by one (60ms stagger) with a hand-drawn `leaf` checkmark drawing itself before each item. The right third shows the DisplayCards stack (§7.1) with the three named programs: `Wallet` "Boost" / "$600 a month for one year" / "Guaranteed income" · `GraduationCap` "Scholarships" / "$500 – $1,000 awards" / "Every spring" · `Drumstick` (or `UtensilsCrossed`) "Project Turkey" / "Thanksgiving for families" / "Every November".

**Section 2 — "No Request Too Big Or Too Small"** (A) H2 + divider, all three paragraphs verbatim (with the `"yes!" to` spacing fix), button **Learn More** → `/our-stories`, counters **10** "YEARS SERVING CHILDREN AND YOUTH" and **2852** "FULFILLED REQUESTS".
(B) The H2 is rendered with **HandWrittenTitle** (§7.2): the tangerine ellipse draws around the headline on view, with the subtitle "Our services range from a birthday gift card to a first month's rent." built only from words in the paragraph. Left third: `tug-of-war.jpg` in a tall rounded frame (replacing the unavailable `left-side-hug.jpg`), parallaxing. Counters: big Fraunces numbers counting up, "10+" (the org passed 10 years in 2025; show "10+"), and "2,852". The sentence "says "yes!" to virtually all requests" gets the `sun` highlighter-swipe effect (background-size animating 0→100% on view).

**NEW Section 3 — Our programs (bento grid)**. Six tiles, all facts from the blog posts (cite the post in small text at the bottom of each tile and link to it):
1. **Boost: guaranteed income** (large tile, `butter`): "$600 per month for one year to youth who have aged out of foster care." "one of only three we could find anywhere devoted exclusively to those aging out of foster care." A recipient quote: "I feel fantastic! I am now employed full time and am very grateful for the opportunity to receive the monthly stipend." Mentorship partner: Empowering the Ages. → post "How scary must it be…"
2. **Scholarships & 4MK Excellence Awards** (`graduate.jpg`): "$500 – $1,000" to high school graduates in foster care pursuing college or a trade; "15 scholarships" this year; "48 scholarships" since 2017. → "Spring Forward…"
3. **Project Turkey** (`mint`): with Ingleside residents in Rockville, Giant gift cards for Thanksgiving; "helped 60 families and more than 100 children and youth this year!" → "You Made It Happen…"
4. **Summer camp & activities** (IllustratedCover Tent): "twelve children to summer programs", including "traditional sleep-away camp, special-needs camps, sports-themed programs and dance camp." → "Spring Forward…"
5. **Emergency transportation** (`teen-driver-smiling.jpg`): "Within an hour, we had an Uber card on its way." plus car insurance, Uber cards and Metro passes. → "Fall" for Kids
6. **Milestones & birthdays** (`sky`): prom and graduation outfits, quinceañera dresses, birthday parties: "No one deserves to be forgotten." → "We are Thankful for You"

Tiles use hover tilt, image zoom and an arrow that slides. They enter with a staggered scale/fade.

**NEW Section 4 — Where the money goes** (reuse the donut from Home 4b).

**Section 5 — Donate band** (reuse).

Build in `src/routes/Programs.tsx` + `src/components/sections/Programs*.tsx`. Section 1's DisplayCards stack and Section 2's HandWrittenTitle both reuse the Task 6 components. Section 3's bento grid tiles each cite their source post in small text and link to it — link to `/blog/:year/:month/:slug` using the exact slug from `src/data/posts.ts` (Task 4); if Task 4 hasn't landed yet when you start, use the post title as a temporary anchor and flag it as DONE_WITH_CONCERNS so the controller can wire the real link once Task 4 is in. Section 4 reuses the Home allocation donut component.

**Verify:** `npm run build` passes; `run` skill confirms the checkmarks draw in sequence, the DisplayCards stack responds to hover/tap, the HandWrittenTitle ellipse draws around the headline on scroll, the highlighter-swipe animates across "says 'yes!' to virtually all requests", the 10+/2,852 counters animate once, and each bento tile's citation link resolves to a real post route.

---

# Task 12: BLOG index page `/blog`

Depends on Tasks 1, 4 (needs all 21 posts), 5, 6, 7.

### 6.6 BLOG `/blog`
`<title>`: "Blog | 4Montgomery's Kids"
(A) Hero H1 "Blog" + "News from 4Montgomery's Kids". Grid of all 21 posts (titles, excerpts, links).
(B)
- Hero: `kids-writing-desks.jpg` with an ink gradient, H1 with a scribble underline, and the subtitle in Caveat.
- **Featured post**: the newest post ("You Made It Happen: 2,500 Kids Supported and Counting") shown as a wide hero card with its cover and a "Latest" badge.
- **Grid**, sorted **chronologically newest-first** (fixes the current random order), and showing **date + category + reading time** (computed at 200 wpm). Cover = the post's real featured image when it exists in our image set, otherwise `IllustratedCover` (never the favicon).
- Category filter tabs: All · News · Success Stories · Donor Spotlight · What your money supports. Assign the 2021+ "Uncategorized" posts sensible categories from that list (e.g. "You Made It Happen" → What your money supports; "How scary…" → News; "10 Years…" → News; "Spring Forward" → Success Stories; "We are Thankful for You" → Success Stories; "Fall for Kids" → What your money supports; "Spring Arrives" → Success Stories; "Ammerman" → Donor Spotlight).
- Year jump-list (2025, 2022, 2021, 2020, 2019, 2018, 2017) as a sticky side rail on desktop.
- Client-side pagination at 9 per page, with a "Load more" button that animates new cards in.
- The byline shows "4Montgomery's Kids" instead of the username "kd44montkids"; keep "Alan Kraut" for his posts.

Build in `src/routes/Blog.tsx` + `src/components/sections/Blog*.tsx`, reading from `src/data/posts.ts` (Task 4). Sort newest-first by `date`. Reading time = word count / 200wpm, computed from the post's `body` blocks (concatenate all `p`/`h3`/`ul`-item text). Category tabs filter client-side. Year jump-list is a sticky rail on desktop, derived from the distinct years present in the data (not hardcoded — but the build prompt's example years 2025/2022/2021/2020/2019/2018/2017 should all appear if Task 4 covered the full audit). Pagination: 9 per page, "Load more" appends with an entrance animation rather than replacing the grid.

**Verify:** `npm run build` passes; `run` skill confirms the grid is chronological newest-first, the featured post card shows the newest post, category tabs filter correctly, the year rail scrolls to the right group, "Load more" adds 9 more each click without losing scroll position, and no card ever shows the favicon as a cover (covers are either a real photo or `IllustratedCover`).

---

# Task 13: BLOG POST page `/blog/:year/:month/:slug` and 404

Depends on Tasks 1, 4, 5, 6, 7.

### 6.7 BLOG POST `/:year/:month/:slug`
- The data lives in `src/data/posts.ts`: `{ slug, year, month, date (ISO), title, author, categories[], cover?, iconForCover, excerpt, body }`. Author the `body` as an array of typed blocks (`p`, `h3`, `ul`, `quote`, `video`, `image`, `footnote`) transcribed **in full from audit §11** with bold/italic preserved (inline markup via a tiny renderer; no `dangerouslySetInnerHTML`). Apply the §12 typo fixes.
- Layout: reading-progress bar (a thin `sun` line at the top of the viewport), a hero with title (Fraunces), meta (author · date · categories · reading time), and the cover. The prose column is max 68ch with nice typographic rhythm, pull-quotes styled with a big tangerine quote mark, and lists with leaf checkmarks.
- YouTube embeds in "Moving to Independence" (`SdGjQlQfNbU`, `kGPDdpDPDSw`): use a **lite-embed facade** (thumbnail from `https://i.ytimg.com/vi/{id}/hqdefault.jpg` + play button) that swaps to a `youtube-nocookie.com` iframe on click.
- Inline images that were hot-linked from Gmail proxies in 2018–2019 posts are dropped (they're fragile). Replace the "[image]" slots with a styled pull-quote or omit them. The "Over 550" post's funding graph image isn't available, so render its bullet list nicely instead.
- The end of every post has an inline **Donate CTA card** (every appeal post ends with "please donate", and the current site has no button). Then prev/next post navigation (chronological) and 3 related posts (same category first).
- `Article` JSON-LD per post.

### 6.8 404
As described in §5.

Build `src/routes/Post.tsx`: look up the post by `year`/`month`/`slug` route params against `src/data/posts.ts`; if not found, render the same `NotFound` component used for `*`. Render the typed `PostBlock[]` array with a tiny inline-markup renderer for `**bold**`/`*italic*` inside `p`/`quote`/`ul` text (a small regex-based function is fine — no `dangerouslySetInnerHTML`, no markdown library needed for this narrow a grammar). `video` blocks render the lite-YouTube facade (thumbnail from `https://i.ytimg.com/vi/{id}/hqdefault.jpg` + play button, swaps to a `youtube-nocookie.com` iframe on click). Reading-progress bar, meta row, cover, max-68ch prose column, pull-quote styling, leaf-checkmark lists, end-of-post Donate CTA card, prev/next (chronological), 3 related posts (same category first, then newest others). `Article`+`BreadcrumbList` JSON-LD via `Seo`.

Build `src/routes/NotFound.tsx` per §6.8/§5: `tug-of-war.jpg` background, Caveat "Oops — this page wandered off", buttons to Home and Our Stories.

**Verify:** `npm run build` passes; `run` skill opens at least 3 different real post URLs (including one with a YouTube embed and one with a dropped Gmail-proxy image) and confirms the reading-progress bar, inline bold/italic rendering, YouTube facade→iframe swap, prev/next navigation, and related-posts all work; visiting a nonsense URL renders the 404 page, not a blank screen or router error.

---

# Task 14: SEO/deploy files, sitemap generation, README

Depends on Tasks 1, 4 (posts list, for the sitemap), 7 (routes list).

## 11. SEO and deploy files
- Per-route `<Seo>` via react-helmet-async: title, meta description (write them from existing copy, ≤155 chars), canonical `https://4montgomeryskids.org{path}`, OG title/description/image (`/og/og-default.jpg`, which you generate at build from `kids-writing-desks.jpg` + logo using sharp in `scripts/optimize-images.mjs`), and `twitter:card=summary_large_image`.
- JSON-LD on Home: `NGO` / `NonprofitType: Nonprofit501c3` with name, url, logo, address (P.O. Box 34864, Bethesda, MD 20817), `sameAs` Facebook, email. Posts get `Article` + `BreadcrumbList`.
- `public/robots.txt` pointing to `/sitemap.xml`. Generate `public/sitemap.xml` at build from routes + posts (small node script, run in `prebuild`).
- `public/_redirects`:
  ```
  /25726-2/   /programs   301
  /25726-2    /programs   301
  /blog-2/*   /blog       301
  /blog-2     /blog       301
  /overview/  /about-us   301
  /overview   /about-us   301
  /about-us/  /about-us   301
  /our-stories/ /our-stories 301
  /*          /index.html 200
  ```
- `vercel.json` with the same redirects + SPA rewrite.
- `index.html`: lang="en", theme-color `#FFF8EC`, favicon, font preconnects, and a `<noscript>` fallback message with the donate link and address.
- README.md: how to run, build, deploy to Cloudflare Pages (build `npm run build`, output `dist`), where to swap the hero videos (`src/data/site.ts`), how to add a blog post (`src/data/posts.ts`), and a list of the content decisions in §12 for the client to confirm.

Write `scripts/generate-sitemap.mjs` (small node script, no new deps needed beyond what's installed — plain string templating is fine) that emits `public/sitemap.xml` from the static route list plus every post's real URL from `src/data/posts.ts`. Wire it into the `prebuild" npm script alongside `optimize-images.mjs` from Task 2 (both must run; order doesn't matter between them). Write `public/robots.txt` pointing to `/sitemap.xml`. Write `public/_redirects` and `vercel.json` exactly per the rules given above. Update `index.html`: `lang="en"`, `theme-color #FFF8EC`, favicon link, font preconnects (should already be partly in place from Task 1 — reconcile, don't duplicate), and a `<noscript>` fallback with the donate link and mailing address.

Write `README.md` covering: how to run (`npm install && npm run dev`), how to build (`npm run build`, output `dist`), how to deploy to Cloudflare Pages, where to swap the two hero videos (`src/data/site.ts`), how to add a blog post (`src/data/posts.ts`), and — verbatim from build-prompt §12 — the list of content decisions the client (Leslie Shedlin / Agnes Leshner) should confirm: the numeric inconsistency between "2,800"/"2,852"/"2,500"/"2,600" kids-helped figures (left exactly as each source stated it, not reconciled), the old non-linked emails found in older posts, and any `// AUDIT-GAP` placeholders Task 3 or Task 4 reported.

**Verify:** `npm run build` passes; open `dist/sitemap.xml` and confirm it lists all 6 top-level routes plus all 21 post URLs; `dist/robots.txt`, `dist/_redirects`, and the repo-root `vercel.json` all exist with the exact redirect rules given; `README.md` renders sensibly and lists every §12 item that needs client confirmation.

---

# Task 15: Full QA pass — cross-device click-through, accessibility, performance

Depends on all prior tasks — this is the last task before final review.

## 14. Execution order (follow this)
1. Read `docs/site-audit.md` fully. Load the skills in §1.
2. Scaffold Vite + TS + Tailwind + shadcn. Install deps. Set up tokens, fonts, index.css and aliases.
3. Clone the assets repo, copy and rename per §4, write and run `optimize-images.mjs`, generate the OG image.
4. Build the data files (`src/data/*`) by transcribing ALL copy from the audit (including all 21 full blog posts), then apply §12.
5. Build the motion primitives (§8), `Img`, `IllustratedCover`, `Scribble`, `Seo`, layout (Navbar, MobileMenu, Footer, StickyDonateBar, PageTransition, SmoothScroll), and the §7 components.
6. Build the pages in order: Home → About → Our Stories → Programs → Blog → Post → 404.
7. SEO files, redirects, sitemap, README.
8. `npm run build` with zero errors and zero warnings you can fix. `npm run preview`.
9. QA with the `run` skill: click every nav item, button and link (every Donate goes to the donation URL), the mobile menu, the slider, filters, search, the dialog, the donut legend, the gift slider, pagination and prev/next. Test at 390×844, 768×1024 and 1440×900. Test with reduced motion emulated. Then run `accessibility-audit` and `web-perf` (target Lighthouse ≥ 90 Performance on mobile, 100 Accessibility, 100 Best Practices, 100 SEO; LCP < 2.5s, CLS < 0.05). Fix everything found and re-run.
10. Finish with a short report: what was built, the §12 decisions the client should confirm, and the Lighthouse scores.

## 15. Acceptance checklist
- [ ] 6 nav items, same labels and order; DONATE is a pill; mobile overlay works and locks scroll
- [ ] All original sections and copy present on Home, About Us, Our Stories, Programs, Blog; all 21 posts at their original URLs with full text
- [ ] Every photo from the repo is used as mapped, with alt text; no favicon covers; no broken images
- [ ] Both hero videos work, with posters, the pause control and the JS fade loop on Our Stories
- [ ] DisplayCards and HandWrittenTitle integrated where specified
- [ ] Story search + filters work; dialog opens and closes accessibly
- [ ] Counters, marquee, pinned story stage, timeline, donut and gift slider all animate, and all degrade gracefully with reduced motion
- [ ] Redirects for `/25726-2/`, `/blog-2/` and `/overview/`; sitemap, robots, meta, OG and JSON-LD present
- [ ] Build passes; no console errors; Lighthouse targets met; responsive at 390/768/1440

Use the `run` skill to launch `npm run build && npm run preview` and drive the real app (not just `npm run dev` — test the production build). Click every nav item, every button and link on every page, confirm every Donate/DONATE control opens the real donation URL, test the mobile menu, the story slider/carousel, the search + filters on Our Stories, the shadcn Dialog, the allocation-donut legend, the Home gift slider, Blog pagination, and Post prev/next — at viewport widths 390×844, 768×1024 and 1440×900. Re-test the whole click-through once with `prefers-reduced-motion: reduce` emulated in devtools and confirm content stays fully readable and reachable with all motion, pinning, parallax, autoplay, confetti, cursor sparkles and marquees disabled/static.

Then run the `rampstack-skills:accessibility-audit` skill and the `web-perf` skill against the preview server. Target: Lighthouse ≥90 Performance (mobile), 100 Accessibility, 100 Best Practices, 100 SEO; LCP < 2.5s; CLS < 0.05. Fix everything the audits find directly in this task (this task owns fixing its own findings — do not hand them to the controller as a list; only escalate BLOCKED if a fix requires a design decision outside the spec, e.g. the spec's own numbers conflicting).

Confirm zero console errors, zero TypeScript errors (`npm run typecheck`), zero lint warnings you can fix (`npm run lint`), and that `npm run build` completes cleanly.

Finish with the acceptance checklist from build-prompt §15 (quoted above) — go through it item by item in your report and mark each ✅ or, if something can't be true (e.g. a genuine spec conflict), explain exactly why, with a pointer to the exact numbers/lines involved.

**Verify:** paste the actual Lighthouse scores (all 4 categories) into your report, plus the LCP/CLS numbers, plus the completed §15 checklist.
