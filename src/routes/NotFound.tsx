import { Link } from "react-router-dom";
import { Compass, Home as HomeIcon } from "lucide-react";
import Seo from "@/components/layout/Seo";
import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";
import Img from "@/components/ui/img";
import { Button } from "@/components/ui/button";

/**
 * 404 — docs/BUILD-PROMPT.md §5/§6.8: `tug-of-war.jpg` background, a Caveat
 * "Oops — this page wandered off", buttons to Home and Our Stories. Also
 * rendered directly (not via redirect) by `Post.tsx` when a `/:year/:month/
 * :slug` URL doesn't match any real post, so it must never itself throw or
 * render blank for any bad params.
 */
export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | 4Montgomery's Kids"
        description="This page doesn't exist. Head back home or explore our stories from Montgomery County's foster care system."
        path="/404"
        noindex
      />

      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-brand-ink px-6 py-28 text-center">
        <div className="absolute inset-0">
          <Img
            src="tug-of-war.jpg"
            alt="Laughing kids pulling together in a game of tug of war"
            width={507}
            height={338}
            priority
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-brand-ink/85 to-brand-ink" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          {/*
            The big "404" is the decorative part; "Oops — this page wandered
            off" is the page's actual title, so that's the `<h1>`. Before
            this the route had no heading at all — every 404 (and every bad
            /:year/:month/:slug, which renders this component directly) shipped
            a page with zero headings, which axe reports as
            `page-has-heading-one` and which leaves screen-reader users with
            nothing to navigate to. The 404 glyph is `aria-hidden` so it isn't
            read out as a stray number before the real message.
          */}
          <Reveal>
            <span aria-hidden="true" className="font-display text-hero text-brand-sun">
              404
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-2 font-hand text-4xl leading-tight text-brand-cream sm:text-5xl">
              Oops — this page wandered off
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-base text-brand-cream/80">
              We couldn&rsquo;t find the page you were looking for, but there&rsquo;s still plenty to see.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>
                <Button asChild size="lg">
                  <Link to="/">
                    <HomeIcon aria-hidden="true" className="h-4 w-4" />
                    Back Home
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="border-brand-cream/40 text-brand-cream hover:bg-brand-cream/10"
                >
                  <Link to="/our-stories">
                    <Compass aria-hidden="true" className="h-4 w-4" />
                    Our Stories
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
