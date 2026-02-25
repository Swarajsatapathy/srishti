import { Suspense } from "react";
import SearchContent from "./SearchContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ସନ୍ଧାନ - Srishti News",
  description: "Srishti News ରେ ସମ୍ବାଦ ସନ୍ଧାନ କରନ୍ତୁ",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
