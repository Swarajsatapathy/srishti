import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getEditorsPicks, getEditorsPickVideos } from "@/lib/api";
import { getImageUrl } from "@/lib/imageUrl";
import { getYouTubeThumbnail } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Editor's Desk - Srishti News",
  description:
    "Read the editor's message and browse hand-picked stories from the editor of Srishti News.",
  alternates: {
    canonical: "https://www.srishtinews.in/editors-desk",
  },
};

const editor = {
  name: "Manoj Satapathy",
  photo: "/Editor.jpeg",
  message: "Welcome to Srishti News",
};

export default async function EditorsDeskPage() {
  const [articles, videos] = await Promise.all([
    getEditorsPicks(),
    getEditorsPickVideos(),
  ]);

  return (
    <section className="bg-gray-50 py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Editor&apos;s Desk
        </h1>

        {/* Editor info box */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
              <Image
                src={editor.photo}
                alt={editor.name}
                fill
                className="object-cover"
                sizes="176px"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {editor.name}
              </h2>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Founder Editor, Srishti News
              </p>
              <p className="text-gray-700 text-base leading-7">
                {editor.message}
              </p>
            </div>
          </div>
        </div>

        {/* Editor's Pick Articles */}
        {articles && articles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              Editor&apos;s Pick Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => {
                const imageUrl = getImageUrl(article.images?.[0]?.url);
                const date = new Date(
                  article.publishedAt || article.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <Link
                    key={article._id}
                    href={`/article/${article._id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="relative aspect-[1920/1080] overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        {article.reporter} &middot; {date}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Editor's Pick Videos */}
        {videos && videos.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              Editor&apos;s Pick Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((video) => {
                const thumbnail = getYouTubeThumbnail(video.youtubeUrl);
                const date = new Date(
                  video.publishedAt || video.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <Link
                    key={video._id}
                    href={`/videos/${video._id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="relative aspect-[1920/1080] overflow-hidden">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                          <svg
                            className="w-6 h-6 text-white ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        {video.reporter} &middot; {date}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback if no picks at all */}
        {(!articles || articles.length === 0) &&
          (!videos || videos.length === 0) && (
            <div className="text-center text-gray-400 py-16">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <p>No editor&apos;s picks available at the moment.</p>
            </div>
          )}
      </div>
    </section>
  );
}
