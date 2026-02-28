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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const currentItem = items[currentIndex];
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < items.length - 1;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(items.length - 1, i + 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending Story</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 disabled:opacity-30 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 disabled:opacity-30 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Card */}
        <Link
          href={currentItem.href}
          className="group block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative w-full aspect-video">
            {currentItem.imageUrl ? (
              <Image
                src={currentItem.imageUrl}
                alt={currentItem.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />
            )}
            {/* Rank badge */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full shadow">
              {currentIndex + 1}
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            {/* Title on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-white text-base sm:text-lg font-semibold leading-snug line-clamp-2 drop-shadow-lg">
                {currentItem.title}
              </h4>
            </div>
          </div>
        </Link>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to story ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === currentIndex
                ? "bg-red-600 w-4"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
