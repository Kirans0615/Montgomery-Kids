import { BLOG_FILTER_VALUES, type BlogFilterValue } from "@/lib/blog";
import { cn } from "@/lib/utils";

export interface BlogFiltersProps {
  value: BlogFilterValue;
  onChange: (value: BlogFilterValue) => void;
  counts: Record<BlogFilterValue, number>;
}

/**
 * BLOG category filter tabs — All · News · Success Stories · Donor
 * Spotlight · What your money supports, per docs/BUILD-PROMPT.md §6.6.
 *
 * Deliberately NOT Radix `Tabs`. Radix's `Tabs.Trigger` always emits
 * `aria-controls` pointing at the `Tabs.Content` panel it owns — and this
 * control has no panel, because the grid it filters (`BlogGrid`) is a
 * *sibling*, not a child. That left every trigger with an `aria-controls`
 * referencing an id that exists nowhere in the document, which axe-core
 * reports as `aria-valid-attr-value` at **critical** impact (found on /blog
 * at all three viewports in Task 15's audit — the only critical-impact
 * violation on the site).
 *
 * The honest ARIA pattern for "a row of buttons that filter a list
 * elsewhere on the page" is a labelled group of toggle buttons with
 * `aria-pressed`, which is what this is. Visual design, keyboard behaviour
 * (Tab between buttons, Enter/Space to activate) and the active-pill styling
 * are unchanged; dropping the dependency also removes @radix-ui/react-tabs
 * from the bundle, since nothing else in the site used it.
 */
export default function BlogFilters({ value, onChange, counts }: BlogFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter posts by category"
      className="flex flex-wrap justify-start gap-1.5"
    >
      {BLOG_FILTER_VALUES.map((filterValue) => {
        const isActive = filterValue === value;
        return (
          <button
            key={filterValue}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filterValue)}
            className={cn(
              // min-h-11 keeps every chip at the §10 44px touch-target floor.
              "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep",
              isActive
                ? "border-transparent bg-brand-sun text-brand-ink"
                : "border-brand-ink/15 bg-brand-paper text-brand-ink-soft hover:bg-brand-butter/50",
            )}
          >
            {filterValue}
            <span className={cn("ml-1.5", isActive ? "text-brand-ink/80" : "text-brand-ink-soft/80")}>
              {counts[filterValue]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
