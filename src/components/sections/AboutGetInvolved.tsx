import type { ReactNode } from "react";
import { HeartHandshake, Mail, Megaphone } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";
import TiltCard from "@/components/motion/TiltCard";
import { site } from "@/data/site";
import { DONATE_URL, openDonate } from "@/lib/donate";

/**
 * lucide-react@1.47.0 ships no `Facebook` icon — see docs/BUILD-PROMPT.md
 * §4/task-7 "known issue". Same minimal traced glyph used in Footer.tsx and
 * HomeImpact.tsx.
 */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

interface InvolvedCardProps {
  icon: typeof HeartHandshake;
  title: string;
  description: string;
  children: ReactNode;
}

function InvolvedCard({ icon: Icon, title, description, children }: InvolvedCardProps) {
  return (
    <TiltCard className="flex h-full flex-col rounded-3xl bg-brand-paper p-8 text-center ring-1 ring-brand-ink/10 shadow-[0_25px_50px_-30px_rgba(28,42,32,.4)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint text-brand-leaf-deep">
        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-brand-ink-soft">{description}</p>
      <div className="mt-6">{children}</div>
    </TiltCard>
  );
}

/**
 * ABOUT US NEW Section 5 — Get involved / contact, per
 * docs/BUILD-PROMPT.md §6.3 NEW Section 5. Three cards:
 *  - Donate → the real donation form (`openDonate`/confetti, per §9).
 *  - Spread the word → verbatim from the 2018 Fall Update post
 *    (docs/site-audit.md §11.16 / src/data/posts.ts), linking to Facebook.
 *  - Contact us → both President/Board Chair emails as mailto buttons.
 * The Donate band that follows is `HomeDonateBand`, reused as-is (composed
 * in `src/routes/About.tsx`), not rebuilt here.
 */
export default function AboutGetInvolved() {
  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-h2 text-brand-ink">Get Involved</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-ink-soft">
            There are a few simple ways to stand with the children and youth we serve.
          </p>
        </Reveal>

        <Reveal
          stagger
          delay={0.15}
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <InvolvedCard
            icon={HeartHandshake}
            title="Donate"
            description="100% of your donations go directly to the kids — every administrative cost is absorbed by our board."
          >
            <MagneticButton className="inline-block">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener"
                onClick={openDonate}
                className="inline-flex items-center gap-2 rounded-full bg-brand-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90"
              >
                Donate
              </a>
            </MagneticButton>
          </InvolvedCard>

          <InvolvedCard
            icon={Megaphone}
            title="Spread the word"
            description="Please, spread the word about our work and encourage others to support us."
          >
            <MagneticButton className="inline-block">
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-ink/5"
              >
                <FacebookIcon className="h-4 w-4" />
                Follow &amp; Share
              </a>
            </MagneticButton>
          </InvolvedCard>

          <InvolvedCard
            icon={Mail}
            title="Contact us"
            description="Questions or comments are always welcome — reach our President or Board Chair directly."
          >
            <div className="flex flex-col items-center gap-2">
              <a
                href={`mailto:${site.contacts.president.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-ink/5"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                {site.contacts.president.name}
              </a>
              <a
                href={`mailto:${site.contacts.boardChair.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-ink/5"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                {site.contacts.boardChair.name}
              </a>
            </div>
          </InvolvedCard>
        </Reveal>
      </div>
    </section>
  );
}
