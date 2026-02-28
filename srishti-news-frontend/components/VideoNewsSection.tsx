"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/lib/types";
import { getYouTubeThumbnail } from "@/lib/youtube";

interface VideoNewsSectionProps {
  videos: Video[];
}

export default function VideoNewsSection({ videos }: VideoNewsSectionProps) {
  const [currentVideo, setCurrentVideo] = useState(0);

  const video = videos?.[currentVideo];

  const prevVideo = () =>
    setCurrentVideo((c) => (c === 0 ? videos.length - 1 : c - 1));
  const nextVideo = () =>
    setCurrentVideo((c) => (c === videos.length - 1 ? 0 : c + 1));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Video News
        </h2>
        {videos && videos.length > 1 && (
          <div className="flex gap-1.5">
            <button
              onClick={prevVideo}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextVideo}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {video ? (
          <Link href={`/videos/${video._id}`} className="block group h-full">
            <div className="relative rounded-xl overflow-hidden h-full min-h-55 shadow-md">
              {getYouTubeThumbnail(video.youtubeUrl) ? (
                <Image
                  src={getYouTubeThumbnail(video.youtubeUrl)}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                  Video
                </span>
                <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl h-full min-h-55 flex flex-col items-center justify-center text-gray-400">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">No video news available</span>
          </div>
        )}
      </div>
    </div>
  );
}
