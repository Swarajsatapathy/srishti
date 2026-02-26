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
  revalidate = 60
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json: ApiResponse<T> = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    return null;
  }
}

// ─── Articles ───────────────────────────────────────────────────

export async function getArticles(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return fetchApi<{ articles: Article[]; pagination: Pagination }>(
    `/api/articles${query}`
  );
}

export async function getArticleById(id: string) {
  return fetchApi<Article>(`/api/articles/${id}`, 30);
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
  return fetchApi<Video>(`/api/videos/${id}`, 30);
}

export async function getFeaturedVideos() {
  return fetchApi<Video[]>("/api/videos/featured");
}

export async function getTrendingVideos() {
  return fetchApi<Video[]>("/api/videos/trending");
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

export async function getActiveAds(placement?: string) {
  const query = placement ? `?placement=${placement}` : "";
  return fetchApi<Advertisement[]>(`/api/advertisements/active${query}`, 30);
}
