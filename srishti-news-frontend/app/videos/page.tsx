import { getVideos } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ଭିଡ଼ିଓ - Srishti News",
  description: "Srishti News ର ସମସ୍ତ ଭିଡ଼ିଓ",
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary">
        ଭିଡ଼ିଓ
      </h1>

      {videos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">କୌଣସି ଭିଡ଼ିଓ ଉପಲବ୍ଧ ନାହିଁ।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
