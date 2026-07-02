import { useState, useCallback, useMemo } from "react";
import type { GalleryImage, ViewMode } from "../types";
import { isImageFile, getFileName } from "../utils/fileUtils";

export interface UseGalleryStateOptions {
  images: GalleryImage[];
  initialIndex?: number;
  initialViewMode?: ViewMode;
}

export function useGalleryState({
  images,
  initialIndex = 0,
  initialViewMode = "grid",
}: UseGalleryStateOptions) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const normalizedImages = useMemo<GalleryImage[]>(
    () =>
      (images ?? [])
        .filter((img): img is GalleryImage => img != null)
        .map((img, i) => ({
          ...img,
          id: img.id ?? `gallery-img-${i}`,
          name: img.name || getFileName(img.url),
        })),
    [images],
  );

  const imageOnlyFiles = useMemo(
    () => normalizedImages.filter((img) => isImageFile(img.url)),
    [normalizedImages],
  );

  const openPreview = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  const toggleSelect = useCallback((index: number) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedImages(new Set(normalizedImages.map((_, i) => i)));
  }, [normalizedImages]);

  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  const getSelectedImages = useCallback(
    () => Array.from(selectedImages).map((i) => normalizedImages[i]),
    [selectedImages, normalizedImages],
  );

  return {
    normalizedImages,
    imageOnlyFiles,
    selectedIndex,
    setSelectedIndex,
    viewMode,
    setViewMode,
    isPreviewOpen,
    openPreview,
    closePreview,
    selectedImages,
    toggleSelect,
    selectAll,
    clearSelection,
    getSelectedImages,
  };
}
