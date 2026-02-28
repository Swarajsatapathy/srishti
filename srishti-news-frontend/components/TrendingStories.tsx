"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article, Video } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";
import { getYouTubeThumbnail } from "@/lib/youtube";

interface TrendingItem {
  _id: string;
  title: string;
  imageUrl: string;
  href: string;
  publishedAt: string;
}

interface TrendingStoriesProps {
  articles: Article[];
  videos?: Video[];
}

export default function TrendingStories({ articles, videos = [] }: TrendingStoriesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  // Merge articles and videos into a unified list
  const items: TrendingItem[] = [
    ...articles.map((a) => ({
      _id: a._id,
      title: a.title,
      imageUrl: getImageUrl(a.images?.[0]?.url),
      href: `/article/${a._id}`,
      publishedAt: a.publishedAt || a.createdAt,
    })),
    ...videos.map((v) => ({
      _id: v._id,
      title: v.title,
      imageUrl: getYouTubeThumbnail(v.youtubeUrl),
      href: `/videos/${v._id}`,
      publishedAt: v.publishedAt || v.createdAt,
    })),
  ].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (items.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Trending Story</h2>
        <div className="bg-gray-100 rounded-lg h-36 sm:h-48 flex items-center justify-center text-gray-500 text-sm">
          No trending stories available
        </div>
      </div>
    );
  }

  const visible = items.slice(startIndex, startIndex + visibleCount);
  const canScrollPrev = startIndex > 0;
  const canScrollNext = startIndex + visibleCount < items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending Story</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canScrollPrev}
            aria-label="Previous"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setStartIndex((i) =>
                Math.min(items.length - visibleCount, i + 1)
              )
            }
            disabled={!canScrollNext}
            aria-label="Next"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((item, i) => {
          const rank = i + 1;
          return (
            <Link
              key={item._id}
              href={item.href}
              className="group flex gap-3"
            >
              <div className="relative w-20 sm:w-24 aspect-video shrink-0 rounded-md overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />
                )}
                <div className="absolute bottom-0 left-0 bg-primary text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-tr">
                  {rank}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition">
                  {item.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
