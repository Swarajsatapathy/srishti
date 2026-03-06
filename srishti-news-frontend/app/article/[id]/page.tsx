import { getArticleById } from "@/lib/api";
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
  const article = await getArticleById(id);
  if (!article) return { title: "Article Not Found" };

  const ogImage =
    article.images && article.images.length > 0
      ? getImageUrl(article.images[0].url)
      : undefined;

  const description = article.content?.slice(0, 200) || article.title;

  return {
    title: `${article.title} - Srishti News`,
    description,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      siteName: "Srishti News",
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: `https://www.srishtinews.in/article/${id}`,
    },
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-baseline gap-1.5 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/" className="hover:text-primary transition whitespace-nowrap">
          Home
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 sm:mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        {article.district && (
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded">
            {article.district}
          </span>
        )}
        <span>{article.reporter}</span>
        <span>{date}</span>
        <span>{article.views} views</span>
      </div>

      {/* Share Buttons */}
      <div className="mb-4 sm:mb-6">
        <ShareButtons url={`/article/${id}`} title={article.title} />
      </div>

      {/* Featured Image */}
      {article.images && article.images.length > 0 && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 sm:mb-6">
          <Image
            src={getImageUrl(article.images[0].url)}
            alt={article.images[0].caption || article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 896px) 100vw, 896px"
            priority
          />
          {article.images[0].caption && (
            <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
              {article.images[0].caption}
            </p>
          )}
        </div>
      )}

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
              className="relative aspect-16/10 rounded-lg overflow-hidden"
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
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
