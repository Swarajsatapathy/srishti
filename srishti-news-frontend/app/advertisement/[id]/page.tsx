import { getAdvertisementById } from "@/lib/api";
import { getImageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAdvertisementById(id);
  if (!ad) return { title: "Advertisement Not Found" };

  const ogImage =
    ad.images && ad.images.length > 0
      ? getImageUrl(ad.images[0].url)
      : undefined;

  const description = ad.description || ad.title;

  return {
    title: `${ad.title} - ବିଜ୍ଞାପନ - Srishti News`,
    description,
    openGraph: {
      type: "website",
      title: ad.title,
      description,
      siteName: "Srishti News",
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ad.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: ad.title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: `https://www.srishtinews.in/advertisement/${id}`,
    },
  };
}

export default async function AdvertisementPage({ params }: PageProps) {
  const { id } = await params;
  const ad = await getAdvertisementById(id);

  if (!ad) notFound();

  const date = new Date(
    ad.startDate || ad.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasVideos = ad.videos && ad.videos.length > 0;
  const hasImages = ad.images && ad.images.length > 0;
  const destinationUrl = ad.link?.trim();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-baseline gap-1.5 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/" className="hover:text-primary transition whitespace-nowrap">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-medium">ବିଜ୍ଞାପନ</span>
      </nav>

      {/* Badge & Title */}
      <div className="mb-3">
        <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded mb-2">
          ବିଜ୍ଞାପନ (Advertisement)
        </span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-gray-900">
          {ad.title}
        </h1>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        <span>ପ୍ରକାଶିତ: {date}</span>
        {ad.views !== undefined && <span>{ad.views} views</span>}
        {ad.clicks !== undefined && <span>{ad.clicks} clicks</span>}
      </div>

      {/* Share Buttons */}
      <div className="mb-4 sm:mb-6">
        <ShareButtons url={`/advertisement/${id}`} title={ad.title} />
      </div>

      {/* Featured Media (Video or Primary Image) */}
      {hasVideos ? (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-black shadow-md">
          <video
            src={ad.videos[0].url}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
          />
        </div>
      ) : hasImages ? (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100 shadow-md border border-gray-200">
          <Image
            src={getImageUrl(ad.images[0].url)}
            alt={ad.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      ) : null}

      {/* Description / Content */}
      {ad.description && (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-8 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
          {ad.description}
        </div>
      )}

      {/* Call to Action Button */}
      {destinationUrl && (
        <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              ଅଧିକ ସୂଚନା ପାଇଁ ୱେବସାଇଟ୍ ପରିଦର୍ଶନ କରନ୍ତୁ
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Click below to visit the official website or offer page.
            </p>
          </div>
          <a
            href={destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg shadow transition shrink-0 text-sm sm:text-base"
          >
            <span>Visit Link</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}

      {/* Additional Images Gallery */}
      {ad.images && ad.images.length > 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-900">
            More Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ad.images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
              >
                <Image
                  src={getImageUrl(img.url)}
                  alt={`${ad.title} - image ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact for Ad Placement */}
      <div className="border-t border-gray-200 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 sm:p-5 rounded-xl">
        <div>
          <h4 className="font-bold text-gray-900 text-sm sm:text-base">
            ଆପଣଙ୍କ ବ୍ୟବସାୟର ବିଜ୍ଞାପନ ଦେବାକୁ ଚାହାଁନ୍ତି କି?
          </h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Reach thousands of daily readers by advertising on Srishti News.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
