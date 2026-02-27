"use client";

import Link from "next/link";
interface FlashTickerItem {
  id: string;
  title: string;
  href: string;
  type: "article" | "video";
}

interface FlashTickerProps {
  items: FlashTickerItem[];
}

export default function FlashTicker({ items }: FlashTickerProps) {
  if (!items || items.length === 0) return null;

  const uniqueItems = items.filter(
    (item, index, list) => index === list.findIndex((existing) => `${existing.type}-${existing.id}` === `${item.type}-${item.id}`)
  );

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-3 py-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="bg-primary text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 rounded uppercase tracking-wide leading-normal">
            Flash
          </span>
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="flex gap-8 sm:gap-12 animate-ticker whitespace-nowrap">
            {uniqueItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="text-xs sm:text-sm text-gray-700 hover:text-primary transition inline-flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
