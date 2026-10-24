"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  /**
   * Interval in milliseconds between background refreshes when the page is visible.
   * Defaults to 30,000ms (30 seconds).
   */
  intervalMs?: number;
}

export default function AutoRefresh({ intervalMs = 30000 }: AutoRefreshProps) {
  const router = useRouter();
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    const triggerRefresh = () => {
      const now = Date.now();

      // Avoid rapid consecutive refreshes (e.g., focus and visibilitychange firing closely)
      if (now - lastRefreshRef.current < 4000) {
        return;
      }

      // If the user is currently typing into an input/textarea/select, avoid refreshing to preserve focus
      if (typeof document !== "undefined") {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (
          activeTag === "input" ||
          activeTag === "textarea" ||
          activeTag === "select"
        ) {
          return;
        }
      }

      lastRefreshRef.current = now;
      router.refresh();
    };

    // 1. Periodic background refresh (only runs when the page is visible)
    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        triggerRefresh();
      }
    }, intervalMs);

    // 2. Immediate auto-refresh when user switches back to this tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    const handleFocus = () => {
      triggerRefresh();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, intervalMs]);

  return null;
}
