import { getReporters } from "@/lib/api";
import type { Metadata } from "next";
import ReportersDirectory from "@/components/ReportersDirectory";

export const metadata: Metadata = {
  title: "ସାମ୍ବାଦିକ - Srishti News",
  description:
    "Srishti News ର ସମସ୍ତ ସାମ୍ବାଦିକ ଓ ସାମ୍ବାଦିକ ଦଳ ବିଷୟରେ ଜାଣନ୍ତୁ",
  alternates: {
    canonical: "https://www.srishtinews.in/reporters",
  },
};

export const revalidate = 30;

export default async function ReportersPage() {
  const data = await getReporters({
    limit: "100000",
    sortBy: "serialNumber",
    order: "asc",
  });

  const reporters = data?.reporters || [];

  return (
    <section className="min-h-screen bg-gray-50 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2">
            Our Team
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            ଆମ ସାମ୍ବାଦିକ
          </h1>

          <div className="w-20 h-1 bg-primary mx-auto mt-5 rounded-full" />
        </div>

        {reporters.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <p className="text-lg font-medium">
              ସାମ୍ବାଦିକ ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ
            </p>
          </div>
        ) : (
          <ReportersDirectory reporters={reporters} />
        )}
      </div>
    </section>
  );
}
