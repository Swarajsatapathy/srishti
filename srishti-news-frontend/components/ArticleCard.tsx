"use client";

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getSlugFromOdia } from "@/lib/categories";
import { getImageUrl } from "@/lib/imageUrl";

interface ArticleCardProps {
  article: Article;
  size?: "small" | "medium";
}

export default function ArticleCard({
  article,
  size = "medium",
}: ArticleCardProps) {
  const imageUrl = getImageUrl(article.images?.[0]?.url);
  const date = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (size === "small") {
    return (
      <Link
        href={`/article/${article._id}`}
        className="group flex gap-3 py-3 border-b border-gray-100 last:border-0"
      >
        <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
        <Link href={`/article/${article._id}`}>
          <div className="relative aspect-[16/10]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/category/${getSlugFromOdia(article.category)}`}
              className="text-primary text-xs font-semibold uppercase hover:underline"
            >
              {article.category}
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <Link href={`/article/${article._id}`}>
            <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {article.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">{article.reporter}</p>
        </div>
      </div>
    </div>
  );
}
