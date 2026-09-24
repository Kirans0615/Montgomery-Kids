import { useState, type FormEvent } from "react";
import {
  ArrowUp,
  GraduationCap,
  HeartPulse,
  Home as HomeIcon,
  Sparkles,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";
import Scribble from "@/components/motion/Scribble";
import { useVideoFade } from "@/hooks/useVideoFade";
import { useDeferredVideoSource } from "@/hooks/useDeferredVideo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_VIDEO_STORIES, HERO_VIDEO_STORIES_WEBM, impactStats } from "@/data/site";
import { storiesCta, type StoryCategory } from "@/data/stories";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/publicUrl";

/**
 * `graduate.jpg` is the only photo among the 11 story covers that also
 * matches this page's own theme (a graduation story), and `optimize-images`
 * only ever generated a -480 webp for it (the 509px source is narrower than
 * 960) — see Img.tsx's own comment on the same "never upscale past the
 * original" rule. Good enough for an above-the-fold poster under a 55% cream
 * wash, where fine detail doesn't matter.
 */
const HERO_POSTER = publicUrl("images/opt/graduate-480.webp");

const CATEGORY_CHIPS: Array<{ value: StoryCategory; label: string; icon: LucideIcon }> = [
  { value: "Education", label: "Education", icon: GraduationCap },
  { value: "Independence", label: "Independence", icon: HomeIcon },
  { value: "Wellbeing", label: "Wellbeing", icon: HeartPulse },
];

export interface StoriesHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  activeCategories: StoryCategory[];
  onToggleCategory: (category: StoryCategory) => void;
  resultCount: number;
  totalCount: number;
}

/**
 * Full-screen video background using the exact `useVideoFade` mechanism
 * (docs/BUILD-PROMPT.md §6.4 Section 1): no CSS transition on the video
 * itself (only the hook's own inline `style.opacity` rAF fades), no `loop`
 * attribute (the hook restarts the video itself on `ended`), sized 115%
 * width/height, centered horizontally, anchored to the top. Under reduced
 * motion no `<video>` is rendered at all — the poster image stands in for
 * it — since `useVideoFade` itself is a no-op in that case.
 */
function HeroVideo() {
  const videoRef = useVideoFade<HTMLVideoElement>();
  const reducedMotion = useReducedMotion();
  const [errored, setErrored] = useState(false);
  const showVideo = !reducedMotion && !errored;
  // Hold the ~3MB MP4 back until after first paint — see useDeferredVideoSource.
  // The `useVideoFade` contract is unaffected: it starts the video at opacity
  // 0 and fades in on `loadeddata`, which simply fires a beat later now.
  const videoSourceReady = useDeferredVideoSource(videoRef, showVideo);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-ink">
      {/*
        The still is a real `<img>` layered *behind* the video rather than the
        video's `poster` attribute. Two reasons:

        1. Performance. This hero still is /our-stories' Largest Contentful
           Paint element, and a `poster` can't carry `fetchpriority` — the
           browser only discovered it after React rendered the `<video>`,
           which put LCP at 4.3s on mobile, 100% render delay. As an eager,
           high-priority `<img>` the fetch starts with the rest of the page.
        2. It's what `useVideoFade` actually wants. That hook runs the video
           from opacity 0, fades it in on `loadeddata` and fades it back out
           0.55s before the end of each loop — with a `poster` there is
           nothing behind it during those fades but flat `bg-brand-ink`.
           With the still underneath, each loop crossfades between footage
           and photograph instead of dipping to black.

        Under reduced motion the `<video>` isn't rendered at all and this
        `<img>` is the whole background, which is exactly what §6.4 asks for.
      */}
      <img
        src={HERO_POSTER}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        {...{ fetchpriority: "high" }}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="none"
          onError={() => setErrored(true)}
          style={{ opacity: 0 }}
          className="absolute left-1/2 top-0 h-[115%] w-[115%] max-w-none -translate-x-1/2 object-cover object-top"
        >
          {videoSourceReady && (
            <>
              <source src={HERO_VIDEO_STORIES_WEBM} type="video/webm" />
              <source src={HERO_VIDEO_STORIES} type="video/mp4" />
            </>
          )}
        </video>
      )}
      {/* Cream wash overlay at 55%, per §6.4 Section 1. */}
      <div className="absolute inset-0 bg-brand-cream/55" />
    </div>
  );
}

