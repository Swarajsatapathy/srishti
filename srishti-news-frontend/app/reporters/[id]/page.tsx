import { getReporterById } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageUrl";
import { notFound } from "next/navigation";
import ReporterIdCardDownload from "../../../components/ReporterIdCardDownload";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReporterDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const reporter = await getReporterById(id);

  if (!reporter) {
    notFound();
  }

  const photoUrl = getImageUrl(reporter.photo?.url);

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4">
        {/* Only the download button is visible */}
        <div className="mb-5 flex justify-end">
          <ReporterIdCardDownload reporter={reporter} />
        </div>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="relative mx-auto h-52 w-40 shrink-0 overflow-hidden rounded-xl border-2 border-primary bg-gray-100 md:mx-0 md:h-64 md:w-52">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={reporter.name}
                  fill
                  className="object-cover object-top"
                  sizes="220px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <span className="font-bold text-primary">
                    No Photo
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {reporter.name}
              </h1>

              <p className="mt-3 text-lg font-bold text-primary">
                {reporter.designation}
              </p>

              {reporter.district && (
                <p className="mt-2 font-semibold text-gray-600">
                  {reporter.district}
                </p>
              )}

              {reporter.message && (
                <p className="mt-6 leading-relaxed text-gray-600">
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