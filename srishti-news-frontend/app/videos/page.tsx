import { getVideos } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video News - Srishti News",
  description: "Srishti News ର ସମସ୍ତ ଭିଡ଼ିଓ",
  alternates: {
    canonical: "https://www.srishtinews.in/videos",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VideosPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const data = await getVideos({
    published: "true",
    page: String(page),
    limit: "12",
    sortBy: "publishedAt",
    order: "desc",
  });

  const videos = data?.videos || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b-2 border-primary">
        Video News
      </h1>

      {videos.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <p className="text-base sm:text-lg">କୌଣସି ଭିଡ଼ିଓ ଉପଲବ୍ଧ ନାହିଁ।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              basePath="/videos"
            />
          )}
        </>
      )}
    </div>
  );
}
