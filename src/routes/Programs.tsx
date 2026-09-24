import Seo from "@/components/layout/Seo";
import ProgramsHero from "@/components/sections/ProgramsHero";
import ProgramsRequestBand from "@/components/sections/ProgramsRequestBand";
import ProgramsBentoGrid from "@/components/sections/ProgramsBentoGrid";
import HomeAllocationDonut from "@/components/sections/HomeAllocationDonut";
import HomeDonateBand from "@/components/sections/HomeDonateBand";

/**
 * PROGRAMS `/programs` — docs/BUILD-PROMPT.md §6.5. Stays thin: every
 * section is its own `Programs*.tsx` component in src/components/sections/,
 * composed here in order (Sections 1, 2, NEW 3), with the allocation donut
 * (NEW Section 4) and the donate band (Section 5) reused directly from Home
 * rather than rebuilt, exactly as the brief specifies.
 */
export default function Programs() {
  return (
    <>
      <Seo
        title="Programs | 4Montgomery's Kids"
        description="From summer camp fees to scholarships, guaranteed income for youth aging out of foster care, and Project Turkey — see exactly what your donation supports."
        path="/programs"
      />

      <ProgramsHero />
      <ProgramsRequestBand />
      <ProgramsBentoGrid />
      <HomeAllocationDonut />
      <HomeDonateBand />
    </>
  );
}
