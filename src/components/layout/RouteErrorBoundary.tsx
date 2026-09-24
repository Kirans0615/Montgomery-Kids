import { Component, type ErrorInfo, type ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
  /**
   * Changing this remounts the boundary, clearing a previous error. Pass the
   * current pathname: if a visitor hits a failure on one route and then
   * navigates somewhere else, they should get the new page, not a stuck
   * error screen.
   */
  resetKey: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches a render-time failure anywhere inside the routed `<main>` — in
 * practice, almost always a **lazy route chunk that failed to load**.
 *
 * Task 15 moved every route except Home behind `React.lazy`, which is what
 * took the entry chunk from 1,536 kB to 205 kB. It also introduced a failure
 * mode the site did not previously have: before, all the code arrived in one
 * request, so if the page loaded at all, every route worked. Now a route's
 * code is fetched on demand, and that fetch can fail:
 *
 *  - the visitor goes offline (or through a flaky connection / captive portal)
 *    between loading the shell and clicking a nav link;
 *  - **a deploy lands mid-session.** This is the likely one. `vercel.json`
 *    serves `index.html` with `max-age=0` and `/assets/*` as `immutable`, so
 *    an open tab keeps the *old* HTML with the *old* content-hashed chunk
 *    names. After a deploy those files are gone, and the next lazy import
 *    404s.
 *
 * Without a boundary, `React.lazy`'s rejected promise propagates as an
 * unhandled error and React unmounts the whole tree — a white screen with no
 * way out but a manual reload the visitor has no reason to guess at.
 *
 * A reload is genuinely the fix for both cases (it re-fetches `index.html`,
 * which for the deploy case hands back the new chunk names), so that is what
 * the recovery action does. `React.lazy` memoises its rejected promise, so
 * simply re-rendering the same route would fail again — this deliberately
 * does not offer a "try again" that cannot work.
 *
 * Kept as a plain class component with no dependencies: error boundaries have
 * no hook equivalent, and this sits in the entry chunk, so it must not pull
 * anything in behind it.
 */
export default class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: RouteErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No analytics endpoint on this site, so the console is the only place
    // this can go — but it must go somewhere, or a chunk-load failure in
    // production is invisible to whoever is debugging it.
    console.error("Route failed to render:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section className="flex min-h-[60vh] items-center justify-center px-6 py-32">
        <div className="mx-auto max-w-md text-center">
          <p className="font-hand text-3xl text-brand-tangerine-deep">well, that&rsquo;s awkward</p>
          <h1 className="mt-3 font-display text-h2 text-brand-ink">
            This page didn&rsquo;t load
          </h1>
          <p className="mt-4 text-body text-brand-ink-soft">
            Something went wrong fetching it — usually a dropped connection, or the site
            updating while you were reading. Refreshing almost always fixes it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
            >
              Refresh the page
            </button>
            {/*
              A real `<a>`, not a react-router `<Link>`: the router is fine,
              but a full document load is what actually recovers a stale
              `index.html`, which is the most likely reason to be here.
            */}
            <a
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-bold text-brand-leaf-deep underline underline-offset-4 transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
            >
              Go to the homepage
            </a>
          </div>
        </div>
      </section>
    );
  }
}
