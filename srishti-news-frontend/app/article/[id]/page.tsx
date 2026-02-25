import { getArticleById } from "@/lib/api";
import { getSlugFromOdia } from "@/lib/categories";
import { getImageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} - Srishti News`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  const date = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/category/${getSlugFromOdia(article.category)}`}
          className="hover:text-primary transition"
        >
          {article.category}
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
        <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded">
          {article.category}
        </span>
        <span>{article.reporter}</span>
        <span>{date}</span>
        <span>{article.views} views</span>
      </div>

      {/* Featured Image */}
      {article.images && article.images.length > 0 && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-6">
          <Image
            src={getImageUrl(article.images[0].url)}
            alt={article.images[0].caption || article.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
          {article.images[0].caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2">
              {article.images[0].caption}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium">
        {article.description}
      </p>

      {/* Content */}
      {article.content && (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      )}

      {/* Additional Images */}
      {article.images && article.images.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {article.images.slice(1).map((img, i) => (
            <div
              key={i}
              className="relative aspect-[16/10] rounded-lg overflow-hidden"
            >
              <Image
                src={getImageUrl(img.url)}
                alt={img.caption || ""}
                fill
                className="object-cover"
                sizes="448px"
              />
              {img.caption && (
                <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-1.5">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-gray-200">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
