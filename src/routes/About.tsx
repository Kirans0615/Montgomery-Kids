import Seo from "@/components/layout/Seo";
import AboutHero from "@/components/sections/AboutHero";
import AboutCopy from "@/components/sections/AboutCopy";
import AboutTimeline from "@/components/sections/AboutTimeline";
import AboutTransparency from "@/components/sections/AboutTransparency";
import AboutBoard from "@/components/sections/AboutBoard";
import AboutQuote from "@/components/sections/AboutQuote";
import AboutGetInvolved from "@/components/sections/AboutGetInvolved";
import HomeDonateBand from "@/components/sections/HomeDonateBand";

/**
 * ABOUT US `/about-us` — docs/BUILD-PROMPT.md §6.3. Stays thin: every
 * section is its own `About*.tsx` component in src/components/sections/,
 * composed here in order (Sections 1, 2, NEW 2b, NEW 2c, 3, 4, NEW 5), with
 * the final Donate band reused directly from Home rather than rebuilt.
 */
export default function About() {
  return (
    <>
      <Seo
        title="About Us | 4Montgomery's Kids"
        description="4Montgomery's Kids is a 501(c)3 nonprofit working to create a brighter future for abused and neglected children and young adults in Montgomery County, MD."
        path="/about-us"
      />

      <AboutHero />
      <AboutCopy />
      <AboutTimeline />
      <AboutTransparency />
      <AboutBoard />
      <AboutQuote />
      <AboutGetInvolved />
      <HomeDonateBand />
    </>
  );
}
