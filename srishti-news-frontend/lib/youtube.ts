/**
 * Extract the YouTube video ID from various URL formats.
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  return match?.[1] ?? null;
}

/**
 * Get a YouTube embed URL for iframe usage.
 */
export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}`;
}

/**
 * Get the YouTube thumbnail image URL (high quality).
 */
export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
