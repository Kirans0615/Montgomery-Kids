import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import Scribble from "@/components/motion/Scribble";
import MagneticButton from "@/components/motion/MagneticButton";
import Marquee from "@/components/motion/Marquee";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useDeferredVideoSource } from "@/hooks/useDeferredVideo";
import { site, HERO_VIDEO_HOME, HERO_VIDEO_HOME_WEBM } from "@/data/site";
import { partners } from "@/data/partners";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/publicUrl";

/**
 * Poster for the hero video — a real frame pulled from the hero video itself
 * (see HERO_VIDEO_HOME below), so there's no jarring flash from an unrelated
 * photo to the actual video content once it loads. Generated at build time
 * via scripts/optimize-images.mjs's standard 480/960/1600 pipeline; this uses
 * the 1600 variant since the source is a full 1920px frame.
 */
const HERO_POSTER = publicUrl("images/opt/hero-kids-outdoors-1600.webp");

/**
 * Presentational wordmark labels for the "Backed by" strip (build-prompt
 * §6.1 Section 1), a shorter display form of the same 6 partners in
 * `src/data/partners.ts` — same order, so this zips 1:1 with that array for
 * the real outbound `url`. Each font is loaded below via a page-scoped
 * Google Fonts request (subset to only the characters these 6 labels use).
 */
const HERO_PARTNER_LABELS = [
  { label: "100 Who Care Alliance", className: "font-display italic font-bold" },
  { label: "THE PHASE FOUNDATION", className: "font-['Oswald'] font-medium uppercase" },
  { label: "St. Anne's Damascus", className: "font-['Playfair_Display'] font-bold" },
  { label: "Women Who Care", className: "font-['Montserrat'] font-bold" },
  { label: "Nora Roberts Foundation", className: "font-['Roboto_Slab'] font-semibold" },
  { label: "Healthcare Initiative Foundation", className: "font-['Raleway'] font-bold" },
] as const;

const MIXED_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Playfair+Display:wght@700&family=Montserrat:wght@700&family=Roboto+Slab:wght@600&family=Raleway:wght@700&display=swap&text=%20'.ACDEFHINOPRSTUWabcdehilmnorstuv";

function BackedByRow() {
  const items = HERO_PARTNER_LABELS.map((entry, index) => {
    const partner = partners[index];
    const content = <span className={entry.className}>{entry.label}</span>;

    if (!partner?.url) {
      return (
        <span key={entry.label} className="whitespace-nowrap text-brand-ink/75">
          {content}
        </span>
      );
    }

    return (
      <a
        key={entry.label}
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap text-brand-ink/75 transition hover:text-brand-ink"
      >
        {content}
      </a>
    );
  });

  return (
    <div className="mt-14 w-full animate-fade-up stagger-6 md:mt-20">
      <p className="text-eyebrow uppercase text-brand-ink/70">
        Thank You to Our Community Partners
      </p>

      {/* Desktop/tablet: static wrapped row. Mobile: auto-scrolling marquee. */}
      <div className="mt-4 hidden flex-wrap items-center gap-6 text-lg md:flex md:gap-12 md:text-xl lg:text-2xl">
        {items}
      </div>
      <div className="mt-4 md:hidden">
        <Marquee speed={28} itemClassName="text-lg">
          {items}
        </Marquee>
      </div>
    </div>
  );
}

