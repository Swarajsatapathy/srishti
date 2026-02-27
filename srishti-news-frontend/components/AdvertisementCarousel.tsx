"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { Advertisement } from "@/lib/types";

interface AdvertisementCarouselProps {
  ads: Advertisement[];
}

export default function AdvertisementCarousel({ ads }: AdvertisementCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? ads.length - 1 : c - 1)),
    [ads.length]
  );

  const next = useCallback(
    () => setCurrent((c) => (c === ads.length - 1 ? 0 : c + 1)),
    [ads.length]
  );

  if (!ads || ads.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden aspect-3/2 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-center">
        <span className="text-sm font-semibold text-gray-500">Advertise Here</span>
      </div>
    );
  }

  const ad = ads[current];
  const hasImage = ad.images && ad.images.length > 0;
  const hasVideo = ad.videos && ad.videos.length > 0;
  const Wrapper = ad.link ? "a" : "div";
  const wrapperProps = ad.link
    ? { href: ad.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div>
      {ads.length > 1 && (
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={prev}
            aria-label="Previous advertisement"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next advertisement"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <Wrapper
        {...wrapperProps}
        className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        {hasVideo ? (
          <video
            src={ad.videos[0].url}
            className="w-full aspect-3/2 object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : hasImage ? (
          <div className="relative w-full aspect-3/2">
            <Image
              src={ad.images[0].url}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-full aspect-3/2 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">{ad.title}</span>
          </div>
        )}

        {ad.description && (
          <p className="px-2 py-1.5 text-xs text-gray-600 line-clamp-2">{ad.description}</p>
        )}
      </Wrapper>
    </div>
  );
}
