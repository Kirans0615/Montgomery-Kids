import SplitText from "@/components/motion/SplitText";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import { publicUrl } from "@/lib/publicUrl";

export interface BlogHeroProps {
  postCount: number;
}

/**
 * BLOG Section 1 — Hero, per docs/BUILD-PROMPT.md §6.6 (B): `kids-writing-
 * desks.jpg` behind a strong ink gradient (matching AboutHero's treatment so
 * every interior hero reads consistently), an H1 with a hand-drawn scribble
 * underline, and the subtitle set in Caveat.
 */
export default function BlogHero({ postCount }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-32 pt-40 md:py-40 md:pt-48">
      <div className="absolute inset-0">
        <picture>
          <source
            type="image/webp"
            srcSet={`${publicUrl("images/opt/kids-writing-desks-480.webp")} 480w, ${publicUrl("images/opt/kids-writing-desks-960.webp")} 960w`}
            sizes="100vw"
          />
          {/*
            This full-bleed hero photo is /blog's Largest Contentful Paint
            element, and without a priority hint the browser queued it behind
            everything else — Lighthouse measured 980 ms of pure "load delay"
            on mobile, a full second of a 4.3s LCP spent waiting to *start*
            fetching. `fetchpriority` is spread as a raw lowercase attribute
            for the same reason Img.tsx does it: React 18's react-dom has no
            camelCase `fetchPriority` mapping.
          */}
          <img
            src={publicUrl("images/kids-writing-desks.jpg")}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            {...{ fetchpriority: "high" }}
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-brand-ink/50" />
        <div className="absolute inset-0 bg-brand-ink/30" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8">
        <h1 className="relative inline-block font-display text-hero leading-none tracking-[-0.03em] text-brand-cream">
          <SplitText text="Blog" as="span" by="char" staggerMs={40} />
          <Scribble
            variant="underline"
            color="tangerine"
            className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full"
          />
        </h1>

        <Reveal delay={0.3}>
          <p className="mt-6 font-hand text-3xl leading-snug text-brand-sun md:text-4xl">
            News from 4Montgomery&rsquo;s Kids
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-brand-cream/70">
            {postCount} posts, straight from the families and donors we work with every day
          </p>
        </Reveal>
      </div>
    </section>
  );
}
