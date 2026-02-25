import { getVideoById } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

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
    description: video.description,
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/videos" className="hover:text-primary transition">
          ଭିଡ଼ିଓ
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
        {video.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
        <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded">
          {video.category}
        </span>
        <span>{video.reporter}</span>
        <span>{date}</span>
        <span>{video.views} views</span>
      </div>

      {/* Video Player - YouTube iframe */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-black">
        <iframe
          src={embedUrl}
          title={video.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed">
        {video.description}
      </p>

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
          {video.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
