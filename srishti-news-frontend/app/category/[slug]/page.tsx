import { getArticles } from "@/lib/api";
import { getCategoryBySlug } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.label} - Srishti News`,
    description: `${category.label} ବିଭାଗର ସମସ୍ତ ସମ୍ବାଦ`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const page = parseInt(pageStr || "1", 10);
  const data = await getArticles({
    category: category.odia,
    published: "true",
    page: String(page),
    limit: "12",
    sortBy: "publishedAt",
    order: "desc",
  });

  const articles = data?.articles || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b-2 border-primary">
        {category.label}
      </h1>

      {articles.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <p className="text-base sm:text-lg">ଏହି ବିଭାଗରେ କୌଣସି ସମ୍ବାଦ ନାହିଁ।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              basePath={`/category/${slug}`}
            />
          )}
        </>
      )}
    </div>
  );
}
