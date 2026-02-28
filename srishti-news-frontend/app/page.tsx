import {
  getFlashStories,
  getFlashVideos,
  getFeaturedStories,
  getEditorsPicks,
  getEditorsPickVideos,
  getTrendingStories,
  getTrendingVideos,
  getArticles,
  getVideos,
  getActiveAds,
} from "@/lib/api";
import FlashTicker from "@/components/FlashTicker";
import MainStory from "@/components/MainStory";
import EditorsPicks from "@/components/EditorsPicks";
import TrendingStories from "@/components/TrendingStories";
import LatestNewsCarousel from "@/components/LatestNewsCarousel";
import AdvertisementCarousel from "@/components/AdvertisementCarousel";

export default async function Home() {
  const [flashArticles, flashVideos, featured, editorsPicks, editorsPickVids, trending, trendingVids, latestData, webNewsData, videosData, homepageAds] =
    await Promise.all([
      getFlashStories(),
      getFlashVideos(),
      getFeaturedStories(),
      getEditorsPicks(),
      getEditorsPickVideos(),
      getTrendingStories(),
      getTrendingVideos(),
      getArticles({
        published: "true",
        limit: "6",
        sortBy: "publishedAt",
        order: "desc",
      }),
      getArticles({
        published: "true",
        limit: "10",
        sortBy: "publishedAt",
        order: "desc",
      }),
      getVideos({ published: "true", limit: "10", sortBy: "publishedAt", order: "desc" }),
      getActiveAds("homepage"),
    ]);

  const latestArticles = latestData?.articles || [];
  const webNewsArticles = webNewsData?.articles || [];
  const latestVideos = videosData?.videos || [];
  const ads = homepageAds || [];
  const flashItems = [
    ...(flashArticles || []).map((article) => ({
      id: article._id,
      title: article.title,
      href: `/article/${article._id}`,
      publishedAt: article.publishedAt || article.createdAt,
      type: "article" as const,
    })),
    ...(flashVideos || []).map((video) => ({
      id: video._id,
      title: video.title,
      href: `/videos/${video._id}`,
      publishedAt: video.publishedAt || video.createdAt,
      type: "video" as const,
    })),
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <>
      <FlashTicker items={flashItems} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-2 lg:col-span-6">
            <MainStory articles={webNewsArticles.length > 0 ? webNewsArticles : (featured || [])} videos={latestVideos} />
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <EditorsPicks articles={editorsPicks || []} videos={editorsPickVids || []} />
            <div className="mt-4 sm:mt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Advertisement</h2>
              <AdvertisementCarousel ads={ads} />
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <TrendingStories articles={trending || []} videos={trendingVids || []} />
          </div>
        </div>

        {/* Latest News Section */}
        {latestArticles.length > 0 && <LatestNewsCarousel articles={latestArticles} />}
      </div>
    </>
  );
}
