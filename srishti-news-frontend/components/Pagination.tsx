import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams({ ...queryParams, page: String(page) });
    return `${basePath}?${params.toString()}`;
  };

  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
        >
          &larr; Prev
        </Link>
      )}
      {pages.map((page, i) =>
        typeof page === "string" ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`px-3 py-2 text-sm rounded transition ${
              page === currentPage
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
        >
          Next &rarr;
        </Link>
      )}
    </div>
  );
}
