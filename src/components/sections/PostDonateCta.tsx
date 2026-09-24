import { Heart } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";
import { DONATE_URL, openDonate } from "@/lib/donate";

/**
 * End-of-post Donate CTA card, per docs/BUILD-PROMPT.md §6.7: "every appeal
 * post ends with 'please donate', and the current site has no button" — so
 * every post gets one real, working Donate button after its own content,
 * reusing the exact `DONATE_URL`/`openDonate` confetti-then-new-tab flow
 * used everywhere else on the site (Navbar, HomeDonateBand).
 */
export default function PostDonateCta() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[28px] bg-brand-sun px-8 py-10 text-center shadow-[0_24px_50px_-24px_rgba(28,42,32,.35)] sm:px-12">
        <Heart aria-hidden="true" className="mx-auto h-8 w-8 text-brand-ink" fill="currentColor" />
        <p className="mx-auto mt-4 max-w-md font-display text-h3 text-brand-ink">
          Please donate to help kids in Montgomery County&rsquo;s foster care system.
        </p>
        <p className="mx-auto mt-3 max-w-md text-brand-ink/80">
          100% of your donation goes directly to helping the kids.
        </p>
        <MagneticButton className="mt-6 inline-block">
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener"
            onClick={openDonate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-cream transition hover:bg-brand-ink/90"
          >
            Donate Now
          </a>
        </MagneticButton>
      </div>
    </Reveal>
  );
}
