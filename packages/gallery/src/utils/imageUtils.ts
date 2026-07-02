import type { GalleryImage } from "../types";
import { buildFullUrl, getFileName } from "./fileUtils";

export async function downloadImage(
  image: GalleryImage,
  baseUrl = "",
): Promise<void> {
  const fullUrl = buildFullUrl(image.url, baseUrl);
  try {
    const response = await fetch(fullUrl, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = image.name || getFileName(image.url);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = image.name || getFileName(image.url);
    link.target = "_blank";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadMultipleImages(
  images: GalleryImage[],
  baseUrl = "",
): Promise<void> {
  for (const image of images) {
    await downloadImage(image, baseUrl);
    await new Promise((r) => setTimeout(r, 300));
  }
}

export function clampRotation(current: number, delta: number): number {
  return ((current + delta) % 360 + 360) % 360;
}

export function clampZoom(
  current: number,
  delta: number,
  min = 0.25,
  max = 5,
): number {
  return Math.min(max, Math.max(min, current + delta));
}
