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

      const transition = document.startViewTransition(() => {
        router.push(href);
      });
      transition.finished.finally(() => {
        delete document.documentElement.dataset.transition;
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [router]);

  return null;
}
