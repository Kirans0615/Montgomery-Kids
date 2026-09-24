import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGsapContext } from "@/hooks/useGsapContext";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** How far (in %) the content travels from -speed to +speed as it scrolls through the trigger. */
  speed?: number;
  start?: string;
  end?: string;
}

/**
 * GSAP ScrollTrigger-scrubbed vertical parallax wrapper, per
 * docs/BUILD-PROMPT.md §8.6, used for images and background blobs. Disabled
 * entirely with reduced motion — content sits static in place, per §10/§13.
 */
export default function Parallax({
  children,
  className,
  speed = 15,
  start = "top bottom",
  end = "bottom top",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGsapContext(
    ref,
    ({ gsap }) => {
      if (reducedMotion || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub: true,
          },
        },
      );
    },
    [reducedMotion, speed, start, end],
  );

  return (
    <div ref={ref} className={cn(!reducedMotion && "will-change-transform", className)}>
      {children}
    </div>
  );
}
