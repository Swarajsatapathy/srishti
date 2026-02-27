"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";

interface LatestNewsCarouselProps {
  articles: Article[];
}

export default function LatestNewsCarousel({ articles }: LatestNewsCarouselProps) {
  const pageSize = 3;
  const maxStart = Math.max(0, articles.length - pageSize);
  const [startIndex, setStartIndex] = useState(0);

  const visibleArticles = useMemo(
    () => articles.slice(startIndex, startIndex + pageSize),
    [articles, startIndex]
  );

  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  return (
    <section className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b-2 border-primary">
        <h2 className="text-xl sm:text-2xl font-bold">ତାଜା ଖବର</h2>
        {articles.length > pageSize && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              aria-label="Previous latest"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
              disabled={!canNext}
              aria-label="Next latest"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visibleArticles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
