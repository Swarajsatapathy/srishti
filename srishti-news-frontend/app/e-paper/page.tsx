import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Paper - Srishti News",
  description:
    "Srishti News ର ଇ-ପେପର୍ - ଓଡ଼ିଶାର ଅଗ୍ରଣୀ ସମ୍ବାଦ ପତ୍ରିକା ଡିଜିଟାଲ ସଂସ୍କରଣ",
  alternates: {
    canonical: "https://www.srishtinews.in/e-paper",
  },
};

export default function EPaperPage() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8 text-white text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/80 mb-2">
              Srishti News E-Paper
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">ଇ-ପେପର୍</h1>
            <p className="text-sm md:text-base text-white/90 mt-3 max-w-2xl mx-auto leading-relaxed">
              ସ୍ରୀଷ୍ଟି ସମ୍ବାଦ ପତ୍ରିକାର ଡିଜିଟାଲ ସଂସ୍କରଣ
            </p>
          </div>

          <div className="px-6 md:px-8 py-12 md:py-16 text-center">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-primary/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              ଶୀଘ୍ର ଆସୁଛି
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              ଆମ ଇ-ପେପର୍ ସେବା ଶୀଘ୍ର ଉପଲବ୍ଧ ହେବ। ଆପଣ ଏଠାରେ ସ୍ରୀଷ୍ଟି ସମ୍ବାଦ
              ପତ୍ରିକାର ପ୍ରତ୍ୟେକ ସଂସ୍କରଣ ଡିଜିଟାଲ ରୂପରେ ପଢ଼ିପାରିବେ।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
