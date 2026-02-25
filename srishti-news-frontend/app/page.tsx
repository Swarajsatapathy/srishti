import {
  getFlashStories,
  getFeaturedStories,
  getEditorsPicks,
  getTrendingStories,
  getArticles,
  getVideos,
} from "@/lib/api";
import FlashTicker from "@/components/FlashTicker";
import MainStory from "@/components/MainStory";
import EditorsPicks from "@/components/EditorsPicks";
import TrendingStories from "@/components/TrendingStories";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const [flash, featured, editorsPicks, trending, latestData, videosData] =
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
    ]);

  const latestArticles = latestData?.articles || [];
  const latestVideos = videosData?.videos || [];

  return (
    <>
      <FlashTicker articles={flash || []} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <MainStory articles={featured || []} videos={latestVideos} />
          </div>
          <div className="lg:col-span-3">
            <EditorsPicks articles={editorsPicks || []} />
          </div>
          <div className="lg:col-span-3">
            <TrendingStories articles={trending || []} />
          </div>
        </div>

        {/* Latest News Section */}
        {latestArticles.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary">
              ତାଜା ଖବର
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
