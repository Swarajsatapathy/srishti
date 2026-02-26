"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article, Pagination as PaginationType } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import { useSearchParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(query);

  const fetchResults = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: q,
        published: "true",
        page: String(p),
        limit: "12",
        sortBy: "publishedAt",
        order: "desc",
      });
      const res = await fetch(`${BASE_URL}/api/articles?${params}`);
      if (res.ok) {
        const json = await res.json();
        setArticles(json.data?.articles || []);
        setPagination(json.data?.pagination || null);
        setPage(p);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      fetchResults(query, 1);
    }
  }, [query, fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(searchInput.trim())}`
      );
      fetchResults(searchInput.trim(), 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ସମ୍ବାଦ ସନ୍ଧାନ କରନ୍ତୁ..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base sm:text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-sm sm:text-base shrink-0"
          >
            ସନ୍ଧାନ
          </button>
        </div>
      </form>

      {/* Results */}
      {query && (
        <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-primary">
          &quot;{query}&quot; ପାଇଁ ସନ୍ଧାନ ଫଳାଫଳ
          {pagination && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.total} results)
            </span>
          )}
        </h2>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">ସନ୍ଧାନ ଚାଲୁଅଛି...</p>
        </div>
      ) : articles.length === 0 && query ? (
        <div className="text-center py-12 sm:py-16 text-gray-500">
          <p className="text-base sm:text-lg">କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 sm:mt-8">
              {page > 1 && (
                <button
                  onClick={() => fetchResults(query, page - 1)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
                >
                  &larr; Prev
                </button>
              )}
              <span className="px-4 py-2 text-sm">
                Page {page} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <button
                  onClick={() => fetchResults(query, page + 1)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
                >
                  Next &rarr;
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchContent;
