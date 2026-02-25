"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Article = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  reporter: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isFlash: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  images: Array<{ url: string; key?: string }>;
  publishedAt?: string;
};

type Video = {
  _id: string;
  title: string;
  description: string;
  category: string;
  reporter: string;
  tags: string[];
  youtubeUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt?: string;
};

type Reporter = {
  _id: string;
  name: string;
  designation: string;
  message?: string;
  photo?: { url?: string; key?: string };
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type TabType = "articles" | "videos" | "reporters";

const categories = [
  "other",
  "state",
  "national",
  "international",
  "business",
  "editorial",
  "crime",
  "sports",
  "entertainment",
  "lifestyle",
  "religion",
  "ରାଜ୍ୟ",
  "ଜାତୀୟ",
  "ଆନ୍ତର୍ଜାତୀୟ",
  "ବାଣିଜ୍ୟ",
  "ସମ୍ପାଦକୀୟ",
  "ଅପରାଧ",
  "ଖେଳ",
  "ମନୋରଞ୍ଜନ",
  "ଜୀବନଶୈଳୀ",
  "ଧର୍ମ",
];

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_BASE_URL is missing in .env");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);

  const [articleEditId, setArticleEditId] = useState<string | null>(null);
  const [videoEditId, setVideoEditId] = useState<string | null>(null);
  const [reporterEditId, setReporterEditId] = useState<string | null>(null);

  const [articleForm, setArticleForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "other",
    reporter: "",
    tags: "",
    isPublished: false,
    isFeatured: false,
    isFlash: false,
    isTrending: false,
    isEditorsPick: false,
  });
  const [articleImages, setArticleImages] = useState<FileList | null>(null);

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    category: "other",
    reporter: "",
    tags: "",
    youtubeUrl: "",
    isPublished: false,
    isFeatured: false,
    isTrending: false,
  });

  const [reporterForm, setReporterForm] = useState({
    name: "",
    designation: "",
    message: "",
  });
  const [reporterPhoto, setReporterPhoto] = useState<File | null>(null);

  const adminCode = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || "admin123",
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem("srishti-news-admin-auth") === "true";
    setIsAuthed(stored);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    void Promise.all([loadArticles(), loadVideos(), loadReporters()]);
  }, [isAuthed]);

  const loadArticles = async () => {
    const response = await apiRequest<{ articles: Article[] }>(
      "/api/articles?limit=50&sortBy=createdAt&order=desc"
    );
    setArticles(response.data.articles || []);
  };

  const loadVideos = async () => {
    const response = await apiRequest<{ videos: Video[] }>(
      "/api/videos?limit=50&sortBy=createdAt&order=desc"
    );
    setVideos(response.data.videos || []);
  };

  const loadReporters = async () => {
    const response = await apiRequest<{ reporters: Reporter[] }>(
      "/api/reporters?limit=50&sortBy=createdAt&order=desc"
    );
    setReporters(response.data.reporters || []);
  };

  const withBusy = async (work: () => Promise<void>, message: string) => {
    setBusy(true);
    setStatus("");
    try {
      await work();
      setStatus(message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginPassword !== adminCode) {
      setAuthError("Invalid admin password");
      return;
    }

    localStorage.setItem("srishti-news-admin-auth", "true");
    setIsAuthed(true);
    setAuthError("");
    setLoginPassword("");
  };

  const logout = () => {
    localStorage.removeItem("srishti-news-admin-auth");
    setIsAuthed(false);
  };

  const resetArticleForm = () => {
    setArticleEditId(null);
    setArticleForm({
      title: "",
      description: "",
      content: "",
      category: "other",
      reporter: "",
      tags: "",
      isPublished: false,
      isFeatured: false,
      isFlash: false,
      isTrending: false,
      isEditorsPick: false,
    });
    setArticleImages(null);
  };

  const resetVideoForm = () => {
    setVideoEditId(null);
    setVideoForm({
      title: "",
      description: "",
      category: "other",
      reporter: "",
      tags: "",
      youtubeUrl: "",
      isPublished: false,
      isFeatured: false,
      isTrending: false,
    });
  };

  const resetReporterForm = () => {
    setReporterEditId(null);
    setReporterForm({ name: "", designation: "", message: "" });
    setReporterPhoto(null);
  };

  const submitArticle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void withBusy(async () => {
      const formData = new FormData();
      formData.append("title", articleForm.title);
      formData.append("description", articleForm.description);
      formData.append("content", articleForm.content);
      formData.append("category", articleForm.category);
      formData.append("reporter", articleForm.reporter);
      formData.append("tags", JSON.stringify(parseTags(articleForm.tags)));
      formData.append("isPublished", String(articleForm.isPublished));
      formData.append("isFeatured", String(articleForm.isFeatured));
      formData.append("isFlash", String(articleForm.isFlash));
      formData.append("isTrending", String(articleForm.isTrending));
      formData.append("isEditorsPick", String(articleForm.isEditorsPick));

      if (articleImages) {
        Array.from(articleImages).forEach((file) => {
          formData.append("images", file);
        });
      }

      const path = articleEditId
        ? `/api/articles/${articleEditId}`
        : "/api/articles";
      const method = articleEditId ? "PUT" : "POST";

      await apiRequest(path, { method, body: formData });
      await loadArticles();
      resetArticleForm();
    }, articleEditId ? "Article updated" : "Article created");
  };

  const editArticle = (article: Article) => {
    setArticleEditId(article._id);
    setArticleForm({
      title: article.title,
      description: article.description,
      content: article.content || "",
      category: article.category,
      reporter: article.reporter,
      tags: article.tags?.join(", ") || "",
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
      isFlash: article.isFlash,
      isTrending: article.isTrending,
      isEditorsPick: article.isEditorsPick,
    });
    setActiveTab("articles");
  };

  const removeArticle = (id: string) => {
    void withBusy(async () => {
      await apiRequest(`/api/articles/${id}`, { method: "DELETE" });
      await loadArticles();
      if (articleEditId === id) {
        resetArticleForm();
      }
    }, "Article deleted");
  };

  const submitVideo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void withBusy(async () => {
      const body = {
        title: videoForm.title,
        description: videoForm.description,
        category: videoForm.category,
        reporter: videoForm.reporter,
        tags: JSON.stringify(parseTags(videoForm.tags)),
        youtubeUrl: videoForm.youtubeUrl,
        isPublished: String(videoForm.isPublished),
        isFeatured: String(videoForm.isFeatured),
        isTrending: String(videoForm.isTrending),
      };

      const path = videoEditId ? `/api/videos/${videoEditId}` : "/api/videos";
      const method = videoEditId ? "PUT" : "POST";

      await apiRequest(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await loadVideos();
      resetVideoForm();
    }, videoEditId ? "Video updated" : "Video created");
  };

  const editVideo = (video: Video) => {
    setVideoEditId(video._id);
    setVideoForm({
      title: video.title,
      description: video.description,
      category: video.category,
      reporter: video.reporter,
      tags: video.tags?.join(", ") || "",
      youtubeUrl: video.youtubeUrl || "",
      isPublished: video.isPublished,
      isFeatured: video.isFeatured,
      isTrending: video.isTrending,
    });
    setActiveTab("videos");
  };

  const removeVideo = (id: string) => {
    void withBusy(async () => {
      await apiRequest(`/api/videos/${id}`, { method: "DELETE" });
      await loadVideos();
      if (videoEditId === id) {
        resetVideoForm();
      }
    }, "Video deleted");
  };

  const submitReporter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void withBusy(async () => {
      const formData = new FormData();
      formData.append("name", reporterForm.name);
      formData.append("designation", reporterForm.designation);
      formData.append("message", reporterForm.message);
      if (reporterPhoto) {
        formData.append("photo", reporterPhoto);
      }

      const path = reporterEditId
        ? `/api/reporters/${reporterEditId}`
        : "/api/reporters";
      const method = reporterEditId ? "PUT" : "POST";

      await apiRequest(path, { method, body: formData });
      await loadReporters();
      resetReporterForm();
    }, reporterEditId ? "Reporter updated" : "Reporter created");
  };

  const editReporter = (reporter: Reporter) => {
    setReporterEditId(reporter._id);
    setReporterForm({
      name: reporter.name,
      designation: reporter.designation,
      message: reporter.message || "",
    });
    setActiveTab("reporters");
  };

  const removeReporter = (id: string) => {
    void withBusy(async () => {
      await apiRequest(`/api/reporters/${id}`, { method: "DELETE" });
      await loadReporters();
      if (reporterEditId === id) {
        resetReporterForm();
      }
    }, "Reporter deleted");
  };

  if (!authReady) {
    return <div className="p-10">Loading admin...</div>;
  }

  if (!isAuthed) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <h1 className="text-3xl font-bold">Srishti News Admin</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter admin password to continue.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="password"
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Admin password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
          />
          {authError && <p className="text-sm text-red-600">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={!loginPassword.trim()}
          >
            Login
          </button>
          <p className="text-xs text-gray-500">
            Set NEXT_PUBLIC_ADMIN_ACCESS_CODE in .env for your custom admin
            password.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Srishti News Admin Panel</h1>
          <p className="text-sm text-gray-600">Connected to: {API_BASE}</p>
        </div>
        <button
          onClick={logout}
          className="rounded border border-gray-300 px-4 py-2 text-sm"
        >
          Logout
        </button>
      </header>

      <div className="mb-6 flex gap-2">
        {(["articles", "videos", "reporters"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-700"
            }`}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {status && (
        <div className="mb-4 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
          {status}
        </div>
      )}

      {activeTab === "articles" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={submitArticle}
            className="space-y-3 rounded border border-gray-200 p-4"
          >
            <h2 className="text-lg font-semibold">
              {articleEditId ? "Update Article" : "Create Article"}
            </h2>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Title"
              value={articleForm.title}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              required
            />
            <textarea
              className="h-24 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Description"
              value={articleForm.description}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              required
            />
            <textarea
              className="h-32 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Content"
              value={articleForm.content}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select
                className="rounded border border-gray-300 px-3 py-2"
                value={articleForm.category}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                className="rounded border border-gray-300 px-3 py-2"
                placeholder="Reporter"
                value={articleForm.reporter}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    reporter: event.target.value,
                  }))
                }
                required
              />
            </div>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Tags (comma separated)"
              value={articleForm.tags}
              onChange={(event) =>
                setArticleForm((current) => ({
                  ...current,
                  tags: event.target.value,
                }))
              }
            />
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full rounded border border-gray-300 px-3 py-2"
              onChange={(event) => setArticleImages(event.target.files)}
            />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {(
                [
                  ["Publish", "isPublished"],
                  ["Featured", "isFeatured"],
                  ["Flash", "isFlash"],
                  ["Trending", "isTrending"],
                  ["Editor's Pick", "isEditorsPick"],
                ] as Array<[string, keyof typeof articleForm]>
              ).map(([label, key]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(articleForm[key])}
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {articleEditId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetArticleForm}
                className="rounded border border-gray-300 px-4 py-2"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="rounded border border-gray-200 p-4">
            <h2 className="mb-3 text-lg font-semibold">Articles ({articles.length})</h2>
            <div className="max-h-[65vh] space-y-2 overflow-auto">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="rounded border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium">{article.title}</p>
                  <p className="text-gray-600">
                    {article.category} • {article.reporter}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => editArticle(article)}
                      className="rounded border border-gray-300 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeArticle(article._id)}
                      className="rounded border border-red-300 px-3 py-1 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "videos" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={submitVideo}
            className="space-y-3 rounded border border-gray-200 p-4"
          >
            <h2 className="text-lg font-semibold">
              {videoEditId ? "Update Video" : "Create Video"}
            </h2>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Title"
              value={videoForm.title}
              onChange={(event) =>
                setVideoForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
            <textarea
              className="h-24 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Description"
              value={videoForm.description}
              onChange={(event) =>
                setVideoForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              required
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select
                className="rounded border border-gray-300 px-3 py-2"
                value={videoForm.category}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                className="rounded border border-gray-300 px-3 py-2"
                placeholder="Reporter"
                value={videoForm.reporter}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    reporter: event.target.value,
                  }))
                }
                required
              />
            </div>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Tags (comma separated)"
              value={videoForm.tags}
              onChange={(event) =>
                setVideoForm((current) => ({ ...current, tags: event.target.value }))
              }
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="YouTube Video URL"
              value={videoForm.youtubeUrl}
              onChange={(event) =>
                setVideoForm((current) => ({
                  ...current,
                  youtubeUrl: event.target.value,
                }))
              }
              required
            />
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["Publish", "isPublished"],
                  ["Featured", "isFeatured"],
                  ["Trending", "isTrending"],
                ] as Array<[string, keyof typeof videoForm]>
              ).map(([label, key]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(videoForm[key])}
                    onChange={(event) =>
                      setVideoForm((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {videoEditId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetVideoForm}
                className="rounded border border-gray-300 px-4 py-2"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="rounded border border-gray-200 p-4">
            <h2 className="mb-3 text-lg font-semibold">Videos ({videos.length})</h2>
            <div className="max-h-[65vh] space-y-2 overflow-auto">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="rounded border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium">{video.title}</p>
                  <p className="text-gray-600">
                    {video.category} • {video.reporter}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => editVideo(video)}
                      className="rounded border border-gray-300 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeVideo(video._id)}
                      className="rounded border border-red-300 px-3 py-1 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "reporters" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={submitReporter}
            className="space-y-3 rounded border border-gray-200 p-4"
          >
            <h2 className="text-lg font-semibold">
              {reporterEditId ? "Update Reporter" : "Create Reporter"}
            </h2>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Name"
              value={reporterForm.name}
              onChange={(event) =>
                setReporterForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Designation"
              value={reporterForm.designation}
              onChange={(event) =>
                setReporterForm((current) => ({
                  ...current,
                  designation: event.target.value,
                }))
              }
              required
            />
            <textarea
              className="h-24 w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Message"
              value={reporterForm.message}
              onChange={(event) =>
                setReporterForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
            />
            <input
              type="file"
              accept="image/*"
              className="w-full rounded border border-gray-300 px-3 py-2"
              onChange={(event) => setReporterPhoto(event.target.files?.[0] || null)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
              >
                {reporterEditId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetReporterForm}
                className="rounded border border-gray-300 px-4 py-2"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="rounded border border-gray-200 p-4">
            <h2 className="mb-3 text-lg font-semibold">
              Reporters ({reporters.length})
            </h2>
            <div className="max-h-[65vh] space-y-2 overflow-auto">
              {reporters.map((reporter) => (
                <div
                  key={reporter._id}
                  className="rounded border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium">{reporter.name}</p>
                  <p className="text-gray-600">{reporter.designation}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => editReporter(reporter)}
                      className="rounded border border-gray-300 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeReporter(reporter._id)}
                      className="rounded border border-red-300 px-3 py-1 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
