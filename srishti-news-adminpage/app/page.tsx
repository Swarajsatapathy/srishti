"use client";

import { FormEvent, useEffect, useState } from "react";

type Article = {
  _id: string;
  title: string;
  content: string;
  reporter: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isFlash: boolean;
  isTrending: boolean;
  isEditorsPick: boolean;
  district?: string;
  images: Array<{ url: string; key?: string }>;
  publishedAt?: string;
};

type Video = {
  _id: string;
  title: string;
  content: string;
  reporter: string;
  tags: string[];
  youtubeUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isFlash: boolean;
  isEditorsPick: boolean;
  district?: string;
  publishedAt?: string;
};

type Reporter = {
  _id: string;
  serialNumber?: number;
  reporterId?: string;
  name: string;
  designation: string;
  message?: string;
  district?: string;
  validUpto?: string;
  photo?: {
    url?: string;
    key?: string;
  };
};

type Advertisement = {
  _id: string;
  title: string;
  description: string;
  images: Array<{ url: string; key?: string }>;
  videos: Array<{ url: string; key?: string }>;
  link: string;
  placement: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  views: number;
  clicks: number;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TabType = "articles" | "videos" | "reporters" | "advertisements";

const placements = [
  "homepage",
  "sidebar",
  "banner",
  "footer",
  "article",
  "other",
];

const odishaDistricts = [
  "",
  "Angul (ଅନୁଗୋଳ)",
  "Balangir (ବଲାଙ୍ଗୀର)",
  "Balasore (ବାଲେଶ୍ୱର)",
  "Bargarh (ବରଗଡ଼)",
  "Bhadrak (ଭଦ୍ରକ)",
  "Bhubaneswar (ଭୁବନେଶ୍ୱର)",
  "Boudh (ବୌଦ୍ଧ)",
  "Cuttack (କଟକ)",
  "Deogarh (ଦେଓଗଡ଼)",
  "Dhenkanal (ଢେଙ୍କାନାଳ)",
  "Gajapati (ଗଜପତି)",
  "Ganjam (ଗଞ୍ଜାମ)",
  "Jagatsinghpur (ଜଗତସିଂହପୁର)",
  "Jajpur (ଯାଜପୁର)",
  "Jharsuguda (ଝାରସୁଗୁଡ଼ା)",
  "Kalahandi (କଳାହାଣ୍ଡି)",
  "Kandhamal (କନ୍ଧମାଳ)",
  "Kendrapara (କେନ୍ଦ୍ରାପଡ଼ା)",
  "Kendujhar (କେନ୍ଦୁଝର)",
  "Khordha (ଖୋର୍ଦ୍ଧା)",
  "Koraput (କୋରାପୁଟ)",
  "Malkangiri (ମାଲକାନଗିରି)",
  "Mayurbhanj (ମୟୂରଭଞ୍ଜ)",
  "Nabarangpur (ନବରଙ୍ଗପୁର)",
  "Nayagarh (ନୟାଗଡ଼)",
  "Nuapada (ନୂଆପଡ଼ା)",
  "Puri (ପୁରୀ)",
  "Rayagada (ରାୟଗଡ଼ା)",
  "Rourkela (ରାଉରକେଲା)",
  "Sambalpur (ସମ୍ବଲପୁର)",
  "Subarnapur (ସୁବର୍ଣ୍ଣପୁର)",
  "Sundargarh (ସୁନ୍ଦରଗଡ଼)",
];

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
const ADMIN_PAGE_SIZE = 30;

function PaginationControls({
  pagination,
  disabled,
  onPageChange,
}: {
  pagination: PaginationMeta;
  disabled: boolean;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
      <button
        type="button"
        disabled={disabled || pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-xs text-muted">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        type="button"
        disabled={disabled || pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const MAX_ARTICLE_IMAGE_COUNT = 10;
const MAX_ARTICLE_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_ARTICLE_TOTAL_UPLOAD_BYTES = 5 * 1024 * 1024;

const validateArticleImages = (files: FileList | null): string | null => {
  if (!files || files.length === 0) {
    return null;
  }

  if (files.length > MAX_ARTICLE_IMAGE_COUNT) {
    return `You can upload up to ${MAX_ARTICLE_IMAGE_COUNT} images.`;
  }

  let totalSize = 0;

  for (const file of Array.from(files)) {
    totalSize += file.size;

    if (file.size > MAX_ARTICLE_IMAGE_SIZE_BYTES) {
      return `${file.name} is too large. Keep each image under 4MB.`;
    }
  }

  if (totalSize > MAX_ARTICLE_TOTAL_UPLOAD_BYTES) {
    return "Total image upload size is too large. Keep combined images under 5MB.";
  }

  return null;
};

async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is missing in the deployment environment.",
    );
  }

  const method = (options?.method || "GET").toUpperCase();
  const token = localStorage.getItem("srishti-news-admin-token");
  const headers = new Headers(options?.headers);

  // GET endpoints are public. Avoiding Authorization here prevents an
  // unnecessary CORS preflight and makes list loading faster.
  if (token && method !== "GET" && method !== "HEAD") {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const maxAttempts = method === "GET" ? 3 : 1;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        method,
        headers,
        cache: "no-store",
      });

      if (response.status === 401) {
        localStorage.removeItem("srishti-news-admin-token");
        setTimeout(() => window.location.reload(), 0);
        throw new Error("Session expired. Please login again.");
      }

      const contentType = response.headers.get("content-type") || "";
      const json = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (response.ok && json?.success) {
        return json as ApiResponse<T>;
      }

      const message =
        json?.message ||
        `Backend request failed with status ${response.status}.`;

      if (
        method === "GET" &&
        [500, 502, 503, 504].includes(response.status) &&
        attempt < maxAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
        continue;
      }

      throw new Error(message);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unable to reach the backend.");

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
        continue;
      }
    }
  }

  throw new Error(
    lastError?.message ||
      "Unable to reach the backend. Check NEXT_PUBLIC_BASE_URL and CORS.",
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  const [articlePagination, setArticlePagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: ADMIN_PAGE_SIZE,
    totalPages: 1,
  });
  const [videoPagination, setVideoPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: ADMIN_PAGE_SIZE,
    totalPages: 1,
  });
  const [reporterPagination, setReporterPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: ADMIN_PAGE_SIZE,
    totalPages: 1,
  });
  const [adPagination, setAdPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: ADMIN_PAGE_SIZE,
    totalPages: 1,
  });

  const [articleEditId, setArticleEditId] = useState<string | null>(null);
  const [videoEditId, setVideoEditId] = useState<string | null>(null);
  const [reporterEditId, setReporterEditId] = useState<string | null>(null);
  const [adEditId, setAdEditId] = useState<string | null>(null);

  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    district: "",
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
    content: "",
    district: "",
    reporter: "",
    tags: "",
    youtubeUrl: "",
    isPublished: false,
    isFeatured: false,
    isTrending: false,
    isFlash: false,
    isEditorsPick: false,
  });

  const [reporterForm, setReporterForm] = useState({
    serialNumber: "",
    reporterId: "",
    name: "",
    designation: "",
    message: "",
    district: "",
    validUpto: "",
  });
  const [reporterPhoto, setReporterPhoto] = useState<File | null>(null);

  const [adForm, setAdForm] = useState({
    title: "",
    description: "",
    link: "",
    placement: "homepage",
    isActive: true,
    startDate: "",
    endDate: "",
  });
  const [adImages, setAdImages] = useState<FileList | null>(null);
  const [adVideos, setAdVideos] = useState<FileList | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("srishti-news-admin-token");
    setIsAuthed(!!token);
    setAuthReady(true);
  }, []);

  const loadArticles = async (page = articlePagination.page) => {
    const response = await apiRequest<{
      articles: Article[];
      pagination: PaginationMeta;
    }>(
      `/api/articles?page=${page}&limit=${ADMIN_PAGE_SIZE}&sortBy=createdAt&order=desc`,
    );
    setArticles(response.data?.articles || []);
    setArticlePagination(
      response.data?.pagination || {
        total: response.data?.articles?.length || 0,
        page,
        limit: ADMIN_PAGE_SIZE,
        totalPages: 1,
      },
    );
  };

  const loadVideos = async (page = videoPagination.page) => {
    const response = await apiRequest<{
      videos: Video[];
      pagination: PaginationMeta;
    }>(
      `/api/videos?page=${page}&limit=${ADMIN_PAGE_SIZE}&sortBy=createdAt&order=desc`,
    );
    setVideos(response.data?.videos || []);
    setVideoPagination(
      response.data?.pagination || {
        total: response.data?.videos?.length || 0,
        page,
        limit: ADMIN_PAGE_SIZE,
        totalPages: 1,
      },
    );
  };

  const loadReporters = async (page = reporterPagination.page) => {
    const response = await apiRequest<{
      reporters: Reporter[];
      pagination: PaginationMeta;
    }>(
      `/api/reporters?page=${page}&limit=${ADMIN_PAGE_SIZE}&sortBy=serialNumber&order=asc`,
    );
    setReporters(response.data?.reporters || []);
    setReporterPagination(
      response.data?.pagination || {
        total: response.data?.reporters?.length || 0,
        page,
        limit: ADMIN_PAGE_SIZE,
        totalPages: 1,
      },
    );
  };

  const loadAdvertisements = async (page = adPagination.page) => {
    const response = await apiRequest<{
      advertisements: Advertisement[];
      pagination: PaginationMeta;
    }>(
      `/api/advertisements?page=${page}&limit=${ADMIN_PAGE_SIZE}&sortBy=createdAt&order=desc`,
    );
    setAdvertisements(response.data?.advertisements || []);
    setAdPagination(
      response.data?.pagination || {
        total: response.data?.advertisements?.length || 0,
        page,
        limit: ADMIN_PAGE_SIZE,
        totalPages: 1,
      },
    );
  };

  const loadTab = async (tab: TabType, page?: number) => {
    setLoadingList(true);
    setStatus("");

    try {
      if (tab === "articles")
        await loadArticles(page ?? articlePagination.page);
      if (tab === "videos") await loadVideos(page ?? videoPagination.page);
      if (tab === "reporters")
        await loadReporters(page ?? reporterPagination.page);
      if (tab === "advertisements") {
        await loadAdvertisements(page ?? adPagination.page);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load records.";
      setStatus(`Error loading ${tab}: ${message}`);
    } finally {
      setLoadingList(false);
    }
  };

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    void loadTab(tab);
  };

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    void loadTab("articles", 1);
  }, [isAuthed]);

  const withBusy = async (work: () => Promise<void>, message: string) => {
    setBusy(true);
    setStatus("");
    try {
      await work();
      setStatus(message);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginBusy(true);
    setAuthError("");

    try {
      if (!API_BASE) throw new Error("API base URL not configured");

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Login failed");
      }

      localStorage.setItem("srishti-news-admin-token", json.data.token);
      setIsAuthed(true);
      setAuthError("");
      setLoginUsername("");
      setLoginPassword("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("srishti-news-admin-token");
    setIsAuthed(false);
  };

  const resetArticleForm = () => {
    setArticleEditId(null);
    setArticleForm({
      title: "",
      content: "",
      district: "",
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
      content: "",
      district: "",
      reporter: "",
      tags: "",
      youtubeUrl: "",
      isPublished: false,
      isFeatured: false,
      isTrending: false,
      isFlash: false,
      isEditorsPick: false,
    });
  };

  const resetReporterForm = () => {
    setReporterEditId(null);
    setReporterForm({
      serialNumber: "",
      reporterId: "",
      name: "",
      designation: "",
      message: "",
      district: "",
      validUpto: "",
    });
    setReporterPhoto(null);
  };

  const resetAdForm = () => {
    setAdEditId(null);
    setAdForm({
      title: "",
      description: "",
      link: "",
      placement: "homepage",
      isActive: true,
      startDate: "",
      endDate: "",
    });
    setAdImages(null);
    setAdVideos(null);
  };

  const submitArticle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void withBusy(
      async () => {
        const imageValidationError = validateArticleImages(articleImages);
        if (imageValidationError) {
          throw new Error(imageValidationError);
        }

        const formData = new FormData();
        formData.append("title", articleForm.title);
        formData.append("content", articleForm.content);
        formData.append("district", articleForm.district);
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
      },
      articleEditId ? "Article updated" : "Article created",
    );
  };

  const editArticle = (article: Article) => {
    setArticleEditId(article._id);
    setArticleForm({
      title: article.title,
      content: article.content || "",
      district: article.district || "",
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

    void withBusy(
      async () => {
        const body = {
          title: videoForm.title,
          content: videoForm.content,
          district: videoForm.district,
          reporter: videoForm.reporter,
          tags: JSON.stringify(parseTags(videoForm.tags)),
          youtubeUrl: videoForm.youtubeUrl,
          isPublished: String(videoForm.isPublished),
          isFeatured: String(videoForm.isFeatured),
          isTrending: String(videoForm.isTrending),
          isFlash: String(videoForm.isFlash),
          isEditorsPick: String(videoForm.isEditorsPick),
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
      },
      videoEditId ? "Video updated" : "Video created",
    );
  };

  const editVideo = (video: Video) => {
    setVideoEditId(video._id);
    setVideoForm({
      title: video.title,
      content: video.content || "",
      district: video.district || "",
      reporter: video.reporter,
      tags: video.tags?.join(", ") || "",
      youtubeUrl: video.youtubeUrl || "",
      isPublished: video.isPublished,
      isFeatured: video.isFeatured,
      isTrending: video.isTrending,
      isFlash: video.isFlash,
      isEditorsPick: video.isEditorsPick,
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

    void withBusy(
      async () => {
        const formData = new FormData();
        formData.append("serialNumber", reporterForm.serialNumber);
        formData.append("reporterId", reporterForm.reporterId);
        formData.append("name", reporterForm.name);
        formData.append("designation", reporterForm.designation);
        formData.append("message", reporterForm.message);
        formData.append("district", reporterForm.district);
        formData.append("validUpto", reporterForm.validUpto);
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
      },
      reporterEditId ? "Reporter updated" : "Reporter created",
    );
  };

  const editReporter = (reporter: Reporter) => {
    setReporterEditId(reporter._id);
    setReporterForm({
      serialNumber: reporter.serialNumber ? String(reporter.serialNumber) : "",
      reporterId: reporter.reporterId || "",
      name: reporter.name,
      designation: reporter.designation,
      message: reporter.message || "",
      district: reporter.district || "",
      validUpto: reporter.validUpto || "",
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

  const submitAdvertisement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void withBusy(
      async () => {
        const formData = new FormData();
        formData.append("title", adForm.title);
        formData.append("description", adForm.description);
        formData.append("link", adForm.link);
        formData.append("placement", adForm.placement);
        formData.append("isActive", String(adForm.isActive));
        if (adForm.startDate) formData.append("startDate", adForm.startDate);
        if (adForm.endDate) formData.append("endDate", adForm.endDate);

        if (adImages) {
          Array.from(adImages).forEach((file) => {
            formData.append("images", file);
          });
        }
        if (adVideos) {
          Array.from(adVideos).forEach((file) => {
            formData.append("videos", file);
          });
        }

        const path = adEditId
          ? `/api/advertisements/${adEditId}`
          : "/api/advertisements";
        const method = adEditId ? "PUT" : "POST";

        await apiRequest(path, { method, body: formData });
        await loadAdvertisements();
        resetAdForm();
      },
      adEditId ? "Advertisement updated" : "Advertisement created",
    );
  };

  const editAdvertisement = (ad: Advertisement) => {
    setAdEditId(ad._id);
    setAdForm({
      title: ad.title,
      description: ad.description || "",
      link: ad.link || "",
      placement: ad.placement || "homepage",
      isActive: ad.isActive,
      startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
      endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
    });
    setActiveTab("advertisements");
  };

  const removeAdvertisement = (id: string) => {
    void withBusy(async () => {
      await apiRequest(`/api/advertisements/${id}`, { method: "DELETE" });
      await loadAdvertisements();
      if (adEditId === id) {
        resetAdForm();
      }
    }, "Advertisement deleted");
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Loading admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-surface p-8 shadow-2xl ring-1 ring-border">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15">
                <svg
                  className="h-7 w-7 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Srishti News Admin
              </h1>
              <p className="mt-1 text-sm text-muted">
                Enter your password to continue
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Username"
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                autoComplete="username"
              />
              <input
                type="password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                autoComplete="current-password"
              />
              {authError && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-background transition hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50"
                disabled={
                  !loginUsername.trim() || !loginPassword.trim() || loginBusy
                }
              >
                {loginBusy ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Srishti News Admin Panel
          </p>
        </div>
      </main>
    );
  }

  const tabIcons: Record<TabType, React.ReactNode> = {
    articles: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z"
        />
      </svg>
    ),
    videos: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
    reporters: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
    advertisements: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
        />
      </svg>
    ),
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Top header bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-background">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Srishti News
              </h1>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted transition hover:border-danger/50 hover:text-danger"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5 rounded-xl bg-surface p-1.5 shadow-lg ring-1 ring-border">
          {(
            ["articles", "videos", "reporters", "advertisements"] as TabType[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-accent text-background shadow-md shadow-accent/25"
                  : "text-muted hover:bg-border/50 hover:text-foreground"
              }`}
            >
              {tabIcons[tab]}
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Status toast */}
        {status && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ring-1 ${
              status.toLowerCase().includes("error") ||
              status.toLowerCase().includes("fail")
                ? "bg-danger/10 text-danger ring-danger/20"
                : "bg-success/10 text-success ring-success/20"
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {status.toLowerCase().includes("error") ||
              status.toLowerCase().includes("fail") ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            {status}
          </div>
        )}

        {activeTab === "articles" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form
              onSubmit={submitArticle}
              className="space-y-4 rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border"
            >
              <h2 className="text-lg font-bold text-foreground">
                {articleEditId ? "Update Article" : "Create Article"}
              </h2>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                className="h-32 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Content"
                value={articleForm.content}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              <select
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={articleForm.district}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    district: event.target.value,
                  }))
                }
              >
                <option value="">Select District (optional)</option>
                {odishaDistricts.filter(Boolean).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Tags (comma separated)"
                value={articleForm.tags}
                onChange={(event) =>
                  setArticleForm((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
              />
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
                  onChange={(event) => {
                    const files = event.target.files;
                    const imageValidationError = validateArticleImages(files);

                    if (imageValidationError) {
                      setStatus(imageValidationError);
                      event.target.value = "";
                      setArticleImages(null);
                      return;
                    }

                    setArticleImages(files);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background/50 p-3 md:grid-cols-3">
                {(
                  [
                    ["Publish", "isPublished"],
                    ["Featured", "isFeatured"],
                    ["Flash", "isFlash"],
                    ["Trending", "isTrending"],
                    ["Editor's Pick", "isEditorsPick"],
                  ] as Array<[string, keyof typeof articleForm]>
                ).map(([label, key]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-accent"
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
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background shadow-md shadow-accent/20 transition hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50"
                >
                  {articleEditId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetArticleForm}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-muted hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Articles{" "}
                <span className="ml-1 text-sm font-normal text-muted">
                  ({articlePagination.total})
                </span>
              </h2>
              <div className="max-h-[65vh] space-y-2.5 overflow-auto pr-1">
                {loadingList && (
                  <p className="py-8 text-center text-sm text-muted">
                    Loading articles...
                  </p>
                )}
                {!loadingList && articles.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No articles found.
                  </p>
                )}
                {!loadingList &&
                  articles.map((article) => (
                    <div
                      key={article._id}
                      className="rounded-lg border border-border bg-background p-3.5 text-sm transition hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
                    >
                      <p className="font-bold text-foreground">
                        {article.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {article.district ? `${article.district} • ` : ""}
                        {article.reporter}
                      </p>
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => editArticle(article)}
                          className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-background"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeArticle(article._id)}
                          className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <PaginationControls
                pagination={articlePagination}
                disabled={loadingList}
                onPageChange={(page) => void loadTab("articles", page)}
              />
            </div>
          </section>
        )}

        {activeTab === "videos" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form
              onSubmit={submitVideo}
              className="space-y-4 rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border"
            >
              <h2 className="text-lg font-bold text-foreground">
                {videoEditId ? "Update Video" : "Create Video"}
              </h2>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Title"
                value={videoForm.title}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
              <textarea
                className="h-24 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Content"
                value={videoForm.content}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              <select
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={videoForm.district}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    district: event.target.value,
                  }))
                }
              >
                <option value="">Select District (optional)</option>
                {odishaDistricts.filter(Boolean).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Tags (comma separated)"
                value={videoForm.tags}
                onChange={(event) =>
                  setVideoForm((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background/50 p-3">
                {(
                  [
                    ["Publish", "isPublished"],
                    ["Featured", "isFeatured"],
                    ["Trending", "isTrending"],
                    ["Flash", "isFlash"],
                    ["Editor's Pick", "isEditorsPick"],
                  ] as Array<[string, keyof typeof videoForm]>
                ).map(([label, key]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-accent"
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
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background shadow-md shadow-accent/20 transition hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50"
                >
                  {videoEditId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetVideoForm}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-muted hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Videos{" "}
                <span className="ml-1 text-sm font-normal text-muted">
                  ({videoPagination.total})
                </span>
              </h2>
              <div className="max-h-[65vh] space-y-2.5 overflow-auto pr-1">
                {loadingList && (
                  <p className="py-8 text-center text-sm text-muted">
                    Loading videos...
                  </p>
                )}
                {!loadingList && videos.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No videos found.
                  </p>
                )}
                {!loadingList &&
                  videos.map((video) => (
                    <div
                      key={video._id}
                      className="rounded-lg border border-border bg-background p-3.5 text-sm transition hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
                    >
                      <p className="font-bold text-foreground">{video.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {video.district ? `${video.district} • ` : ""}
                        {video.reporter}
                      </p>
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => editVideo(video)}
                          className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-background"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeVideo(video._id)}
                          className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <PaginationControls
                pagination={videoPagination}
                disabled={loadingList}
                onPageChange={(page) => void loadTab("videos", page)}
              />
            </div>
          </section>
        )}

        {activeTab === "reporters" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form
              onSubmit={submitReporter}
              className="space-y-4 rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border"
            >
              <h2 className="text-lg font-bold text-foreground">
                {reporterEditId ? "Update Reporter" : "Create Reporter"}
              </h2>

              <input
                type="number"
                min="1"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Serial Number"
                value={reporterForm.serialNumber}
                onChange={(event) =>
                  setReporterForm((current) => ({
                    ...current,
                    serialNumber: event.target.value,
                  }))
                }
                required
              />

              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Reporter ID"
                value={reporterForm.reporterId}
                onChange={(event) =>
                  setReporterForm((current) => ({
                    ...current,
                    reporterId: event.target.value,
                  }))
                }
              />

              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                className="h-24 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Message"
                value={reporterForm.message}
                onChange={(event) =>
                  setReporterForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
              <select
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={reporterForm.district}
                onChange={(event) =>
                  setReporterForm((current) => ({
                    ...current,
                    district: event.target.value,
                  }))
                }
              >
                <option value="">Select District (optional)</option>
                {odishaDistricts.filter(Boolean).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div>
                <label
                  htmlFor="reporterValidUpto"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Valid Up To
                </label>

                <input
                  id="reporterValidUpto"
                  type="date"
                  className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  value={reporterForm.validUpto}
                  onClick={(event) => {
                    event.currentTarget.showPicker?.();
                  }}
                  onChange={(event) =>
                    setReporterForm((current) => ({
                      ...current,
                      validUpto: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
                  onChange={(event) =>
                    setReporterPhoto(event.target.files?.[0] || null)
                  }
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background shadow-md shadow-accent/20 transition hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50"
                >
                  {reporterEditId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetReporterForm}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-muted hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Reporters{" "}
                <span className="ml-1 text-sm font-normal text-muted">
                  ({reporterPagination.total})
                </span>
              </h2>
              <div className="max-h-[65vh] space-y-2.5 overflow-auto pr-1">
                {loadingList && (
                  <p className="py-8 text-center text-sm text-muted">
                    Loading reporters...
                  </p>
                )}
                {!loadingList && reporters.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No reporters found.
                  </p>
                )}
                {!loadingList &&
                  reporters.map((reporter) => (
                    <div
                      key={reporter._id}
                      className="rounded-lg border border-border bg-background p-3.5 text-sm transition hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
                    >
                      <p className="font-bold text-foreground">
                        {reporter.serialNumber
                          ? `${reporter.serialNumber}. `
                          : ""}
                        {reporter.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {reporter.designation}
                        {reporter.district ? ` • ${reporter.district}` : ""}
                      </p>

                      {reporter.reporterId && (
                        <p className="mt-1 text-xs text-muted">
                          Reporter ID:{" "}
                          <span className="font-semibold text-foreground">
                            {reporter.reporterId}
                          </span>
                        </p>
                      )}

                      {reporter.validUpto && (
                        <p className="mt-0.5 text-xs text-muted">
                          Valid Up To:{" "}
                          <span className="font-semibold text-foreground">
                            {reporter.validUpto.split("T")[0]}
                          </span>
                        </p>
                      )}
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => editReporter(reporter)}
                          className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-background"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeReporter(reporter._id)}
                          className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <PaginationControls
                pagination={reporterPagination}
                disabled={loadingList}
                onPageChange={(page) => void loadTab("reporters", page)}
              />
            </div>
          </section>
        )}

        {activeTab === "advertisements" && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form
              onSubmit={submitAdvertisement}
              className="space-y-4 rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border"
            >
              <h2 className="text-lg font-bold text-foreground">
                {adEditId ? "Update Advertisement" : "Create Advertisement"}
              </h2>
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Title"
                value={adForm.title}
                onChange={(event) =>
                  setAdForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
              <textarea
                className="h-24 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Description"
                value={adForm.description}
                onChange={(event) =>
                  setAdForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
              <input
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Link URL (e.g. https://example.com)"
                value={adForm.link}
                onChange={(event) =>
                  setAdForm((current) => ({
                    ...current,
                    link: event.target.value,
                  }))
                }
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Placement
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={adForm.placement}
                    onChange={(event) =>
                      setAdForm((current) => ({
                        ...current,
                        placement: event.target.value,
                      }))
                    }
                  >
                    {placements.map((p) => (
                      <option key={p} value={p}>
                        {p[0].toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2.5 text-sm font-semibold text-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-accent"
                      checked={adForm.isActive}
                      onChange={(event) =>
                        setAdForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={adForm.startDate}
                    onChange={(event) =>
                      setAdForm((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    value={adForm.endDate}
                    onChange={(event) =>
                      setAdForm((current) => ({
                        ...current,
                        endDate: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Images (max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
                  onChange={(event) => setAdImages(event.target.files)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Videos (max 3)
                </label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent"
                  onChange={(event) => setAdVideos(event.target.files)}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-background shadow-md shadow-accent/20 transition hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50"
                >
                  {adEditId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetAdForm}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-muted hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-surface p-6 shadow-lg ring-1 ring-border">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Advertisements{" "}
                <span className="ml-1 text-sm font-normal text-muted">
                  ({adPagination.total})
                </span>
              </h2>
              <div className="max-h-[65vh] space-y-2.5 overflow-auto pr-1">
                {loadingList && (
                  <p className="py-8 text-center text-sm text-muted">
                    Loading advertisements...
                  </p>
                )}
                {!loadingList && advertisements.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No advertisements found.
                  </p>
                )}
                {!loadingList &&
                  advertisements.map((ad) => (
                    <div
                      key={ad._id}
                      className="rounded-lg border border-border bg-background p-3.5 text-sm transition hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
                    >
                      <p className="font-bold text-foreground">{ad.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 font-bold text-accent">
                          {ad.placement}
                        </span>
                        {ad.isActive ? (
                          <span className="rounded-full bg-success/15 px-2 py-0.5 font-bold text-success">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-danger/15 px-2 py-0.5 font-bold text-danger">
                            Inactive
                          </span>
                        )}
                        <span className="text-muted">
                          {ad.images.length} img • {ad.videos.length} vid
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        Views: {ad.views} • Clicks: {ad.clicks}
                      </p>
                      {ad.link && (
                        <p className="mt-0.5 truncate text-xs text-accent">
                          {ad.link}
                        </p>
                      )}
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => editAdvertisement(ad)}
                          className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-background"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeAdvertisement(ad._id)}
                          className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <PaginationControls
                pagination={adPagination}
                disabled={loadingList}
                onPageChange={(page) => void loadTab("advertisements", page)}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
