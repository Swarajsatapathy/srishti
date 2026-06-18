import { getReporters } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/imageUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ସାମ୍ବାଦିକ - Srishti News",
  description:
    "Srishti News ର ସମସ୍ତ ସାମ୍ବାଦିକ ଓ ସାମ୍ବାଦିକ ଦଳ ବିଷୟରେ ଜାଣନ୍ତୁ",
  alternates: {
    canonical: "https://www.srishtinews.in/reporters",
  },
};

export default async function ReportersPage() {
  const data = await getReporters({
    limit: "1000",
    sortBy: "serialNumber",
    order: "asc",
  });

  const reporters = data?.reporters || [];

  return (
    <section className="min-h-screen bg-gray-50 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
            {reporters.map((reporter) => {
              const photoUrl = getImageUrl(reporter.photo?.url);

              return (
                <Link
  key={reporter._id}
  href={`/reporters/${reporter._id}`}
  className="block bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 px-5 py-5 md:px-6 md:py-6 cursor-pointer"
>
                  <div className="flex items-center gap-5 md:gap-7">
                    {/* Image */}
                    <div className="relative shrink-0 w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 rounded-xl overflow-hidden border-2 border-primary bg-gray-100">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={reporter.name}
                          fill
                          className="object-cover object-top"
                          sizes="160px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <svg
                            className="w-14 h-14 text-primary/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-28 md:h-32 w-px bg-gray-200 shrink-0" />

                    {/* Info */}
                    <div className="min-w-0">
                      

                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                        {reporter.name}
                      </h2>

                      <p className="text-gray-600 font-semibold text-sm md:text-base mt-2">
                        {reporter.designation}
                      </p>

                      {reporter.district && (
                        <p className="text-primary font-bold text-sm md:text-base mt-2">
                          {reporter.district}
                        </p>
                      )}

                      {reporter.message && (
                        <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-2">
                          &ldquo;{reporter.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}