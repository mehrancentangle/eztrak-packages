import { useCallback } from "react";
import { BsDownload } from "react-icons/bs";
import type { GalleryCarouselProps } from "../types";
import { downloadImage, downloadMultipleImages } from "../utils/imageUtils";
import { isImageFile } from "../utils/fileUtils";
import { cn } from "../utils/cn";
import { useGalleryState } from "../hooks/useGalleryState";
import { GridView } from "./GridView";
import { CarouselView } from "./CarouselView";
import { ListView } from "./ListView";
import { ImagePreview } from "./ImagePreview";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

export function GalleryCarousel({
  images,
  baseUrl = "",
  viewMode: controlledViewMode,
  enableViewModeSwitch = true,
  initialIndex = 0,
  enableDownload = true,
  enableRotate = false,
  enableDelete = false,
  enableZoom = true,
  enableFullscreen = true,
  enableMultiSelect = false,
  onDownload,
  onDownloadMultiple,
  onRotate,
  onDelete,
  onImageClick,
  onViewModeChange,
  className,
  thumbnailSize = "w-28 h-28",
  imageHeight = "112px",
  imageWidth = "112px",
  maxVisibleItems,
  columns,
  gap = "gap-2",
  zIndex = 1250,
  showFileName = false,
  showImageInfo = true,
  isLoading = false,
  emptyMessage = "No images found",
  renderEmpty,
}: GalleryCarouselProps) {
  const {
    normalizedImages,
    imageOnlyFiles,
    selectedIndex,
    setSelectedIndex,
    viewMode: internalViewMode,
    setViewMode: setInternalViewMode,
    isPreviewOpen,
    openPreview,
    closePreview,
    selectedImages,
    toggleSelect,
    clearSelection,
    getSelectedImages,
  } = useGalleryState({
    images,
    initialIndex,
    initialViewMode: controlledViewMode ?? "grid",
  });

  const viewMode = controlledViewMode ?? internalViewMode;

  const handleViewModeChange = useCallback(
    (mode: typeof viewMode) => {
      setInternalViewMode(mode);
      onViewModeChange?.(mode);
    },
    [setInternalViewMode, onViewModeChange],
  );

  const handleImageClick = useCallback(
    (image: (typeof normalizedImages)[number], index: number) => {
      if (onImageClick) {
        onImageClick(image, index);
        return;
      }
      if (isImageFile(image.url)) {
        const imageIndex = imageOnlyFiles.findIndex(
          (img) => img.url === image.url,
        );
        openPreview(imageIndex >= 0 ? imageIndex : 0);
      }
    },
    [onImageClick, imageOnlyFiles, openPreview],
  );

  const handleDownload = useCallback(
    async (image: (typeof normalizedImages)[number], index: number) => {
      if (onDownload) {
        onDownload(image, index);
      } else {
        await downloadImage(image, baseUrl);
      }
    },
    [onDownload, baseUrl],
  );

  const handleDownloadSelected = useCallback(async () => {
    const selected = getSelectedImages();
    if (selected.length === 0) return;
    if (onDownloadMultiple) {
      onDownloadMultiple(selected);
    } else {
      await downloadMultipleImages(selected, baseUrl);
    }
    clearSelection();
  }, [getSelectedImages, onDownloadMultiple, baseUrl, clearSelection]);

  if (isLoading) {
    return (
      <div className={cn("flex justify-center items-center py-12", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  if (normalizedImages.length === 0) {
    if (renderEmpty) return <div className={className}>{renderEmpty()}</div>;
    return (
      <div className={cn("text-gray-400 text-center py-8", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Toolbar */}
      {(enableViewModeSwitch || (enableMultiSelect && selectedImages.size > 0)) && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {enableViewModeSwitch && (
              <ViewModeSwitcher
                viewMode={viewMode}
                onChange={handleViewModeChange}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {enableMultiSelect && selectedImages.size > 0 && (
              <>
                <span className="text-sm text-gray-500">
                  {selectedImages.size} selected
                </span>
                {enableDownload && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    onClick={handleDownloadSelected}
                  >
                    <BsDownload size={14} />
                    Download
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm text-gray-400 hover:text-gray-600"
                  onClick={clearSelection}
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* View Content */}
      {viewMode === "grid" && (
        <GridView
          images={normalizedImages}
          baseUrl={baseUrl}
          onImageClick={handleImageClick}
          onDelete={onDelete}
          enableDelete={enableDelete}
          enableMultiSelect={enableMultiSelect}
          selectedImages={selectedImages}
          onToggleSelect={toggleSelect}
          thumbnailSize={thumbnailSize}
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          columns={columns}
          gap={gap}
          maxVisibleItems={maxVisibleItems}
          showFileName={showFileName}
          onShowMore={() => openPreview(maxVisibleItems ?? 0)}
        />
      )}

      {viewMode === "carousel" && (
        <CarouselView
          images={normalizedImages}
          baseUrl={baseUrl}
          selectedIndex={selectedIndex}
          onIndexChange={setSelectedIndex}
          onImageClick={handleImageClick}
        />
      )}

      {viewMode === "list" && (
        <ListView
          images={normalizedImages}
          baseUrl={baseUrl}
          onImageClick={handleImageClick}
          onDelete={onDelete}
          onDownload={handleDownload}
          enableDelete={enableDelete}
          enableDownload={enableDownload}
          enableMultiSelect={enableMultiSelect}
          selectedImages={selectedImages}
          onToggleSelect={toggleSelect}
          gap={gap}
        />
      )}

      {/* Fullscreen Image Preview */}
      <ImagePreview
        images={imageOnlyFiles}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        initialIndex={selectedIndex}
        baseUrl={baseUrl}
        enableDownload={enableDownload}
        enableRotate={enableRotate}
        enableDelete={enableDelete}
        enableZoom={enableZoom}
        onDownload={onDownload}
        onRotate={onRotate}
        onDelete={onDelete}
        showImageInfo={showImageInfo}
        zIndex={zIndex}
      />
    </div>
  );
}
