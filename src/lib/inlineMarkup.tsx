import type { ReactNode } from "react";

/**
 * Tiny regex-based renderer for the `**bold**` / `*italic*` markup embedded
 * in `src/data/posts.ts` body text (`p`, `quote`, `ul` items, `footnote`),
 * per docs/BUILD-PROMPT.md §6.7 / plan Task 13: "a small regex-based
 * function is fine — no `dangerouslySetInnerHTML`, no markdown library
 * needed for this narrow a grammar." Every span becomes a real `<strong>`/
 * `<em>` React element, never raw HTML.
 *
 * Grammar actually present in posts.ts (confirmed by inspection before
 * writing this):
 * - Simple single spans: "We have supported **over 2,600 children** in
 *   foster care..."
 * - Multiple separate spans in the same string: "Well for K. who was
 *   transitioning out of care *and* moving from a group home to her first
 *   apartment *and* starting a new job..." (Spring Forward with
 *   4Montgomery's Kids) — two independent `*italic*` spans, not nested.
 * - A span that is the entire string, start to end: the Guaranteed Income
 *   footnote, "*Of course we are also staying true to our core
 *   mission...next newsletter.*".
 * - No nesting (`**a *b* c**`) and no unmatched/stray asterisks anywhere:
 *   every single line in posts.ts has an even count of `*` characters
 *   (verified with a script before writing this), so a split-based regex
 *   that prefers the two-asterisk (`**...**`) alternative before the
 *   single-asterisk one handles every real case with no hand-rolled
 *   tokenizer needed.
 */
export function renderInlineMarkup(text: string): ReactNode[] {
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((segment) => segment !== "");

  return segments.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={`b-${index}`}>{segment.slice(2, -2)}</strong>;
    }
    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={`i-${index}`}>{segment.slice(1, -1)}</em>;
    }
    return segment;
  });
}
