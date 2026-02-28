"use client";

import { useState } from "react";
import Image from "next/image";
import type { Reporter } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface ReportersSectionProps {
  reporters: Reporter[];
}

export default function ReportersSection({ reporters }: ReportersSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (reporters.length === 0) {
    return null;
  }

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < reporters.length - 1;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(reporters.length - 1, i + 1));

  const reporter = reporters[currentIndex];
  const photoUrl = reporter.photo?.url ? getImageUrl(reporter.photo.url) : "";

  return (
    <div className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Our Reporters</h2>
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-5">
        <div className="flex flex-col items-center text-center">
          {/* Photo */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-red-100 shadow-sm mb-4">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={reporter.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
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

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900">{reporter.name}</h3>

          {/* Designation */}
          <p className="text-sm text-red-600 font-medium mt-1">
            {reporter.designation}
          </p>

          {/* District */}
          {reporter.district && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{reporter.district}</span>
            </div>
          )}

          {/* Message */}
          {reporter.message && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 italic">
              &ldquo;{reporter.message}&rdquo;
            </p>
          )}
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
                  ? "bg-red-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
