import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, useLocation, useRoutes } from "react-router-dom";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import StickyDonateBar from "@/components/layout/StickyDonateBar";
import RouteErrorBoundary from "@/components/layout/RouteErrorBoundary";
import Home from "@/routes/Home";

/**
 * Home is imported eagerly — it's the landing route for most visitors, and
 * making it wait on a second network round-trip would push back the very
 * paint this split exists to speed up. Every other route is `lazy`.
 *
 * This matters more than it looks: `src/data/posts.ts` alone is 59 kB of
 * source (all 21 posts, in full), and `stories.ts`/`programs.ts`/`board.ts`/
 * `timeline.ts` add ~25 kB more — none of which Home needs, and all of which
 * used to sit in the one entry chunk every visitor downloaded and parsed
 * before anything could render. Task 15's first Lighthouse run measured a
 * 1,536 kB entry chunk, 6.7s First Contentful Paint and a Largest
 * Contentful Paint that was 94% "render delay" — i.e. the page was waiting
 * on JavaScript, not on the network or on an image.
 */
const About = lazy(() => import("@/routes/About"));
const Stories = lazy(() => import("@/routes/Stories"));
const Programs = lazy(() => import("@/routes/Programs"));
const Blog = lazy(() => import("@/routes/Blog"));
const Post = lazy(() => import("@/routes/Post"));
const NotFound = lazy(() => import("@/routes/NotFound"));

/**
 * Shown while a lazy route chunk is in flight.
 *
 * This started out as a blank `min-h-screen` div on the theory that route
 * chunks are small enough for anything visible to flash and read as jank.
 * That was wrong on a real connection: on a throttled in-app navigation to
 * /our-stories the blank state measured ~750 ms, which reads as the site
 * having broken rather than as it working. So: a real indicator.
 *
 * Kept deliberately cheap, because this lives in the entry chunk and the
 * whole point of the split was to keep that chunk small — three CSS-animated
 * dots and a line of text, no library, no icon, no image. The wrapper still
 * reserves `min-h-screen` so the footer doesn't jump up and back down (the
 * site measures CLS well under the 0.05 target across all pages, and this
 * keeps it that way).
 *
 * `role="status"` + `aria-live="polite"` announces the wait to a screen
 * reader instead of leaving it on a silently empty `<main>`. Under
 * `prefers-reduced-motion` the global rule in index.css collapses the dot
 * animation to a stop — which is why the state is carried by the *word*
 * "Loading" and not by the motion alone.
 */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center px-6"
    >
      <span className="flex items-center gap-3 text-brand-ink-soft">
        <span aria-hidden="true" className="flex items-end gap-1.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              // `leaf-deep`, not `leaf`: the brand green #8EC63F reads at
              // 1.9:1 on cream and all but vanished in a real screenshot of
              // this state. These dots are decorative (`aria-hidden`), so no
              // contrast rule forces the change — they just have to be
              // visible to do their job.
              className="block h-2 w-2 rounded-full bg-brand-leaf-deep animate-[fade-up_0.9s_ease-in-out_infinite_alternate]"
              style={{ animationDelay: `${index * 140}ms` }}
            />
          ))}
        </span>
        <span className="font-hand text-2xl">Loading</span>
      </span>
    </div>
  );
}

/**
 * Route table for the whole site, per docs/BUILD-PROMPT.md §5 / plan Task 7.
 *
 * Blog posts use `/:year/:month/:slug` (e.g.
 * `/2025/11/you-made-it-happen-2500-kids-supported-and-counting`) — this
 * matches src/data/posts.ts's actual shape exactly: `year: "2025"` (4
 * digits), `month: "11"` (2-digit, zero-padded), `slug: "..."`. That's the
 * original WordPress permalink structure (`/%year%/%monthnum%/%postname%/`)
 * these 21 posts were published under, so keeping this exact three-segment
 * path (rather than nesting posts under `/blog/...`) is what lets existing
 * inbound links and search-engine indexing survive the rebuild, per §5's
 * "keep the exact original post URLs from the audit" note. There's no
 * ambiguity with the app's other (all single-segment) routes: React Router
 * ranks static segments above dynamic ones regardless of array order, and
 * every other route here has a different segment count anyway.
 */
const routes = [
  { path: "/", element: <Home /> },
  { path: "/about-us", element: <About /> },
  { path: "/our-stories", element: <Stories /> },
  { path: "/programs", element: <Programs /> },
  { path: "/blog", element: <Blog /> },
  { path: "/:year/:month/:slug", element: <Post /> },
  { path: "/overview", element: <Navigate to="/about-us" replace /> },
  { path: "*", element: <NotFound /> },
];

/**
 * Composition + a11y landmarks per docs/BUILD-PROMPT.md §10: a skip-to-content
 * link, `<header>` (inside Navbar), `<nav aria-label="Main">` (inside
 * Navbar), `<main id="main">`, and `<footer>` (Footer).
 *
 * Mobile-menu open state lives here (not inside Navbar) so both `MobileMenu`
 * and `StickyDonateBar` — siblings of `Navbar`, not descendants of it — can
 * react to it (StickyDonateBar hides while the menu is open; the menu itself
 * also auto-closes on every route change).
 */
function AppShell() {
  const location = useLocation();
  const element = useRoutes(routes);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close the mobile menu on every route change (belt-and-braces: each
  // menu link/Donate click already closes it directly on click, but this
  // also covers browser back/forward and any other programmatic
  // navigation). Adjusting state during render — rather than in a
  // `useEffect` — is the pattern React itself recommends for "reset state
  // when a prop changes": https://react.dev/learn/you-might-not-need-an-effect
  const [pathnameAtLastRender, setPathnameAtLastRender] = useState(location.pathname);
  if (location.pathname !== pathnameAtLastRender) {
    setPathnameAtLastRender(location.pathname);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream font-sans text-brand-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <PageTransition>
        <main id="main" className="flex-1">
          {/*
            The boundary wraps the Suspense boundary, not the other way round:
            a `React.lazy` chunk that fails to load rejects *through* Suspense,
            so only an ancestor error boundary can catch it. Keyed on the
            pathname so navigating elsewhere clears a previous failure — see
            RouteErrorBoundary for the two real ways this fires (offline, and
            a deploy landing mid-session against an immutable-cached
            `/assets`).
          */}
          <RouteErrorBoundary resetKey={location.pathname}>
            <Suspense fallback={<RouteFallback />}>{element}</Suspense>
          </RouteErrorBoundary>
        </main>
      </PageTransition>

      <Footer />
      <StickyDonateBar mobileMenuOpen={mobileMenuOpen} />
    </div>
  );
}

// import.meta.env.BASE_URL is "/" in production (SITE_ORIGIN root) or
// "/Montgomery-Kids/" on the GitHub Pages demo (see vite.config.ts's
// `GH_PAGES` flag) — always trailing-slash. React Router's `basename`
// wants no trailing slash, and "" (not "/") for the root case.
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <SmoothScroll>
        <AppShell />
      </SmoothScroll>
    </BrowserRouter>
  );
}
