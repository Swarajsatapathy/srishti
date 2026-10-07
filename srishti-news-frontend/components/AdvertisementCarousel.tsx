"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Advertisement } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";
import { trackAdClick } from "@/lib/api";

interface AdvertisementCarouselProps {
  ads: Advertisement[];
  fullWidth?: boolean;
}

interface AdSlideItem {
  id: string;
  adId: string;
  type: "image" | "video" | "text";
  url?: string;
  title: string;
  description?: string;
  link?: string;
}

export default function AdvertisementCarousel({
  ads,
}: AdvertisementCarouselProps) {
  // Flatten ads and their images/videos into unified slide items
  const slideItems: AdSlideItem[] = useMemo(() => {
    if (!ads || ads.length === 0) return [];

    const items: AdSlideItem[] = [];

    for (const ad of ads) {
      const hasImages = ad.images && ad.images.length > 0;
      const hasVideos = ad.videos && ad.videos.length > 0;

      if (hasVideos) {
        ad.videos.forEach((vid, idx) => {
          items.push({
            id: `${ad._id}-vid-${idx}`,
            adId: ad._id,
            type: "video",
            url: vid.url,
            title: ad.title,
            description: ad.description,
            link: ad.link,
          });
        });
      }

      if (hasImages) {
        ad.images.forEach((img, idx) => {
          items.push({
            id: `${ad._id}-img-${idx}`,
            adId: ad._id,
            type: "image",
            url: img.url,
            title: ad.title,
            description: ad.description,
            link: ad.link,
          });
        });
      }

      if (!hasImages && !hasVideos) {
        items.push({
          id: ad._id,
          adId: ad._id,
          type: "text",
          title: ad.title,
          description: ad.description,
          link: ad.link,
        });
      }
    }

    return items;
  }, [ads]);

  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? slideItems.length - 1 : c - 1)),
    [slideItems.length]
  );

  const next = useCallback(
    () => setCurrent((c) => (c === slideItems.length - 1 ? 0 : c + 1)),
    [slideItems.length]
  );

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    if (slideItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === slideItems.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slideItems.length]);

  const handleAdClick = (adId?: string) => {
    if (adId) {
      trackAdClick(adId).catch(() => {});
    }
  };

  if (slideItems.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
            Advertisement
          </h2>
        </div>
        <Link
          href="/contact"
          className="group block relative overflow-hidden bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 border border-gray-200 rounded-xl aspect-[1920/1080] flex flex-col items-center justify-center text-center text-gray-400 shadow-md hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer"
        >
          <svg
            className="w-12 h-12 sm:w-14 sm:h-14 mb-3 text-gray-400 group-hover:scale-110 group-hover:text-primary transition-all duration-300"
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
          <span className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors">
            Advertise Here
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Contact us for banner ad placement &rarr;
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header with title and navigation arrows matching MainStory / VideoNewsSection */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Advertisement
        </h2>
        {slideItems.length > 1 && (
          <div className="flex gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous advertisement"
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next advertisement"
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carousel container with sliding transition */}
      <div className="relative rounded-xl overflow-hidden aspect-[1920/1080] shadow-md border border-gray-200">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slideItems.map((item) => {
            const adDetailUrl = `/advertisement/${item.adId}`;

            const slideContent = (
              <div className="relative w-full h-full group cursor-pointer overflow-hidden">
                {item.type === "video" && item.url ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : item.type === "image" && item.url ? (
                  <Image
                    src={getImageUrl(item.url)}
                    alt={item.title || "Advertisement"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <span className="text-lg font-semibold text-gray-500">
                      {item.title}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-md mb-1.5">
                    Ad
                  </span>
                  {item.title && (
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight line-clamp-2 drop-shadow-sm">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-white/90 text-xs sm:text-sm font-normal line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );

            return (
              <div key={item.id} className="w-full h-full shrink-0">
                <Link
                  href={adDetailUrl}
                  onClick={() => handleAdClick(item.adId)}
                  className="block w-full h-full"
                >
                  {slideContent}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      {slideItems.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {slideItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "bg-red-600 w-5"
                  : "bg-gray-300 w-2 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
