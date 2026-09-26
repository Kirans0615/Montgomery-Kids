import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import MagneticButton from "@/components/motion/MagneticButton";
import IllustratedCover from "@/components/ui/illustrated-cover";
import Img from "@/components/ui/img";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { useGsapContext } from "@/hooks/useGsapContext";
import { homeStorySlides, type HomeStorySlide } from "@/data/stories";
import { DONATE_URL, openDonate } from "@/lib/donate";
import { resolveCoverIcon } from "@/lib/coverIcons";
import { cn } from "@/lib/utils";

/** Fixed intrinsic dims for the photo-covered slides (public/images/*.jpg). */
const PHOTO_DIMS: Record<string, { width: number; height: number }> = {
  "graduate.jpg": { width: 509, height: 339 },
  "bike-ride.jpg": { width: 509, height: 339 },
  "peewee-football.jpg": { width: 506, height: 339 },
  "summer-camp-scouts.jpg": { width: 1600, height: 1067 },
  "high-school-classroom.jpg": { width: 1600, height: 1200 },
};

const PIN_DISTANCE_VH = 400;
const DESKTOP_BREAKPOINT_PX = 1024;

/**
 * Matches Tailwind's `lg` breakpoint (1024px) — the story stage pins/scrubs
 * only at that width and up; narrower viewports get the swipeable carousel.
 * Local to this file since no other section needs a JS-side breakpoint
 * check (every other section's responsiveness is plain CSS).
 */
function useIsDesktop(breakpointPx: number): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= breakpointPx,
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const mediaQueryList = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const handleChange = () => setIsDesktop(mediaQueryList.matches);
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [breakpointPx]);

  return isDesktop;
}

