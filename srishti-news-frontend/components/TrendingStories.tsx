"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface TrendingStoriesProps {
  articles: Article[];
}

export default function TrendingStories({ articles }: TrendingStoriesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  if (!articles || articles.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Trending Story</h2>
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-500">
          No trending stories available
        </div>
      </div>
    );
  }

  const visible = articles.slice(startIndex, startIndex + visibleCount);
  const canScrollUp = startIndex > 0;
  const canScrollDown = startIndex + visibleCount < articles.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending Story</h2>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canScrollUp}
            className="w-6 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-t disabled:opacity-30 transition"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setStartIndex((i) =>
                Math.min(articles.length - visibleCount, i + 1)
              )
            }
            disabled={!canScrollDown}
            className="w-6 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-b disabled:opacity-30 transition"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((article, i) => {
          const imageUrl = getImageUrl(article.images?.[0]?.url);
          const rank = startIndex + i + 1;
          return (
            <Link
              key={article._id}
              href={`/article/${article._id}`}
              className="group flex gap-3"
            >
              <div className="relative w-24 aspect-video shrink-0 rounded overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                <div className="absolute bottom-0 left-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-tr">
                  {rank}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-primary text-[10px] font-semibold uppercase">
                  {article.category}
                </span>
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition">
                  {article.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
