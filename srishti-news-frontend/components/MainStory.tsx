"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface MainStoryProps {
  articles: Article[];
}

export default function MainStory({ articles }: MainStoryProps) {
  const [currentArticle, setCurrentArticle] = useState(0);

  const article = articles?.[currentArticle];

  const prevArticle = () =>
    setCurrentArticle((c) => (c === 0 ? articles.length - 1 : c - 1));
  const nextArticle = () =>
    setCurrentArticle((c) => (c === articles.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (!articles || articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentArticle((c) => (c === articles.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [articles]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
          Web News
        </h2>
        {articles && articles.length > 1 && (
          <div className="flex gap-1.5">
            <button
              onClick={prevArticle}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextArticle}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden aspect-[1920/1080] shadow-md">
        {articles && articles.length > 0 ? (
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentArticle * 100}%)` }}
          >
            {articles.map((a) => (
              <Link key={a._id} href={`/article/${a._id}`} className="block group w-full h-full shrink-0">
                <div className="relative w-full h-full">
                  {a.images?.[0]?.url ? (
                    <Image
                      src={getImageUrl(a.images[0].url)}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <span className="inline-block bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                      Latest
                    </span>
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight line-clamp-2">
                      {a.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-gray-200">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-sm">No web news available</span>
          </div>
        )}
      </div>
    </div>
  );
}