function SlideCover({ slide, className }: { slide: HomeStorySlide; className?: string }) {
  if (slide.cover.kind === "illustrated") {
    return (
      <IllustratedCover
        slug={slide.slug}
        icon={resolveCoverIcon(slide.cover.icon)}
        category={slide.tag}
        className={cn("h-full w-full rounded-none", className)}
      />
    );
  }

  const dims = PHOTO_DIMS[slide.cover.image] ?? { width: 509, height: 339 };
  return (
    <Img
      src={slide.cover.image}
      alt={slide.cover.alt}
      width={dims.width}
      height={dims.height}
      /*
       * Deliberately NOT `priority`. These covers sit in the "Some of Our
       * Stories" stage, three full sections below the fold — but `priority`
       * made them `loading="eager" fetchpriority="high"`, so three of them
       * (99 kB combined) downloaded in parallel with the JS the first paint
       * depends on. Lazy is correct here; the hero poster above is the only
       * image on this page that earns priority.
       */
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

/**
 * `reachable={false}` takes this link out of the tab order. The mobile
 * carousel marks every off-screen slide `aria-hidden`, and `aria-hidden`
 * alone doesn't stop a descendant link being tabbed to — keyboard users
 * would land on a Donate button that screen readers don't announce and that
 * isn't visible (axe `aria-hidden-focus`, found on Home at 390px and 768px
 * in Task 15's audit).
 */
function SlideDonateButton({ slide, reachable = true }: { slide: HomeStorySlide; reachable?: boolean }) {
  if (!slide.donate) return null;
  return (
    <a
      // Reads the shared DONATE_URL constant directly (like every other
      // Donate control site-wide) rather than slide.donate.url — the data
      // still carries a url field (same value), kept for callers other than
      // this button, but this href is the single source of truth.
      href={DONATE_URL}
      target="_blank"
      rel="noopener"
      tabIndex={reachable ? undefined : -1}
      onClick={openDonate}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-sun px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-sun/90"
    >
      {slide.donate.label}
    </a>
  );
}

/** ------------------------------------------------------------------ */
/** Desktop: pinned, scroll-scrubbed story stage.                       */
/** ------------------------------------------------------------------ */

function DesktopStoryStage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lenis = useLenis();
  const total = homeStorySlides.length;
  const activeSlide = homeStorySlides[activeIndex];

  useGsapContext(
    stageRef,
    ({ ScrollTrigger }) => {
      if (!stageRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (PIN_DISTANCE_VH / 100)}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const index = Math.min(total - 1, Math.floor(self.progress * total));
          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        },
      });

      scrollTriggerRef.current = trigger;

      // No explicit cleanup needed: `useGsapContext` reverts the whole
      // `gsap.context()` this ran inside, which kills every ScrollTrigger
      // created within it. Clearing the ref is still worth doing so
      // `scrollToSlide` can't act on a dead trigger after a re-run.
      return () => {
        scrollTriggerRef.current = null;
      };
    },
    [total],
  );

  const scrollToSlide = (index: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;
    const target = trigger.start + (index / total) * (trigger.end - trigger.start) + 2;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <div ref={stageRef} className="relative hidden h-screen w-full overflow-hidden bg-brand-cream lg:block">
      <div className="grid h-full grid-cols-2">
        {/* Left: image stage — Ken Burns zoom + clip-path wipe between slides. */}
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide.slug}
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 0 0 0)", opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
            >
              <motion.div
                className="h-full w-full"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 6, ease: "easeOut" }}
              >
                <SlideCover slide={activeSlide} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: slide number, title, body, button. */}
        <div className="relative flex h-full flex-col justify-center px-12 xl:px-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                aria-hidden="true"
                className="block select-none font-display text-[7rem] font-bold leading-none text-transparent xl:text-[9rem]"
                style={{ WebkitTextStroke: "2px rgba(28,42,32,0.18)" }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-hand text-2xl text-brand-tangerine-deep">{activeSlide.tag}</p>
              <h3 className="mt-2 max-w-lg font-display text-h3 text-brand-ink">{activeSlide.title}</h3>
              <p className="mt-4 max-w-lg text-body text-brand-ink-soft">{activeSlide.body}</p>
              <SlideDonateButton slide={activeSlide} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Vertical progress rail. */}
      <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center xl:right-10">
        {homeStorySlides.map((slide, index) => (
          <button
            key={slide.slug}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to story ${index + 1}: ${slide.title}`}
            aria-current={index === activeIndex}
            className="group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep"
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-3 w-3 rounded-full border-2 border-brand-ink/40 transition-all",
                index === activeIndex ? "scale-125 border-brand-tangerine bg-brand-tangerine" : "bg-transparent group-hover:border-brand-ink",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** ------------------------------------------------------------------ */
/** Mobile/tablet: swipeable card carousel.                             */
/** ------------------------------------------------------------------ */

function MobileStoryCarousel() {
  const [index, setIndex] = useState(0);
  const total = homeStorySlides.length;

  const goTo = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));

  const handleDragEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") goTo(index + 1);
    if (event.key === "ArrowLeft") goTo(index - 1);
  };

  return (
    <div
      className="lg:hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Some of Our Stories"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="overflow-hidden px-6">
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          {homeStorySlides.map((slide, slideIndex) => (
            <div key={slide.slug} className="w-full shrink-0 px-1" aria-hidden={slideIndex !== index}>
              <div className="overflow-hidden rounded-[28px] bg-brand-paper ring-1 ring-brand-ink/10 shadow-[0_30px_60px_-20px_rgba(28,42,32,.25)]">
                <div className="aspect-[4/3] w-full">
                  <SlideCover slide={slide} />
                </div>
                <div className="p-6">
                  <p className="font-hand text-xl text-brand-tangerine-deep">{slide.tag}</p>
                  <h3 className="mt-1 font-display text-h3 text-brand-ink">{slide.title}</h3>
                  <p className="mt-3 text-body text-brand-ink-soft">{slide.body}</p>
                  <SlideDonateButton slide={slide} reachable={slideIndex === index} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous story"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        {/*
          The visible dot stays 10px, but each button is padded out to a 44x44
          hit area. At the bare 10x10 these failed both §10's 44px touch-target
          rule and Lighthouse's `target-size` audit ("10px by 10px, should be
          at least 24px by 24px") — the single audit blocking a 100
          Accessibility score on mobile Home in Task 15's first run.
        */}
        <div className="flex items-center">
          {homeStorySlides.map((slide, dotIndex) => (
            <button
              key={slide.slug}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to story ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-2.5 rounded-full transition-all",
                  dotIndex === index ? "w-6 bg-brand-tangerine" : "w-2.5 bg-brand-ink/25",
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          aria-label="Next story"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-ink/15 text-brand-ink disabled:opacity-30"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------------------------ */
/** Reduced motion: fully static stacked list (no pin, no drag).        */
/** ------------------------------------------------------------------ */

function StackedStoryList() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 lg:px-8">
      {homeStorySlides.map((slide, index) => (
        <article
          key={slide.slug}
          className="grid grid-cols-1 gap-6 overflow-hidden rounded-[28px] bg-brand-paper ring-1 ring-brand-ink/10 sm:grid-cols-2"
        >
          <div className="aspect-[4/3] w-full sm:aspect-auto">
            <SlideCover slide={slide} />
          </div>
          <div className="flex flex-col justify-center p-6">
            <span className="font-display text-3xl font-bold text-brand-ink/20">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-hand text-xl text-brand-tangerine-deep">{slide.tag}</p>
            <h3 className="mt-1 font-display text-h3 text-brand-ink">{slide.title}</h3>
            <p className="mt-3 text-body text-brand-ink-soft">{slide.body}</p>
            <SlideDonateButton slide={slide} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HomeStoriesSlider() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(DESKTOP_BREAKPOINT_PX);

  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">Some of Our Stories</h2>
          <Scribble variant="squiggle" color="tangerine" className="mt-3 h-3 w-32" />
        </Reveal>
      </div>

      <div className="mt-12">
        {reducedMotion ? (
          <StackedStoryList />
        ) : isDesktop ? (
          <DesktopStoryStage />
        ) : (
          <MobileStoryCarousel />
        )}
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6 text-center lg:px-8">
        <MagneticButton className="inline-block">
          <Button asChild size="lg">
            <Link to="/our-stories">Read More Stories</Link>
          </Button>
        </MagneticButton>
      </div>
    </section>
  );
}