function ScrollCue() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return undefined;
    const handleScroll = () => setDismissed(true);
    window.addEventListener("scroll", handleScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-500",
        dismissed ? "opacity-0" : "opacity-100",
      )}
    >
      <span className="font-hand text-xl text-brand-ink/70">scroll</span>
      <svg
        width="16"
        height="22"
        viewBox="0 0 16 22"
        fill="none"
        className="animate-[fade-up_1.4s_ease-in-out_infinite_alternate] text-brand-ink/70"
      >
        <path
          d="M8 1v18M1 12l7 7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function HomeHero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoErrored, setVideoErrored] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const showVideo = !reducedMotion && !videoErrored;
  // Hold the ~3MB MP4 back until after first paint — see useDeferredVideoSource.
  const videoSourceReady = useDeferredVideoSource(videoRef, showVideo);

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useGsapContext(
    sectionRef,
    ({ gsap }) => {
      if (reducedMotion || !sectionRef.current) return;

      const scrollTrigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { yPercent: 0, opacity: 1 },
          { yPercent: -30, opacity: 0, ease: "none", scrollTrigger },
        );
      }
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { scale: 1 },
          { scale: 1.08, ease: "none", scrollTrigger },
        );
      }
    },
    [reducedMotion],
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-brand-cream"
    >
      <Helmet>
        <link rel="stylesheet" href={MIXED_FONTS_URL} />
      </Helmet>

      <div className="absolute inset-0">
        {showVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={HERO_POSTER}
            onError={() => setVideoErrored(true)}
            className="h-full w-full object-cover object-bottom will-change-transform"
          >
            {videoSourceReady && (
              <>
                <source src={HERO_VIDEO_HOME_WEBM} type="video/webm" />
                <source src={HERO_VIDEO_HOME} type="video/mp4" />
              </>
            )}
          </video>
        ) : (
          <img
            src={HERO_POSTER}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-bottom"
          />
        )}

        <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-cream/80 via-brand-cream/45 to-transparent md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cream/85 via-brand-cream/55 to-transparent md:hidden" />

        {showVideo && (
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-brand-paper/80 text-brand-ink shadow-[0_10px_24px_-8px_rgba(28,42,32,.35)] backdrop-blur-sm transition hover:bg-brand-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
          >
            {isPlaying ? (
              <Pause aria-hidden="true" className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play aria-hidden="true" className="h-5 w-5" fill="currentColor" />
            )}
          </button>
        )}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-7xl flex-col items-start px-6 pt-32 md:pt-40 lg:px-8"
      >
        <Link
          to="/about-us#transparency"
          className="animate-fade-up stagger-3 inline-flex items-center gap-2 rounded-full border border-brand-ink/15 bg-brand-paper/70 px-4 py-2 text-sm font-semibold text-brand-ink backdrop-blur-sm transition hover:bg-brand-paper"
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-leaf" />
          Candid Platinum Transparency 2026
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>

        <h1 className="animate-fade-up stagger-4 mt-6 max-w-4xl text-left font-display text-hero leading-[1.0] tracking-[-0.03em] text-brand-ink">
          <SplitText text="One child at a time," as="span" staggerMs={40} />
          {/*
            The space before the `<br>` is load-bearing. Below `sm` the break
            is `display: none`, and without this the two spans butted straight
            together — the mobile hero read "One child at a time,we provide
            hope." (seen at 390x844 in Task 15's Playwright screenshots). When
            the break *is* shown, a trailing space before a line break
            collapses, so it costs nothing at wider widths.
          */}{" "}
          <br className="hidden sm:block" />
          <SplitText text="we provide" as="span" staggerMs={40} delay={0.2} />{" "}
          <span className="relative inline-block">
            <SplitText text="hope." as="span" staggerMs={40} delay={0.28} />
            <Scribble
              variant="circle"
              color="tangerine"
              duration={0.9}
              delay={1}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+3.75rem)] w-[calc(100%+2.5rem)] -translate-x-1/2 -translate-y-1/2 sm:h-[calc(100%+4.75rem)] sm:w-[calc(100%+3.25rem)]"
            />
          </span>
        </h1>

        <p className="animate-fade-up stagger-5 mt-6 max-w-2xl text-lg text-brand-ink-soft md:text-xl">
          {site.heroParagraph}
        </p>

        <div className="animate-fade-up stagger-6 mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <MagneticButton>
            <Link
              to="/our-stories"
              className="inline-flex items-center gap-2 rounded-full bg-brand-sun px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90"
            >
              How We Make a Difference
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </MagneticButton>

          <span className="relative inline-flex items-center">
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener"
              onClick={openDonate}
              className="text-sm font-bold uppercase tracking-wide text-brand-ink underline decoration-brand-ink/30 underline-offset-4 transition hover:text-brand-tangerine-deep"
            >
              Donate
            </a>
            <Scribble
              variant="arrow"
              color="tangerine"
              className="pointer-events-none absolute -right-9 top-3 h-8 w-10 rotate-90 opacity-70 sm:rotate-0"
            />
          </span>
        </div>

        <BackedByRow />
      </div>

      <ScrollCue />
    </section>
  );
}
