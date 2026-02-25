import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getImageUrl } from "@/lib/imageUrl";

interface EditorsPicksProps {
  articles: Article[];
}

export default function EditorsPicks({ articles }: EditorsPicksProps) {
  if (!articles || articles.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Editor&apos;s Picks</h2>
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-500">
          No editor&apos;s picks available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editor&apos;s Picks</h2>
      <div className="flex flex-col gap-4">
        {articles.slice(0, 4).map((article) => {
          const imageUrl = getImageUrl(article.images?.[0]?.url);
          return (
            <Link
              key={article._id}
              href={`/article/${article._id}`}
              className="group block"
            >
              <div className="relative rounded-lg overflow-hidden aspect-[16/10]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="inline-block bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded mb-1">
                    {article.category}
                  </span>
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1">
                    {article.reporter}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
