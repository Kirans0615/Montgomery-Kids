import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, MapPin, Repeat, Target, type LucideIcon } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/data/site";
import { publicUrl } from "@/lib/publicUrl";

gsap.registerPlugin(ScrollTrigger);

/**
 * The three "About" blurbs, verbatim from docs/site-audit.md §7 Section 1
 * (build-prompt §6.3 Section 1). Icons per build-prompt §6.3 (B): Target,
 * Repeat (the brief's "Repeat/InfinityIcon" choice), MapPin.
 */
const BLURBS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Target,
    title: "Our Mission",
    text: site.mission,
  },
  {
    icon: Repeat,
    title: "Meeting Ongoing Needs",
    text: "As long as there are children in foster care, demand for our support will never end.",
  },
  {
    icon: MapPin,
    title: "Serving the local community",
    text: "We work directly with county social workers to fill the needs they have identified for children in their care.",
  },
];

function BlurbCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-brand-cream/15 bg-brand-paper/10 p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,.55)] backdrop-blur-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-sun/90 text-brand-ink">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
      </div>
      {/*
        Not a real document heading — these are card labels inside the hero,
        not page sections, and the page's only heading before this point is
        the H1 ("About Us"). A `<h4>` here would skip straight from H1 to H4
        (WCAG 1.3.1/2.4.6: heading levels should only ever increase by one),
        so this is a styled paragraph carrying the same visual weight
        instead of an invented `<h2>`/`<h3>` that doesn't correspond to real
        page structure.
      */}
      <p className="mt-4 font-display text-lg font-semibold text-brand-cream">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-brand-cream/80">{text}</p>
    </div>
  );
}

/**
 * ABOUT US Section 1 — Hero, per docs/BUILD-PROMPT.md §6.3 Section 1.
 * `double-dutch.jpg` background with a slow scroll-scale and a strong
 * ink→transparent gradient (contact/CTA column stays legible over the
 * photo); H1 "About Us" rises letter by letter; the three blurbs are
 * frosted-glass cards stacked on the right with a staggered entrance.
 */
export default function AboutHero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !bgRef.current) return;

      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-ink py-32 pt-40 md:py-40 md:pt-48"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <picture>
          <source type="image/webp" srcSet={publicUrl("images/opt/double-dutch-960.webp")} />
          <img
            src={publicUrl("images/double-dutch.jpg")}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-brand-ink/30" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <SplitText
            text="About Us"
            as="h1"
            by="char"
            staggerMs={28}
            className="font-display text-hero leading-[1.0] tracking-[-0.03em] text-brand-cream"
          />

          <p className="animate-fade-up stagger-4 mt-6 max-w-2xl text-lg text-brand-cream/85 md:text-xl">
            {site.orgName} is a 501(c)3 nonprofit working to create a brighter future for abused
            and neglected children and young adults in Montgomery County, MD.
          </p>

          <p className="animate-fade-up stagger-5 mt-5 max-w-2xl text-sm text-brand-cream/70 md:text-base">
            For Questions or Comments, please contact President: {site.contacts.president.name}{" "}
            <a
              href={`mailto:${site.contacts.president.email}`}
              className="font-semibold text-brand-cream underline decoration-brand-cream/40 underline-offset-4 hover:text-brand-sun"
            >
              {site.contacts.president.email}
            </a>{" "}
            or Board Chair: {site.contacts.boardChair.name}{" "}
            <a
              href={`mailto:${site.contacts.boardChair.email}`}
              className="font-semibold text-brand-cream underline decoration-brand-cream/40 underline-offset-4 hover:text-brand-sun"
            >
              {site.contacts.boardChair.email}
            </a>
          </p>

          <MagneticButton className="animate-fade-up stagger-6 mt-8 inline-block">
            <Button asChild size="lg">
              <Link to="/our-stories">
                View Our Stories
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
        </div>

        <Reveal stagger delay={0.2} className="grid gap-5">
          {BLURBS.map((blurb) => (
            <BlurbCard key={blurb.title} {...blurb} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
