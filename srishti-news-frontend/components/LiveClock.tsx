"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    const initialTimer = setTimeout(() => setNow(new Date()), 0);
    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, []);

  const date = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Loading date...";

  const shortDate = now
    ? now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "-- ---";

  const time = now
    ? now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      {/* Date */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-white">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {/* Full date on tablet+, short date on small mobile */}
        <span className="hidden sm:inline font-medium">{date}</span>
        <span className="sm:hidden font-medium">{shortDate}</span>
      </div>

      {/* Separator */}
      <span className="text-white/60">|</span>

      {/* Time */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-white">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-semibold font-mono tracking-tight">{time}</span>
      </div>
    </div>
  );
}
