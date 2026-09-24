import Seo from "@/components/layout/Seo";
import HomeHero from "@/components/sections/HomeHero";
import HomeAboutStrip from "@/components/sections/HomeAboutStrip";
import HomeSupportsMarquee from "@/components/sections/HomeSupportsMarquee";
import HomeStoriesSlider from "@/components/sections/HomeStoriesSlider";
import HomeRequestFlow from "@/components/sections/HomeRequestFlow";
import HomeImpact from "@/components/sections/HomeImpact";
import HomeAllocationDonut from "@/components/sections/HomeAllocationDonut";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import HomeDonateBand from "@/components/sections/HomeDonateBand";
import { site } from "@/data/site";

const SITE_ORIGIN = "https://4montgomeryskids.org";

/** NGO / Nonprofit501c3 JSON-LD, per docs/BUILD-PROMPT.md §11. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.orgName,
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/images/logo-lockup.png`,
  email: site.contacts.president.email,
  sameAs: [site.facebookUrl],
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: "34864",
    streetAddress: "10421 Motor City Drive",
    addressLocality: "Bethesda",
    addressRegion: "MD",
    postalCode: "20817",
    addressCountry: "US",
  },
  nonprofitStatus: {
    "@type": "NonprofitType",
    value: "Nonprofit501c3",
  },
};

/**
 * HOME `/` — build-prompt §6.1. Stays thin: every section is its own
 * `Home*.tsx` component in src/components/sections/, composed here in the
 * exact order specified (1 through 6, with NEW sections 2b/3b/4b inline).
 */
export default function Home() {
  return (
    <>
      <Seo
        title="4Montgomery's Kids | Helping Foster Children in Montgomery County, MD"
        description="4Montgomery's Kids provides hope and essential opportunities to abused and neglected children and youth in Montgomery County's foster care system."
        path="/"
        jsonLd={jsonLd}
      />

      <HomeHero />
      <HomeAboutStrip />
      <HomeSupportsMarquee />
      <HomeStoriesSlider />
      <HomeRequestFlow />
      <HomeImpact />
      <HomeAllocationDonut />
      <HomeTestimonials />
      <HomeDonateBand />
    </>
  );
}
