import { useEffect, type DependencyList, type RefObject } from "react";
import { loadGsap, type LoadedGsap } from "@/lib/gsap";

/**
 * The async, code-split stand-in for `@gsap/react`'s `useGSAP`.
 *
 * `useGSAP` needs `gsap` at module scope, which forces the library into the
 * importing module's chunk (see `src/lib/gsap.ts` for why that hurt on the
 * eagerly-loaded Home route). This does the same job — run a setup function
 * inside a `gsap.context()` scoped to an element, revert the whole context on
 * cleanup or dependency change — but loads GSAP dynamically first.
 *
 * The `cancelled` flag matters: the effect can be torn down (unmount, a
 * dependency change, React 18 StrictMode's double-invoke in development)
 * while `loadGsap()` is still in flight. Without it, the setup would run
 * against a detached element and leave an orphaned ScrollTrigger pinning a
 * node that is no longer in the document.
 *
 * @param scope   the element to scope selectors and cleanup to
 * @param setup   receives the loaded `{ gsap, ScrollTrigger }`; may return a
 *                cleanup function for non-GSAP state it owns (reverting the
 *                context already kills every tween/ScrollTrigger made inside)
 * @param deps    re-runs setup (reverting the previous context first)
 */
export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  setup: (loaded: LoadedGsap) => void | (() => void),
  deps: DependencyList,
): void {
  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | null = null;
    let teardown: (() => void) | undefined;

    void loadGsap().then((loaded) => {
      if (cancelled || !scope.current) return;
      context = loaded.gsap.context(() => {
        teardown = setup(loaded) ?? undefined;
      }, scope.current);
    });

    return () => {
      cancelled = true;
      teardown?.();
      context?.revert();
    };
    // `setup` is intentionally not a dependency: callers pass an inline
    // closure that changes identity every render, which would thrash the
    // context. `deps` is the explicit re-run signal, exactly as `useGSAP`'s
    // own `dependencies` option works.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
