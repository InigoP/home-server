"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Globally intercepts same-origin <a> clicks and wraps the Next.js navigation
 * in document.startViewTransition(), so the browser snapshots the outgoing
 * page and animates the slide via CSS pseudo-elements in globals.css.
 *
 * Gracefully no-ops on browsers without View Transitions support.
 */
export default function ViewTransitionLinks() {
  const router = useRouter();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!("startViewTransition" in document)) return;

    function handleClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }
      if (link.target && link.target !== "" && link.target !== "_self") return;

      // Capture phase: this fires before React's synthetic event system sees
      // the click, so we can beat Next.js Link's own router.push.
      e.preventDefault();
      e.stopPropagation();

      const back = link.dataset.direction === "back";
      if (back) document.documentElement.dataset.transition = "back";

      // Hot path (prefetch cache hit): router.push resolves in ~5ms — proceed
      //   immediately, don't pay the extra paint-frame cost.
      // Cold path (cache expired after idle): router.push is slow — wait for
      //   navigation to commit AND one paint frame so the transition animates
      //   against the real new DOM instead of flashing stale content.
      // Both capped at 1s so we never trip Chrome's 4s view-transition timeout.
      const transition = document.startViewTransition(async () => {
        const navigated = Promise.resolve(router.push(href));
        const result = await Promise.race([
          navigated.then(() => "fast" as const),
          new Promise<"slow">((r) => setTimeout(() => r("slow"), 15)),
        ]);
        if (result === "slow") {
          await Promise.race([
            navigated.then(
              () => new Promise<void>((r) => requestAnimationFrame(() => r()))
            ),
            new Promise<void>((r) => setTimeout(r, 1000)),
          ]);
        }
      });
      // `finished` rejects if the transition is skipped/aborted; swallow it so
      // it doesn't bubble to window.onunhandledrejection.
      transition.finished
        .catch(() => {})
        .finally(() => {
          delete document.documentElement.dataset.transition;
        });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [router]);

  return null;
}
