import { getReporterById } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReporterDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const reporter = await getReporterById(id);

  if (!reporter) {
    notFound();
  }

  const photoUrl = getImageUrl(reporter.photo?.url);

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="relative w-40 h-52 md:w-52 md:h-64 rounded-xl overflow-hidden border-2 border-primary bg-gray-100 shrink-0 mx-auto md:mx-0">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={reporter.name}
                  fill
                  className="object-cover object-top"
                  sizes="220px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-primary font-bold">No Photo</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {reporter.name}
              </h1>

              <p className="text-primary font-bold text-lg mt-3">
                {reporter.designation}
              </p>

              {reporter.district && (
                <p className="text-gray-600 font-semibold mt-2">
                  {reporter.district}
                </p>
              )}

              {reporter.message && (
                <p className="text-gray-600 leading-relaxed mt-6">
                  &ldquo;{reporter.message}&rdquo;
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}