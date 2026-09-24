import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/layout/Seo";
import StoriesHero from "@/components/sections/StoriesHero";
import StoriesGrid from "@/components/sections/StoriesGrid";
import StoriesVoices from "@/components/sections/StoriesVoices";
import HomeDonateBand from "@/components/sections/HomeDonateBand";
import { storyCards, type StoryCategory } from "@/data/stories";

const SEARCH_DEBOUNCE_MS = 120;
const GRID_SECTION_ID = "story-grid";

/**
 * OUR STORIES `/our-stories` — docs/BUILD-PROMPT.md §6.4. Stays thin: every
 * section is its own `Stories*.tsx` component in src/components/sections/,
 * with the final Donate band reused directly from Home. This route only
 * owns the filter state shared by Section 1 (the story-finder search box +
 * category chips) and Section 2 (the filtered bento grid) — search is
 * debounced 120ms and matches title+body case-insensitively; category chips
 * toggle independently and combine with the search term (AND, not OR).
 */
export default function Stories() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<StoryCategory[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query]);

  const filteredStories = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return storyCards.filter((story) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(story.category);
      const matchesQuery =
        normalizedQuery === "" ||
        story.title.toLowerCase().includes(normalizedQuery) ||
        story.body.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [debouncedQuery, activeCategories]);

  const toggleCategory = (category: StoryCategory) => {
    setActiveCategories((previous) =>
      previous.includes(category)
        ? previous.filter((entry) => entry !== category)
        : [...previous, category],
    );
  };

  const resetFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveCategories([]);
  };

  const scrollToGrid = () => {
    document.getElementById(GRID_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Seo
        title="Our Stories | 4Montgomery's Kids"
        description="Real stories of how, with support from our donors, 4Montgomery's Kids has helped kids in need across Montgomery County's foster care system."
        path="/our-stories"
      />

      <StoriesHero
        query={query}
        onQueryChange={setQuery}
        onSubmit={scrollToGrid}
        activeCategories={activeCategories}
        onToggleCategory={toggleCategory}
        resultCount={filteredStories.length}
        totalCount={storyCards.length}
      />

      <StoriesGrid sectionId={GRID_SECTION_ID} stories={filteredStories} onResetFilters={resetFilters} />

      <StoriesVoices />

      <HomeDonateBand />
    </>
  );
}
