import { ArrowUp, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { NAV_LINKS } from "@/lib/nav";
import { site } from "@/data/site";
import { useLenis } from "@/hooks/useLenis";
import { publicUrl } from "@/lib/publicUrl";

/**
 * `lucide-react@1.47.0` ships no `Facebook` icon (see docs/BUILD-PROMPT.md /
 * task-7 brief "known issue"). Rather than substitute an unrelated lucide
 * icon, this is a standard, minimal Facebook "f" glyph traced as a single
 * path — visually correct and recognizable, matching every other icon's
 * height/width + currentColor sizing.
 */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

function BackToTop() {
  const lenis = useLenis();

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 font-semibold text-brand-cream/90 underline-offset-4 hover:underline"
    >
      Back to top <ArrowUp aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

/**
 * Global footer per docs/BUILD-PROMPT.md §6.2: 4 columns, wavy top edge, a
 * faint "4MK" watermark, and a bottom bar with a runtime-computed copyright
 * year. Carries `id="site-footer"` so StickyDonateBar's IntersectionObserver
 * can find it and hide the sticky bar while the real footer is in view.
 */
export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden bg-brand-ink pt-16 text-brand-cream"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute -top-px left-0 h-10 w-full text-brand-cream"
      >
        <path
          fill="currentColor"
          d="M0 32C240 6 480 -6 720 10C960 26 1200 44 1440 22V60H0V32Z"
        />
      </svg>

      {/*
        The faint "4MK" watermark is drawn by a CSS `::before` (`content:
        "4MK"`), not a text node. As a real `<span>` it measured 1.26:1
        against the footer's ink background — deliberately, it's a watermark —
        but axe's `color-contrast` rule checks any *rendered text*, `aria-hidden`
        or not, so it failed on all 10 routes in Task 15's audit and was the
        one thing keeping Accessibility off 100 site-wide. Generated content
        isn't in the DOM, so it is (correctly) treated as decoration. Identical
        pixels, honest semantics.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-0 select-none font-display text-[9rem] font-bold leading-none text-brand-cream opacity-[0.08] before:content-['4MK'] sm:text-[13rem]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-block rounded-2xl bg-brand-paper p-3">
              <picture>
                <source type="image/webp" srcSet={publicUrl("images/opt/logo-lockup.webp")} />
                <img
                  src={publicUrl("images/logo-lockup.png")}
                  alt="4Montgomery's Kids"
                  width={160}
                  height={45}
                  className="h-9 w-auto"
                />
              </picture>
            </div>
            <p className="mt-4 max-w-xs text-sm text-brand-cream/80">{site.mission}</p>
            <p className="mt-4 inline-block rounded-full border border-brand-cream/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cream/80">
              {site.taxStatus} · Founded {site.foundedYear}
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-brand-cream">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-brand-cream/80 hover:text-brand-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={DONATE_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={openDonate}
                  className="text-brand-cream/80 hover:text-brand-cream"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-brand-cream">Get in touch</h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-brand-cream/80">
              <p>
                {site.mailingAddress.line1}
                <br />
                {site.mailingAddress.line2}
                <br />
                {site.mailingAddress.line3}
              </p>
              <p>
                <a
                  href={`mailto:${site.contacts.president.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-brand-cream"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {site.contacts.president.name}, {site.contacts.president.title}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.contacts.boardChair.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-brand-cream"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {site.contacts.boardChair.name}, {site.contacts.boardChair.title}
                </a>
              </p>
              <p>
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-brand-cream"
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  Follow us on Facebook
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-brand-cream">
              Make a difference
            </h2>
            <p className="mt-4 text-sm text-brand-cream/80">
              One child at a time, your gift helps restore dignity and hope.
            </p>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener"
              onClick={openDonate}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-sun px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-ink"
            >
              Donate
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-brand-cream/15 pt-6 text-xs text-brand-cream/70 sm:flex-row sm:justify-between">
          <p>
            © {site.orgName}, {CURRENT_YEAR} · {site.mailingAddress.line2},{" "}
            {site.mailingAddress.line3}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
