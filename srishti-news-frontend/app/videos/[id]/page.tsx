import { getVideoById } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import ShareButtons from "@/components/ShareButtons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) return { title: "Video Not Found" };
  return {
    title: `${video.title} - Srishti News`,
    description: video.content,
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) notFound();

  const date = new Date(
    video.publishedAt || video.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-baseline gap-1.5 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/" className="hover:text-primary transition whitespace-nowrap">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/videos" className="hover:text-primary transition">
          ଭିଡ଼ିଓ
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 sm:mb-4">
        {video.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        {video.district && (
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded">
            {video.district}
          </span>
        )}
        <span>{video.reporter}</span>
        <span>{date}</span>
        <span>{video.views} views</span>
      </div>

      {/* Share Buttons */}
      <div className="mb-4 sm:mb-6">
        <ShareButtons url={`/videos/${id}`} title={video.title} />
      </div>

      {/* Video Player - YouTube iframe */}
      <div className="relative w-[calc(100%+1.5rem)] -mx-3 sm:w-[calc(100%+2rem)] sm:-mx-4 md:w-full md:mx-0 aspect-video overflow-hidden md:rounded-lg mb-4 sm:mb-6 bg-black">
        <iframe
          src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
          title={video.title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Content */}
      {video.content && (
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          {video.content}
        </p>
      )}

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
          {video.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
