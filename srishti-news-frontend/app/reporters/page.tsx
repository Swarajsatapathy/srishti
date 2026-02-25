import { getReporters } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ସାମ୍ବାଦିକ - Srishti News",
  description:
    "Srishti News ର ସମସ୍ତ ସାମ୍ବାଦିକ ଓ ସାମ୍ବାଦିକ ଦଳ ବିଷୟରେ ଜାଣନ୍ତୁ",
};

export default async function ReportersPage() {
  const data = await getReporters({
    limit: "50",
    sortBy: "createdAt",
    order: "desc",
  });

  const reporters = data?.reporters || [];

  return (
    <section className="bg-gray-50 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2">
            Our Team
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            ଆମର ସାମ୍ବାଦିକ ଦଳ
          </h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            ସତ୍ୟ ଓ ତଥ୍ୟ ଆଧାରିତ ଖବରକୁ ଆପଣଙ୍କ ପାଖରେ ପହଞ୍ଚାଉଥିବା ଆମର
            ନିଷ୍ଠାବାନ ସାମ୍ବାଦିକମାନଙ୍କୁ ଜାଣନ୍ତୁ
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reporters.map((reporter) => {
              const photoUrl = getImageUrl(reporter.photo?.url);

              return (
                <div
                  key={reporter._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Photo */}
                  <div className="relative h-64 sm:h-72 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={reporter.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-primary/40"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay at bottom for text readability */}
                    <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="p-5 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
                      {reporter.name}
                    </h2>
                    <p className="text-primary font-semibold text-sm mt-1">
                      {reporter.designation}
                    </p>
                    {reporter.message && (
                      <p className="text-gray-500 text-sm mt-3 leading-relaxed line-clamp-3">
                        &ldquo;{reporter.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
