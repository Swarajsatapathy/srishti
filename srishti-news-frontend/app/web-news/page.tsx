import { getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web News - Srishti News",
  description: "Srishti News ର ସମସ୍ତ ତାଜା ଓ୍ୱେବ ସମ୍ବାଦ",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function WebNewsPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const params: Record<string, string> = {
    published: "true",
    page: String(page),
    limit: "12",
    sortBy: "publishedAt",
    order: "desc",
  };

  const data = await getArticles(params);
  const articles = data?.articles || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold pb-2 border-b-2 border-primary">
          Web News
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          ସମସ୍ତ ତାଜା ସମ୍ବାଦ ଏକ ଜାଗାରେ
        </p>
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-base sm:text-lg">କୌଣସି ସମ୍ବାଦ ଉପଲବ୍ଧ ନାହିଁ।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              basePath="/web-news"
            />
          )}
        </>
      )}
    </div>
  );
}
