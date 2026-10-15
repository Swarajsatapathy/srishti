"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Reporter } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface ReportersSectionProps {
  reporters: Reporter[];
}

export default function ReportersSection({ reporters }: ReportersSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reporters.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((c) => (c === reporters.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [reporters.length]);

  if (reporters.length === 0) {
    return null;
  }

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < reporters.length - 1;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(reporters.length - 1, i + 1));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Our Reporters
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous reporter"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 disabled:opacity-30 transition"
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
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next reporter"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 disabled:opacity-30 transition"
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
      </div>

      {/* Reporter Card */}
<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
  <div
    className="flex transition-transform duration-700 ease-in-out"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {reporters.map((r) => {
      const rPhoto = r.photo?.url ? getImageUrl(r.photo.url) : "";

      return (
        <Link
  key={r._id}
  href={`/reporters/${r._id}`}
  className="block w-full shrink-0 p-4 sm:p-5 cursor-pointer"
>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            {/* Left: Square Photo */}
            <div className="relative w-full sm:w-36 md:w-40 aspect-square shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-100">
              {rPhoto ? (
                <Image
                  src={rPhoto}
                  alt={r.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {r.name}
              </h3>

              <p className="text-sm sm:text-base text-primary font-semibold mt-1">
                {r.designation}
              </p>

              {r.district && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{r.district}</span>
                </div>
              )}

              {r.phoneNumber && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{r.phoneNumber}</span>
                </div>
              )}

              {r.message && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 italic">
                  &ldquo;{r.message}&rdquo;
                </p>
              )}
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</div>

      {/* Dot indicators */}
      {reporters.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {reporters.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to reporter ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? "bg-primary w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
