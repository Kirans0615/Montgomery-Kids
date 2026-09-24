export interface PostProgressBarProps {
  /** 0–100, from `useReadingProgress`. */
  progress: number;
}

/**
 * The post's reading-progress bar: a thin `sun`-colored line fixed to the
 * very top of the viewport, per docs/BUILD-PROMPT.md §6.7. Sits above the
 * navbar (`z-[60]` vs. the navbar's `z-50`) so it stays visible whether the
 * navbar is transparent or its scrolled-opaque state.
 */
export default function PostProgressBar({ progress }: PostProgressBarProps) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-brand-ink/10"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-brand-sun"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
