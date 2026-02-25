import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface VideoCardProps {
  video: Video;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = getImageUrl(video.thumbnailUrl);
  const date = new Date(
    video.publishedAt || video.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/videos/${video._id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
        <div className="relative aspect-video">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-primary/80 transition">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Duration badge */}
          {video.duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-primary text-xs font-semibold uppercase">
            {video.category}
          </span>
          <h3 className="font-bold text-base leading-snug line-clamp-2 mt-1 group-hover:text-primary transition">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{date}</span>
            <span>&bull;</span>
            <span>{video.views} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
