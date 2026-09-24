import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import Scribble from "@/components/motion/Scribble";
import { site } from "@/data/site";

/**
 * ABOUT US Section 2 — About copy, per docs/BUILD-PROMPT.md §6.3 Section 2 /
 * docs/site-audit.md §7 Section 2. Both paragraph pairs and the mailing
 * address are verbatim (the address comes from `site.mailingAddress`, the
 * §12-fixed "Motor City Drive" version, rather than being retyped).
 *
 * Editorial two-column layout: a drop cap on the first paragraph (CSS
 * `first-letter`), and the audit's "On any given day, more than 400 children
 * live in foster care" fact is echoed as a huge pull-stat ("400+" counter) in
 * the margin next to the paragraph it comes from — the paragraph itself
 * stays intact and verbatim, the counter is a visual amplifier alongside it,
 * not a replacement.
 */
export default function AboutCopy() {
  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">About 4 Montgomery&rsquo;s Kids</h2>
          <Scribble variant="underline" color="leaf" className="mt-3 h-3 w-32" />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <Reveal>
              <div className="space-y-5 text-body text-brand-ink-soft">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.75] first-letter:text-brand-tangerine-deep">
                  {site.impactParagraph}
                </p>
                <p>
                  On any given day, more than 400 children live in foster care. They were removed
                  from families because of physical or sexual abuse or chronic neglect. Another 100
                  or so at-risk children remain with their families but are being monitored by
                  county social workers. 4Montgomery&rsquo;s Kids provides support and enrichment to
                  these children and young adults to help turn needs that once were only dreams into
                  reality.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-body text-brand-ink-soft">
                <p>
                  Dreams come in all shapes and sizes. The dreams of children in foster care range
                  from a simple gift card for a birthday, to summer camp, to transportation for a
                  job, to rent so they won&rsquo;t be homeless as they age out of child welfare.
                </p>

                {/* Postcard-style mailing-address card with a green "4" stamp graphic. */}
                <div className="relative mt-8 max-w-sm rounded-2xl border border-brand-ink/10 bg-brand-paper p-6 shadow-[0_20px_50px_-30px_rgba(28,42,32,.4)]">
                  <div
                    aria-hidden="true"
                    className="absolute right-5 top-5 flex h-14 w-12 rotate-3 items-center justify-center rounded-sm border-2 border-dashed border-brand-leaf/50 bg-brand-mint/60"
                  >
                    <span className="font-display text-2xl font-bold text-brand-leaf-deep">4</span>
                  </div>
                  <p className="text-eyebrow uppercase text-brand-ink/70">Mailing Address</p>
                  <address className="mt-2 text-base not-italic leading-relaxed text-brand-ink">
                    {site.mailingAddress.line1}
                    <br />
                    {site.mailingAddress.line2}
                    <br />
                    {site.mailingAddress.line3}
                  </address>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:pt-2">
            <div className="rounded-3xl bg-brand-mint/50 p-8 text-center lg:sticky lg:top-28">
              <Counter
                value={400}
                suffix="+"
                className="text-6xl font-bold text-brand-tangerine-deep md:text-7xl"
              />
              <p className="mt-3 font-hand text-2xl leading-snug text-brand-ink-soft">
                children live in foster care in Montgomery County on any given day
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
