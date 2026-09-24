import { useState } from "react";
import { Play } from "lucide-react";

export interface PostYouTubeEmbedProps {
  youtubeId: string;
}

/**
 * Lite-embed facade for a `video` post block, per docs/BUILD-PROMPT.md §6.7
 * (currently used twice, by "Moving to Independence"'s `SdGjQlQfNbU` and
 * `kGPDdpDPDSw`): a static `https://i.ytimg.com/vi/{id}/hqdefault.jpg`
 * thumbnail with a play button, so nothing from YouTube loads (or tracks
 * the visitor) until they actually click. Clicking swaps in a real
 * `youtube-nocookie.com` iframe, autoplaying immediately since that click
 * is the user's own play intent.
 */
export default function PostYouTubeEmbed({ youtubeId }: PostYouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-brand-ink shadow-[0_20px_50px_-24px_rgba(28,42,32,.4)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title="4Montgomery's Kids video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-brand-ink shadow-[0_20px_50px_-24px_rgba(28,42,32,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-leaf-deep focus-visible:ring-offset-2"
    >
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt="Video thumbnail — click to play"
        className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
        loading="lazy"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-brand-ink/10 transition group-hover:bg-brand-ink/20">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-sun text-brand-ink shadow-lg transition group-hover:scale-110">
          <Play aria-hidden="true" className="h-7 w-7 translate-x-0.5" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
