import { getAdvertisements, getActiveAds } from "@/lib/api";
import { getImageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertisement - Srishti News",
  description: "Srishti News ର ସମସ୍ତ ବିଜ୍ଞାପନ ଏବଂ ପ୍ରଚାର ସୂଚନା",
  alternates: {
    canonical: "https://www.srishtinews.in/advertisement",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdvertisementListingPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const data = await getAdvertisements({
    page: String(page),
    limit: "12",
    sortBy: "createdAt",
    order: "desc",
  });

  // Fallback to active ads if getAdvertisements is empty
  let ads = data?.advertisements || [];
  let pagination = data?.pagination;

  if (ads.length === 0) {
    const activeAds = await getActiveAds();
    if (activeAds && activeAds.length > 0) {
      ads = activeAds;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 pb-3 border-b-2 border-primary gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Advertisement
        </h1>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-full transition"
        >
          <span>Advertise With Us</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Ads grid */}
      {ads.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-200 p-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <p className="text-base sm:text-lg text-gray-700 font-medium mb-1">
            କୌଣସି ବିଜ୍ଞାପନ ଉପଲବ୍ଧ ନାହିଁ।
          </p>
          <p className="text-sm text-gray-500 mb-4">No advertisements available at the moment.</p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Contact for Ad Placement
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ads.map((ad) => {
              const hasImage = ad.images && ad.images.length > 0;
              const hasVideo = ad.videos && ad.videos.length > 0;
              const thumbnail = hasImage ? getImageUrl(ad.images[0].url) : "";
              const videoUrl = hasVideo ? ad.videos[0].url : "";
              const date = new Date(ad.startDate || ad.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Link
                  key={ad._id}
                  href={`/advertisement/${ad._id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : videoUrl ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-400">
                        <span className="text-sm font-semibold">{ad.title}</span>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
                      Ad
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {ad.title}
                    </h2>
                    {ad.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {ad.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span>{date}</span>
                      <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/advertisement"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
