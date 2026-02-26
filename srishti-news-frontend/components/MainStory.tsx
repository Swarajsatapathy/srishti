"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article, Video } from "@/lib/types";
import { getSlugFromOdia } from "@/lib/categories";
import { getImageUrl } from "@/lib/imageUrl";
import { getYouTubeThumbnail } from "@/lib/youtube";

interface MainStoryProps {
  articles: Article[];
  videos: Video[];
}

export default function MainStory({ articles, videos }: MainStoryProps) {
  const [currentArticle, setCurrentArticle] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);

  const article = articles?.[currentArticle];
  const video = videos?.[currentVideo];

  const prevArticle = () =>
    setCurrentArticle((c) => (c === 0 ? articles.length - 1 : c - 1));
  const nextArticle = () =>
    setCurrentArticle((c) => (c === articles.length - 1 ? 0 : c + 1));
  const prevVideo = () =>
    setCurrentVideo((c) => (c === 0 ? videos.length - 1 : c - 1));
  const nextVideo = () =>
    setCurrentVideo((c) => (c === videos.length - 1 ? 0 : c + 1));

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Web News */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Web News</h2>
          {articles && articles.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={prevArticle}
                className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextArticle}
                className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {article ? (
          <Link href={`/article/${article._id}`} className="block group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              {article.images?.[0]?.url ? (
                <Image
                  src={getImageUrl(article.images[0].url)}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded mb-2">
                  {article.category}
                </span>
                <h3 className="text-white text-lg md:text-xl font-bold leading-tight line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-500">
            No web news available
          </div>
        )}
      </div>

      {/* Video News */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Video News</h2>
          {videos && videos.length > 1 && (
            <div className="flex gap-1">
              <button
                onClick={prevVideo}
                className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextVideo}
                className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {video ? (
          <Link href={`/videos/${video._id}`} className="block group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              {getYouTubeThumbnail(video.youtubeUrl) ? (
                <Image
                  src={getYouTubeThumbnail(video.youtubeUrl)}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-primary/90 rounded-full flex items-center justify-center group-hover:bg-primary transition">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg md:text-xl font-bold leading-tight line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-500">
            No video news available
          </div>
        )}
      </div>
    </div>
  );
}
