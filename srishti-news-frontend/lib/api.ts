import type { Article, Video, Reporter, Advertisement, Pagination } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

async function fetchApi<T>(
  endpoint: string,
  revalidate = 0,
  retries = 3
): Promise<T | null> {
  const retryableStatuses = [429, 500, 502, 503, 504];

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchOptions: RequestInit = {
        signal: AbortSignal.timeout(15000),
        ...(revalidate === 0
          ? { cache: "no-store" }
          : { next: { revalidate } }),
      };

      const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

      if (res.ok) {
        const json: ApiResponse<T> = await res.json();
        return json.data ?? null;
      }

      const isRetryable = retryableStatuses.includes(res.status);

      // Retry transient backend/gateway/cold-start errors
      if (isRetryable && attempt < retries) {
        const delay = 500 * Math.pow(1.5, attempt) + Math.random() * 300;
        console.warn(
          `[API retry ${attempt + 1}/${retries}] HTTP ${res.status} for ${endpoint}. Retrying in ${Math.round(delay)}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(`API error ${res.status} for ${BASE_URL}${endpoint}`);
      return null;
    } catch (error) {
      if (attempt < retries) {
        const delay = 500 * Math.pow(1.5, attempt) + Math.random() * 300;
        console.warn(
          `[API fetch retry ${attempt + 1}/${retries}] error for ${endpoint}. Retrying in ${Math.round(delay)}ms...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(`API fetch error for ${endpoint}:`, error);
      return null;
    }
  }

  return null;
}

// ─── Articles ───────────────────────────────────────────────────

export async function getArticles(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  return fetchApi<{ articles: Article[]; pagination: Pagination }>(
    `/api/articles${query}`
  );
}

export async function getArticleById(id: string) {
  return fetchApi<Article>(`/api/articles/${id}`);
}

export async function getFlashStories() {
  return fetchApi<Article[]>("/api/articles/flash");
}

export async function getEditorsPicks() {
  return fetchApi<Article[]>("/api/articles/editors-picks");
}

export async function getTrendingStories() {
  return fetchApi<Article[]>("/api/articles/trending");
}

export async function getFeaturedStories() {
  return fetchApi<Article[]>("/api/articles/featured");
}

// ─── Videos ─────────────────────────────────────────────────────

export async function getVideos(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  return fetchApi<{ videos: Video[]; pagination: Pagination }>(
    `/api/videos${query}`
  );
}

export async function getVideoById(id: string) {
  return fetchApi<Video>(`/api/videos/${id}`);
}

export async function getFeaturedVideos() {
  return fetchApi<Video[]>("/api/videos/featured");
}

export async function getTrendingVideos() {
  return fetchApi<Video[]>("/api/videos/trending");
}

export async function getFlashVideos() {
  return fetchApi<Video[]>("/api/videos/flash");
}

export async function getEditorsPickVideos() {
  return fetchApi<Video[]>("/api/videos/editors-picks");
}

// ─── Reporters ──────────────────────────────────────────────────

export async function getReporters(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  return fetchApi<{ reporters: Reporter[]; pagination: Pagination }>(
    `/api/reporters${query}`
  );
}

export async function getReporterById(id: string) {
  return fetchApi<Reporter>(`/api/reporters/${id}`);
}

// ─── Advertisements ─────────────────────────────────────────────

export async function getAdvertisements(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetchApi<{ advertisements: Advertisement[]; pagination: Pagination }>(
    `/api/advertisements${query}`
  );
}

export async function getActiveAds(placement?: string) {
  const query = placement ? `?placement=${placement}` : "";

  const active = await fetchApi<Advertisement[]>(
    `/api/advertisements/active${query}`
  );

  if (active && active.length > 0) {
    return active;
  }

  const all = await fetchApi<{ advertisements: Advertisement[] }>(
    `/api/advertisements${query}`
  );

  if (!all?.advertisements) {
    return [];
  }

  return all.advertisements.filter((ad) => ad.isActive);
}

export async function getAdvertisementById(id: string) {
  return fetchApi<Advertisement>(`/api/advertisements/${id}`);
}

export async function trackAdClick(id: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    await fetch(`${BASE_URL}/api/advertisements/${id}/click`, {
      method: "POST",
    });
  } catch {
    // Ignore tracking errors
  }
}