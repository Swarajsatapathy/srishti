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
  getReporters,
} from "@/lib/api";
import FlashTicker from "@/components/FlashTicker";
import MainStory from "@/components/MainStory";
import VideoNewsSection from "@/components/VideoNewsSection";
import EditorsPicks from "@/components/EditorsPicks";
import TrendingStories from "@/components/TrendingStories";
import LatestNewsCarousel from "@/components/LatestNewsCarousel";
import AdvertisementCarousel from "@/components/AdvertisementCarousel";
import ReportersSection from "@/components/ReportersSection";

export default async function Home() {
  const [flashArticles, flashVideos, featured, editorsPicks, editorsPickVids, trending, trendingVids, latestData, webNewsData, videosData, homepageAds, reportersData] =
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
      getReporters({ limit: "20" }),
    ]);

  const latestArticles = latestData?.articles || [];
  const webNewsArticles = webNewsData?.articles || [];
  const latestVideos = videosData?.videos || [];
  const ads = homepageAds || [];
  const reporters = reportersData?.reporters || [];
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Row 1: Web News + Video News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          <div>
            <MainStory articles={webNewsArticles.length > 0 ? webNewsArticles : (featured || [])} />
          </div>
          <div>
            <VideoNewsSection videos={latestVideos} />
          </div>
        </div>

        {/* Advertisement Banner — Full Width */}
        <section>
          <AdvertisementCarousel ads={ads} fullWidth />
        </section>

        {/* Row 2: Editor's Picks + Trending Story + Reporters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          <div>
            <EditorsPicks articles={editorsPicks || []} videos={editorsPickVids || []} />
          </div>
          <div>
            <TrendingStories articles={trending || []} videos={trendingVids || []} />
          </div>
          <div>
            <ReportersSection reporters={reporters} />
          </div>
        </div>

        {/* Latest News Section */}
        {latestArticles.length > 0 && <LatestNewsCarousel articles={latestArticles} />}
      </div>
    </>
  );
}
