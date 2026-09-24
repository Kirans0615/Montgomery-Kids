import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  maxTilt?: number;
}

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches;
}

/** Fixed diameter (px) of the static specular-highlight gradient blob. */
const GLOW_SIZE = 220;

/**
 * 3D tilt-on-hover wrapper (max 6° default) with a moving specular
 * highlight that follows the cursor, per docs/BUILD-PROMPT.md §3.3/§8.8.
 *
 * Per §8's performance guardrail ("animate only transform/opacity/clip-
 * path"), the highlight is a fixed-size, statically-styled radial-gradient
 * blob — its `background` is set once and never changes. Only its position
 * (via framer-motion's `x`/`y` style shorthand, which resolves to
 * `transform: translate(...)`) and its `opacity` (hover show/hide, via a
 * plain CSS transition — also compositor-only) ever animate, so the
 * pointer-move handler never triggers a repaint.
 *
 * Tilt and highlight are both off on touch devices and with reduced motion.
 */
export default function TiltCard({ children, className, maxTilt = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 300,
    damping: 25,
  });

  // Position of the (fixed-size) glow blob, centered on the pointer.
  const glowX = useSpring(
    useTransform(mouseX, (latest) => latest - GLOW_SIZE / 2),
    { stiffness: 300, damping: 25 },
  );
  const glowY = useSpring(
    useTransform(mouseY, (latest) => latest - GLOW_SIZE / 2),
    { stiffness: 300, damping: 25 },
  );

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouchDevice()) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    px.set(offsetX / rect.width);
    py.set(offsetY / rect.height);
    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn(
        "group relative overflow-hidden [transform-style:preserve-3d]",
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}
