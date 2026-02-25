"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return <span className="min-w-[360px]">&nbsp;</span>;

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center gap-4">
      {/* Clock icon + time */}
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#1a1a2e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
        <span className="font-mono text-sm tracking-wider">{time}</span>
      </div>
      {/* Date */}
      <span className="text-sm">{date}</span>
    </div>
  );
}
