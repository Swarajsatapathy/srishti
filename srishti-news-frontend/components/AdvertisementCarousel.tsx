"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { Advertisement } from "@/lib/types";

interface AdvertisementCarouselProps {
  ads: Advertisement[];
  fullWidth?: boolean;
}

export default function AdvertisementCarousel({ ads, fullWidth = false }: AdvertisementCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? ads.length - 1 : c - 1)),
    [ads.length]
  );

  const next = useCallback(
    () => setCurrent((c) => (c === ads.length - 1 ? 0 : c + 1)),
    [ads.length]
  );

  // Auto-rotate ads every 5 seconds when fullWidth
  useEffect(() => {
    if (!fullWidth || !ads || ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === ads.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [fullWidth, ads]);

  if (!ads || ads.length === 0) {
    return (
      <div
        className={`relative overflow-hidden bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 border border-gray-200 flex flex-col items-center justify-center text-center text-gray-400 ${
          fullWidth
            ? "rounded-xl sm:rounded-2xl aspect-video sm:aspect-21/9 lg:aspect-21/6"
            : "rounded-xl aspect-3/2"
        }`}
      >
        <svg className={fullWidth ? "w-14 h-14 mb-3" : "w-10 h-10 mb-2"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span className={fullWidth ? "text-base font-semibold" : "text-sm font-medium"}>
          Advertise Here
        </span>
        {fullWidth && (
          <span className="text-xs text-gray-400 mt-1">Contact us for banner ad placement</span>
        )}
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

  if (fullWidth) {
    return (
      <div>
        {/* Header with title and navigation arrows — matching other sections */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
            Advertisement
          </h2>
          {ads.length > 1 && (
            <div className="flex gap-1.5">
              <button
                onClick={prev}
                aria-label="Previous advertisement"
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next advertisement"
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="relative">
        <Wrapper
          {...wrapperProps}
          className="block rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {hasVideo ? (
            <video
              src={ad.videos[0].url}
              className="w-full aspect-video sm:aspect-21/9 lg:aspect-21/6 object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : hasImage ? (
            <div className="relative w-full aspect-video sm:aspect-21/9 lg:aspect-21/6">
              <Image
                src={ad.images[0].url}
                alt={ad.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
          ) : (
            <div className="w-full aspect-video sm:aspect-21/9 lg:aspect-21/6 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-500">{ad.title}</span>
            </div>
          )}

          {ad.description && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 sm:p-6">
              <p className="text-white text-sm sm:text-base font-medium line-clamp-2">{ad.description}</p>
            </div>
          )}
        </Wrapper>

        {/* Dot indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to ad ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-5"
                    : "bg-white/50 w-2 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    );
  }

  // Compact version (non-fullWidth)
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
