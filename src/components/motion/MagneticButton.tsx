import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Max offset in px the content follows the cursor by. */
  strength?: number;
}

function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

/**
 * Magnetic hover wrapper: on pointer-fine devices, the wrapped content
 * follows the cursor up to `strength` px (default 8, per
 * docs/BUILD-PROMPT.md §3.3/§8.7) and springs back to rest on pointer leave.
 * No-op (static) on touch devices and with reduced motion.
 */
export default function MagneticButton({
  children,
  className,
  strength = 8,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current || !hasFinePointer()) return;

    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);

    x.set(Math.max(-strength, Math.min(strength, relX * 0.3)));
    y.set(Math.max(-strength, Math.min(strength, relY * 0.3)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
