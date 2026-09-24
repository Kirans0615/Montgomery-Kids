import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Scribble from "@/components/motion/Scribble";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Verbatim from docs/site-audit.md §7 Section 4 (the §12 fix restores the
 * missing opening quotation mark — applied below via `&ldquo;`/`&rdquo;`
 * rather than baked into the string, matching HomeAboutStrip/HomeTestimonials
 * convention).
 */
const QUOTE_TEXT =
  "I am writing this letter to display my utmost gratitude for everything your organization has done for me and my brother. I was able to take a shot like any ordinary kid. . . You have given me hope that I am not forgotten.";
const ATTRIBUTION = "L, Foster youth";

const WORDS = QUOTE_TEXT.split(" ");
/** "I am not forgotten." — the brief's tangerine-underline phrase — is exactly the quote's last 4 words. */
const HIGHLIGHT_START = WORDS.length - 4;

/**
 * ABOUT US Section 4 — Quote, per docs/BUILD-PROMPT.md §6.3 Section 4.
 * Full-width `butter` band; the quote sets huge in Fraunces italic and
 * reveals word by word as the section scrolls through view (GSAP-scrubbed
 * opacity); "I am not forgotten" gets the tangerine underline scribble;
 * attribution is set in Caveat.
 *
 * `DIM_OPACITY` was 0.15, which rendered the not-yet-revealed words at
 * 1.33:1 against the butter band — axe flagged them mid-scroll in Task 15's
 * audit, and a reader who simply stops scrolling partway (or lands on
 * #transparency and scrolls up) is left with genuinely unreadable text. At
 * 0.6 the unrevealed state measures 3.88:1, clearing WCAG AA's 3:1 for text
 * this size (30px+) with margin, and the 0.6 → 1 scrub still reads clearly
 * as a word-by-word "lighting up". The whole effect is skipped outright
 * under reduced motion.
 */
const DIM_OPACITY = 0.6;
export default function AboutQuote() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const words = wordRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      if (words.length === 0) return;

      gsap.set(words, { opacity: DIM_OPACITY });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: { each: 0.025, from: "start" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const prefixWords = WORDS.slice(0, HIGHLIGHT_START);
  const highlightWords = WORDS.slice(HIGHLIGHT_START);

  const renderWord = (word: string, index: number) => (
    <span
      key={index}
      ref={(el) => {
        wordRefs.current[index] = el;
      }}
      className="mr-[0.28em] inline-block"
      style={reducedMotion ? undefined : { opacity: DIM_OPACITY }}
    >
      {word}
    </span>
  );

  return (
    <section ref={sectionRef} className="bg-brand-butter py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <p className="font-display text-3xl italic leading-[1.25] tracking-tight text-brand-ink sm:text-4xl md:text-5xl">
          &ldquo;{prefixWords.map((word, index) => renderWord(word, index))}
          <span className="relative inline-block whitespace-nowrap">
            {highlightWords.map((word, index) => renderWord(word, HIGHLIGHT_START + index))}
            <Scribble
              variant="underline"
              color="tangerine"
              className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full sm:-bottom-2"
            />
          </span>
          &rdquo;
        </p>

        <p className="mt-8 font-hand text-2xl text-brand-tangerine-deep">— {ATTRIBUTION}</p>
      </div>
    </section>
  );
}
