"use client";

import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/lib/types";
import { getYouTubeThumbnail } from "@/lib/youtube";
import ShareButtons from "@/components/ShareButtons";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnail = getYouTubeThumbnail(video.youtubeUrl);
  const date = new Date(
    video.publishedAt || video.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
        <Link href={`/videos/${video._id}`}>
          <div className="relative aspect-video overflow-hidden">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-red-600/80 transition-colors duration-200">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
          <Link href={`/videos/${video._id}`}>
            <h3 className="font-bold text-[15px] sm:text-base leading-snug line-clamp-2 mt-1 group-hover:text-primary transition">
              {video.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-600 mt-1.5 truncate">
            {video.district && <span>{video.district} • </span>}
            {video.reporter}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600">
              <span>{date}</span>
              <span>&bull;</span>
              <span>{video.views} views</span>
            </div>
            <ShareButtons
              url={`/videos/${video._id}`}
              title={video.title}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
