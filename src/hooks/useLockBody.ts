import { useEffect } from "react";

/**
 * Locks `<body>` scroll while `locked` is true (mobile menu / dialog use
 * case), restoring whatever `overflow` value was previously set once
 * `locked` goes false or the component unmounts.
 */
export function useLockBody(locked: boolean): void {
  useEffect(() => {
    if (!locked) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
