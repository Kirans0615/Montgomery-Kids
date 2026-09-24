import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { publicUrl } from "@/lib/publicUrl";

/** A search link (never 404s) rather than a specific Candid profile URL, per docs/BUILD-PROMPT.md §6.3 NEW Section 2c. */
const CANDID_SEARCH_URL = "https://www.guidestar.org/search?q=4Montgomery%27s%20Kids";

/**
 * ABOUT US NEW Section 2c — Transparency, per docs/BUILD-PROMPT.md §6.3 NEW
 * Section 2c. `id="transparency"` is the target of the Home hero's "Candid
 * Platinum Transparency 2026" announcement pill (`/about-us#transparency`),
 * wired up in `src/components/layout/PageTransition.tsx`'s route-change
 * scroll handler — works both from that cross-page link and on a direct
 * load of the URL, since that handler runs on mount either way.
 *
 * `scroll-mt-28` gives the anchor breathing room under the fixed Navbar for
 * any plain (non-Lenis) scroll path; PageTransition's own JS-driven scroll
 * carries a matching manual offset for the Lenis path.
 *
 * The seal is the right-hand portion of `logo-lockup.png` (wordmark +
 * Candid seal side by side), cropped in with `object-fit: cover` +
 * `object-position: right` rather than a second image asset — same
 * `<picture>`/webp pattern Navbar.tsx uses for this exact file.
 */
export default function AboutTransparency() {
  return (
    <section
      id="transparency"
      aria-labelledby="transparency-heading"
      className="scroll-mt-28 bg-brand-mint/40 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 px-6 sm:grid-cols-[auto_1fr] lg:px-8">
        <Reveal>
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-3xl bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_20px_50px_-30px_rgba(28,42,32,.4)] sm:h-40 sm:w-40">
            <picture>
              <source type="image/webp" srcSet={publicUrl("images/opt/logo-lockup.webp")} />
              <img
                src={publicUrl("images/logo-lockup.png")}
                alt="Candid Platinum Transparency 2026 seal"
                width={800}
                height={226}
                loading="lazy"
                className="h-full w-full object-cover object-right"
              />
            </picture>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="text-center sm:text-left">
          {/*
            "financial transparency" was already the section's label — it just
            wasn't marked up as a heading, so this band was the only section
            on About Us with no heading element at all (flagged in Task 9,
            closed here). Promoting the existing Caveat line to `<h2>` costs
            nothing visually: the font, size, colour and spacing are the same
            classes it carried as a `<p>`.
          */}
          <h2
            id="transparency-heading"
            className="font-hand text-2xl font-normal text-brand-tangerine-deep"
          >
            financial transparency
          </h2>
          <p className="mt-2 text-xl font-semibold leading-snug text-brand-ink md:text-2xl">
            100% of your donations go directly to helping those children, teens, and young adults
            who are the most vulnerable among us.
          </p>
          <p className="mt-4 text-brand-ink-soft">
            All administrative costs of 4Montgomery&rsquo;s Kids are absorbed by our board members.
          </p>
          <a
            href={CANDID_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-leaf-deep underline decoration-brand-leaf-deep/40 underline-offset-4 hover:text-brand-ink"
          >
            View our Candid profile
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
