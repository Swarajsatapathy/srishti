"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article, Video } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";
import { getYouTubeThumbnail } from "@/lib/youtube";

type PickItem =
  | { type: "article"; data: Article }
  | { type: "video"; data: Video };

interface EditorsPicksProps {
  articles: Article[];
  videos?: Video[];
}

export default function EditorsPicks({ articles, videos = [] }: EditorsPicksProps) {
  const items: PickItem[] = [
    ...articles.map((a) => ({ type: "article" as const, data: a })),
    ...videos.map((v) => ({ type: "video" as const, data: v })),
  ];

  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1)),
    [items.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1)),
    [items.length]
  );

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Editor&apos;s Picks
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl flex-1 min-h-50 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-sm">No editor&apos;s picks available</span>
        </div>
      </div>
    );
  }

  const item = items[current];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Editor&apos;s Picks
        </h2>
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden aspect-video shadow-md flex-1 min-h-50">
        {item.type === "article" ? (
          <ArticleSlide article={item.data} />
        ) : (
          <VideoSlide video={item.data} />
        )}
      </div>
    </div>
  );
}

function ArticleSlide({ article }: { article: Article }) {
  const imageUrl = getImageUrl(article.images?.[0]?.url);
  return (
    <Link href={`/article/${article._id}`} className="group block w-full h-full">
      <div className="relative w-full h-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-base sm:text-lg font-bold leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-white/70 text-sm mt-1">{article.reporter}</p>
        </div>
      </div>
    </Link>
  );
}

function VideoSlide({ video }: { video: Video }) {
  const thumbnail = getYouTubeThumbnail(video.youtubeUrl);
  return (
    <Link href={`/videos/${video._id}`} className="group block w-full h-full">
      <div className="relative w-full h-full">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-base sm:text-lg font-bold leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-white/70 text-sm mt-1">{video.reporter}</p>
        </div>
      </div>
    </Link>
  );
}