/**
 * OUR STORIES Section 1 — Hero, per docs/BUILD-PROMPT.md §6.4 Section 1: a
 * JS-faded video background behind a centered header group and a "story
 * finder" box (this page's adaptation of the brief's chat-input-box
 * pattern) whose search field and category chips drive the shared filter
 * state lifted up to `src/routes/Stories.tsx`.
 */
export default function StoriesHero({
  query,
  onQueryChange,
  onSubmit,
  activeCategories,
  onToggleCategory,
  resultCount,
  totalCount,
}: StoriesHeroProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="relative flex min-h-[720px] w-full items-center overflow-hidden py-32">
      <HeroVideo />

      <div className="relative z-10 mx-auto -mt-[50px] flex w-full max-w-4xl flex-col items-center px-6 text-center lg:px-8">
        <div className="flex flex-col items-center gap-[34px]">
          <div className="inline-flex items-center">
            <span className="z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-3.5 py-1.5 text-sm font-semibold text-brand-cream shadow-sm">
              <Star aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" />
              New
            </span>
            <span className="-ml-4 rounded-full bg-brand-paper py-1.5 pl-6 pr-4 text-sm font-semibold text-brand-ink shadow-[0_10px_24px_-8px_rgba(28,42,32,.25)]">
              Real stories from real kids
            </span>
          </div>

          <h1 className="relative inline-block font-display text-hero font-extrabold leading-none tracking-[-0.06em] text-brand-ink">
            Our Stories
            <Scribble
              variant="underline"
              color="tangerine"
              className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full"
            />
          </h1>

          {/* Verbatim from src/data/stories.ts's `storiesCta.body` — the exact
              same sentence the audit gives for this page's subtitle (§6.4
              Section 1), reused by reference rather than retyped so there's
              no risk of drift from the audited copy. */}
          <p className="max-w-[736px] text-xl font-medium text-brand-ink-soft">{storiesCta.body}</p>
        </div>

        <div className="mt-11 w-full max-w-[728px] rounded-[18px] bg-brand-ink/25 p-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2 text-xs font-semibold text-brand-cream">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                {totalCount} stories · {impactStats.requestsFulfilled.toLocaleString()} requests fulfilled
              </span>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener"
                onClick={openDonate}
                className="inline-flex items-center gap-1 rounded-full bg-brand-sun px-2.5 py-1 text-brand-ink transition hover:bg-brand-sun/90"
              >
                <Sun aria-hidden="true" className="h-3 w-3" />
                Donate
              </a>
            </div>
            <span className="inline-flex items-center gap-1 text-brand-cream/80">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Powered by social workers
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            role="search"
            className="flex items-center gap-2 rounded-xl bg-brand-paper p-2 shadow-[0_20px_40px_-20px_rgba(28,42,32,.4)]"
          >
            <label htmlFor="story-search" className="sr-only">
              Search stories
            </label>
            {/*
              Every suggested term must actually return results against `storyCards`
              (this box searches title + body, case-insensitive). The original copy
              suggested "camp" — which matches 0 of the 11 story cards, because summer
              camp is a *Home* story slide, not one of this page's cards. Typing the
              app's own example and getting the empty state back is a bad first
              impression, so "camp" is replaced with "rent" (4 matches);
              "apartment" (2) and "school" (5) both check out and are kept. Found
              with Playwright in Task 15's QA pass.
            */}
            <input
              id="story-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={'Search stories… try "rent", "apartment", "school"'}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-brand-ink placeholder:text-brand-ink-soft/80 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search stories"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-ink text-brand-cream transition hover:bg-brand-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
            >
              <ArrowUp aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
            <div
              role="group"
              aria-label="Filter stories by category"
              className="flex flex-wrap gap-2"
            >
              {CATEGORY_CHIPS.map((chip) => {
                const isActive = activeCategories.includes(chip.value);
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => onToggleCategory(chip.value)}
                    aria-pressed={isActive}
                    className={cn(
                      // min-h-11 keeps these chips at §10's 44px touch-target floor.
                      "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep",
                      isActive
                        ? "bg-brand-ink text-brand-cream"
                        : "bg-brand-paper text-brand-ink-soft hover:text-brand-ink",
                    )}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    {chip.label}
                  </button>
                );
              })}
            </div>
            <span className="px-1 text-xs font-semibold text-brand-cream" aria-live="polite">
              {resultCount}/{totalCount} stories
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
