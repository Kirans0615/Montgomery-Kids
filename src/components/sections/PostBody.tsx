import Img from "@/components/ui/img";
import PostYouTubeEmbed from "@/components/sections/PostYouTubeEmbed";
import type { PostBlock } from "@/data/posts";
import { renderInlineMarkup } from "@/lib/inlineMarkup";

export interface PostBodyProps {
  body: PostBlock[];
}

/**
 * Hand-drawn tick that reads as both a checkmark and a leaf (mirrors
 * `ProgramsHero.tsx`'s `LEAF_CHECK_PATH` exactly, for visual consistency
 * with the "what your money supports" list elsewhere on the site).
 * Duplicated here as a static (non-animated) mark rather than imported,
 * since `ProgramsHero` is a page-specific Task 6 component, not a shared
 * one, and importing it here would introduce cross-page coupling for a
 * six-point SVG path.
 */
const LEAF_CHECK_PATH = "M2.5 12.8 C 5 12, 7.5 14.5, 9.5 18 C 12.5 12, 16.5 5.5, 21 2.5";

function LeafCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-1 h-4 w-4 shrink-0 text-brand-leaf" aria-hidden="true">
      <path
        d={LEAF_CHECK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostParagraph({ text }: { text: string }) {
  return <p className="text-body leading-relaxed text-brand-ink-soft">{renderInlineMarkup(text)}</p>;
}

function PostHeading({ text }: { text: string }) {
  return (
    <h3 className="font-display text-h3 text-brand-ink">{renderInlineMarkup(text)}</h3>
  );
}

function PostList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-body leading-relaxed text-brand-ink-soft">
          <LeafCheckIcon />
          <span>{renderInlineMarkup(item)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Pull-quote styling, per docs/BUILD-PROMPT.md §6.7: "a big tangerine quote
 * mark" set behind the quoted text, on a soft `butter` panel.
 */
function PostQuote({ text, cite }: { text: string; cite?: string }) {
  return (
    <blockquote className="relative rounded-2xl bg-brand-butter/50 py-8 pl-14 pr-6 sm:pl-20 sm:pr-10">
      <span
        aria-hidden="true"
        className="absolute left-3 top-1 select-none font-display text-7xl leading-none text-brand-tangerine/50 sm:left-5 sm:text-8xl"
      >
        &ldquo;
      </span>
      <p className="font-display text-xl italic leading-snug text-brand-ink sm:text-2xl">
        {renderInlineMarkup(text)}
      </p>
      {cite && <cite className="mt-4 block font-hand text-xl not-italic text-brand-tangerine-deep">— {cite}</cite>}
    </blockquote>
  );
}

function PostFootnote({ text }: { text: string }) {
  return (
    <p className="border-t border-brand-ink/10 pt-5 text-sm italic leading-relaxed text-brand-ink-soft/80">
      {renderInlineMarkup(text)}
    </p>
  );
}

/**
 * `image` blocks per the `PostBlock` union — never actually emitted by
 * `src/data/posts.ts` today (confirmed by inspection: the fragile
 * Gmail-proxy-hosted inline images from the 2018–2019 posts were dropped
 * entirely when the post bodies were transcribed, per that file's own
 * header comment, rather than represented as `image` blocks with a broken
 * `src`). Implemented here anyway for the union's type-safety/exhaustiveness
 * and so a future post with a real local `public/images/` asset renders
 * correctly without touching this file again.
 */
function PostImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl ring-1 ring-brand-ink/10">
      <Img src={src} alt={alt} width={960} height={640} className="h-full w-full object-cover" />
    </figure>
  );
}

/**
 * Renders a post's full `PostBlock[]` body, per docs/BUILD-PROMPT.md §6.7.
 * Every block type gets its own vertical rhythm from the parent's `gap`
 * (not individual margins), so spacing between e.g. a paragraph and a
 * following pull-quote stays consistent regardless of block order.
 */
export default function PostBody({ body }: PostBodyProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {body.map((block, index) => {
        switch (block.type) {
          case "p":
            return <PostParagraph key={index} text={block.text} />;
          case "h3":
            return <PostHeading key={index} text={block.text} />;
          case "ul":
            return <PostList key={index} items={block.items} />;
          case "quote":
            return <PostQuote key={index} text={block.text} cite={block.cite} />;
          case "video":
            return <PostYouTubeEmbed key={index} youtubeId={block.youtubeId} />;
          case "image":
            return <PostImage key={index} src={block.src} alt={block.alt} />;
          case "footnote":
            return <PostFootnote key={index} text={block.text} />;
          default: {
            const exhaustiveCheck: never = block;
            return exhaustiveCheck;
          }
        }
      })}
    </div>
  );
}
