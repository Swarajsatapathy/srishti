"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";

interface FlashTickerProps {
  articles: Article[];
}

export default function FlashTicker({ articles }: FlashTickerProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 py-2">
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
            Flash Story
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <Link
                key={`${article._id}-${i}`}
                href={`/article/${article._id}`}
                className="text-sm text-gray-700 hover:text-primary transition inline-flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
