const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "avif",
]);

export function getFileExtension(url: string): string {
  if (!url) return "";
  return url.split("/").pop()?.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "";
}

export function isImageFile(url: string): boolean {
  return IMAGE_EXTENSIONS.has(getFileExtension(url));
}

export function getFileName(url: string): string {
  if (!url) return "Unknown file";
  if (url.startsWith("blob:") || url.startsWith("data:")) return "Image";
  return url.split("/").pop()?.split("?")[0] || "Unknown file";
}

export function buildFullUrl(url: string, baseUrl = ""): string {
  if (!url) return "";
  if (
    url.startsWith("blob:") ||
    url.startsWith("data:") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }
  const base = baseUrl.replace(/\/$/, "");
  const path = url.startsWith("/") ? url.substring(1) : url;
  return base ? `${base}/${path}` : path;
}

export function getVersionedUrl(
  url: string,
  baseUrl: string,
  versions?: Record<string, number>,
): string {
  const full = buildFullUrl(url, baseUrl);
  if (url.startsWith("blob:") || url.startsWith("data:")) return full;
  const version = versions?.[url];
  if (!version) return full;
  const sep = full.includes("?") ? "&" : "?";
  return `${full}${sep}v=${version}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
