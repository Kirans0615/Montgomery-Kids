import { Quote } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Scribble from "@/components/motion/Scribble";
import Parallax from "@/components/motion/Parallax";
import TiltCard from "@/components/motion/TiltCard";
import Img from "@/components/ui/img";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { partners, type Partner } from "@/data/partners";
import { cn } from "@/lib/utils";

/** Deterministic per-card parallax speed, varied but stable across renders. */
function speedFor(index: number): number {
  return 10 + (index % 3) * 8;
}

function TestimonialCard({ testimonial, featured = false }: { testimonial: Testimonial; featured?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-brand-paper p-8 ring-1 ring-brand-ink/10 shadow-[0_20px_50px_-25px_rgba(28,42,32,.35)]",
        featured && "sm:p-10",
      )}
    >
      <Quote
        aria-hidden="true"
        className={cn("absolute -left-2 -top-2 text-brand-tangerine/20", featured ? "h-24 w-24" : "h-16 w-16")}
        fill="currentColor"
      />
      <p className={cn("relative text-brand-ink", featured ? "text-lg sm:text-xl" : "text-base")}>
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="relative mt-5 font-hand text-2xl text-brand-tangerine-deep">— {testimonial.attribution}</p>
    </div>
  );
}

function TestimonialsWall() {
  const [featured, ...rest] = testimonials;

  return (
    <>
      {/* Desktop/tablet: featured card + masonry (CSS multi-column) wall. */}
      <div className="hidden sm:block">
        <Reveal>
          <TiltCard>
            <TestimonialCard testimonial={featured} featured />
          </TiltCard>
        </Reveal>

        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {rest.map((testimonial, index) => (
            <div key={testimonial.id} className="mb-6 break-inside-avoid">
              <Parallax speed={speedFor(index)}>
                <TiltCard>
                  <TestimonialCard testimonial={testimonial} />
                </TiltCard>
              </Parallax>
            </div>
          ))}
        </div>
      </div>

      {/*
        Mobile: horizontal snap carousel. `tabIndex={0}` + a group role/label
        make the scroll container reachable and operable with the keyboard's
        arrow keys — a scrollable region that can't be focused is unreachable
        for keyboard-only users (axe `scrollable-region-focusable`, found at
        390px in Task 15's audit).
      */}
      <div
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep sm:hidden"
        tabIndex={0}
        role="group"
        aria-label="Testimonials, scroll sideways for more"
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="w-[85%] shrink-0 snap-center">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    </>
  );
}

function PartnerTile({ partner }: { partner: Partner }) {
  if (!partner.logo) {
    return (
      <div className="flex aspect-[3/2] w-full items-center justify-center rounded-2xl bg-brand-paper p-4 ring-1 ring-brand-ink/10">
        <p className="text-center font-['Oswald'] text-sm font-medium uppercase tracking-wide text-brand-ink">
          {partner.name}
        </p>
      </div>
    );
  }

  const image = (
    <Img
      src={partner.logo}
      alt={partner.alt ?? partner.name}
      width={240}
      height={160}
      className="max-h-16 w-auto object-contain grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
    />
  );

  const content = (
    <div className="group flex aspect-[3/2] w-full items-center justify-center rounded-2xl bg-brand-paper p-6 ring-1 ring-brand-ink/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(28,42,32,.35)]">
      {image}
    </div>
  );

  if (!partner.url) return content;

  return (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
      {content}
    </a>
  );
}

export default function HomeTestimonials() {
  return (
    <section className="bg-brand-mint/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-h2 text-brand-ink">What Others Are Saying About Us</h2>
          <Scribble variant="squiggle" color="tangerine" className="mt-3 h-3 w-32" />
        </Reveal>

        <div className="mt-14">
          <TestimonialsWall />
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
        {/*
          HandWrittenTitle (Task 6) has no way to target a sub-phrase — its
          decorative ellipse always sizes to wrap the whole `title` string.
          The brief wants the ellipse specifically around "Thank You", so
          that's the only text passed to the component; "to Our Community
          Partners" renders immediately after as plain text in the exact
          same H2 typography (font/size/weight/color), pulled up to close
          the component's own generous vertical padding so the two read as
          one continuous heading rather than two disconnected lines.
        */}
        <div className="text-center">
          <HandWrittenTitle title="Thank You" as="h2" />
          <p className="-mt-10 font-display text-4xl tracking-tight text-brand-ink md:-mt-14 md:text-6xl">
            to Our Community Partners
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <PartnerTile key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
