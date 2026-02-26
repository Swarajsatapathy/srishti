import {
  getFlashStories,
  getFeaturedStories,
  getEditorsPicks,
  getTrendingStories,
  getArticles,
  getVideos,
  getActiveAds,
} from "@/lib/api";
import FlashTicker from "@/components/FlashTicker";
import MainStory from "@/components/MainStory";
import EditorsPicks from "@/components/EditorsPicks";
import TrendingStories from "@/components/TrendingStories";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";

export default async function Home() {
  const [flash, featured, editorsPicks, trending, latestData, videosData, homepageAds] =
    await Promise.all([
      getFlashStories(),
      getFeaturedStories(),
      getEditorsPicks(),
      getTrendingStories(),
      getArticles({
        published: "true",
        limit: "6",
        sortBy: "publishedAt",
        order: "desc",
      }),
      getVideos({ published: "true", limit: "10", sortBy: "publishedAt", order: "desc" }),
      getActiveAds("homepage"),
    ]);

  const latestArticles = latestData?.articles || [];
  const latestVideos = videosData?.videos || [];
  const ads = homepageAds || [];

  return (
    <>
      <FlashTicker articles={flash || []} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-2 lg:col-span-6">
            <MainStory articles={featured || []} videos={latestVideos} />
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <EditorsPicks articles={editorsPicks || []} />
            <div className="mt-4 sm:mt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Advertisement</h2>
              {ads.length > 0 ? (
                <div className="space-y-3">
                  {ads.slice(0, 3).map((ad) => {
                    const hasImage = ad.images && ad.images.length > 0;
                    const hasVideo = ad.videos && ad.videos.length > 0;
                    const Wrapper = ad.link ? "a" : "div";
                    const wrapperProps = ad.link
                      ? { href: ad.link, target: "_blank" as const, rel: "noopener noreferrer" }
                      : {};
                    return (
                      <Wrapper
                        key={ad._id}
                        {...wrapperProps}
                        className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        {hasVideo ? (
                          <video
                            src={ad.videos[0].url}
                            className="w-full aspect-[3/2] object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : hasImage ? (
                          <div className="relative w-full aspect-[3/2]">
                            <Image
                              src={ad.images[0].url}
                              alt={ad.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 25vw"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-500">{ad.title}</span>
                          </div>
                        )}
                        {ad.description && (
                          <p className="px-2 py-1.5 text-xs text-gray-600 line-clamp-2">{ad.description}</p>
                        )}
                      </Wrapper>
                    );
                  })}
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-center">
                  <span className="text-sm font-semibold text-gray-500">Advertise Here</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <TrendingStories articles={trending || []} />
          </div>
        </div>

        {/* Latest News Section */}
        {latestArticles.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b-2 border-primary">
              ତାଜା ଖବର
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
