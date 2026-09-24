import { cn } from "@/lib/utils";

export interface BlogYearRailProps {
  /** Every distinct year in the full post archive, newest-first, not hardcoded. */
  years: string[];
  /** Years that have at least one post under the current category filter. */
  availableYears: ReadonlySet<string>;
  onJump: (year: string) => void;
}

/**
 * BLOG sticky year jump-list — a sticky rail on desktop only (`lg:` and up;
 * mobile has no room for a side rail, and the grid is short enough there to
 * just scroll), per docs/BUILD-PROMPT.md §6.6.
 *
 * A year with no posts under the active category filter is rendered
 * disabled rather than omitted, so the list of years never re-shuffles as
 * the filter changes — see `BlogGrid`'s comment for the full year-rail /
 * pagination / filter interaction this resolves.
 */
export default function BlogYearRail({ years, availableYears, onJump }: BlogYearRailProps) {
  return (
    <nav
      aria-label="Jump to year"
      className="sticky top-28 hidden self-start lg:block"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-ink-soft/80">
        Jump to
      </p>
      <ul className="flex flex-col gap-1 border-l-2 border-brand-ink/10">
        {years.map((year) => {
          const available = availableYears.has(year);
          return (
            <li key={year}>
              <button
                type="button"
                disabled={!available}
                aria-disabled={!available}
                onClick={() => onJump(year)}
                className={cn(
                  "-ml-0.5 border-l-2 border-transparent px-4 py-1.5 text-left text-sm font-semibold transition",
                  available
                    ? "text-brand-ink-soft hover:border-brand-tangerine hover:text-brand-ink"
                    : "cursor-not-allowed text-brand-ink-soft/30",
                )}
              >
                {year}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
