/**
 * Normalize an image URL.
 * S3 bucket is now public so URLs are served directly.
 * This utility remains as a central place to add CDN rewrites later.
 */
export function getImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  return url;
}
