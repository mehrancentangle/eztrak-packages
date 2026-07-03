import { useMemo } from "react";
import { BsZoomIn, BsTrash } from "react-icons/bs";
import type { GridViewProps, GalleryImage } from "../types";
import { buildFullUrl, isImageFile, getFileName } from "../utils/fileUtils";
import { cn } from "../utils/cn";

export function GridView({
  images,
  baseUrl = "",
  onImageClick,
  onDelete,
  enableDelete = false,
  enableMultiSelect = false,
  selectedImages,
  onToggleSelect,
  thumbnailSize = "w-28 h-28",
  imageHeight = "112px",
  imageWidth = "112px",
  columns,
  gap = "gap-2",
  maxVisibleItems,
  showFileName = false,
  onShowMore,
}: GridViewProps) {
  const visibleImages = useMemo(() => {
    if (maxVisibleItems && maxVisibleItems < images.length) {
      return images.slice(0, maxVisibleItems);
    }
    return images;
  }, [images, maxVisibleItems]);

  const remainingCount =
    maxVisibleItems && images.length > maxVisibleItems
      ? images.length - maxVisibleItems
      : 0;

  const gridStyle = columns
    ? { display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : undefined;

  return (
    <div
      className={cn("flex flex-wrap", gap)}
      style={gridStyle}
    >
      {visibleImages.map((image, index) => {
        const isImage = isImageFile(image.url);
        const fullUrl = buildFullUrl(image.url, baseUrl);
        const isSelected = selectedImages?.has(index);

        return (
          <div
            key={image.id ?? index}
            className={cn(
              thumbnailSize,
              "relative rounded-lg overflow-hidden cursor-pointer",
              "hover:shadow-lg transition-all bg-white group",
              "flex flex-col items-center justify-center",
              isSelected && "ring-2 ring-blue-500 ring-offset-2",
            )}
            onClick={(e) => {
              if (enableMultiSelect && e.ctrlKey) {
                onToggleSelect?.(index);
              } else {
                onImageClick(image, index);
              }
            }}
          >
            {enableMultiSelect && (
              <div
                className={cn(
                  "absolute top-1 left-1 z-10 w-5 h-5 rounded border-2",
                  "flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white/80 border-gray-400",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect?.(index);
                }}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}

            {isImage ? (
              <>
                <img
                  src={fullUrl}
                  alt={image.name || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ height: imageHeight, width: imageWidth }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 rounded-full p-2 pointer-events-none">
                    <BsZoomIn className="text-gray-700" size={20} />
                  </span>
                  {enableDelete && (
                    <button
                      type="button"
                      className="bg-white/90 rounded-full p-2 hover:bg-red-50 transition-colors"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(image, index);
                      }}
                    >
                      <BsTrash className="text-red-600" size={20} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-2">
                <FileIcon url={image.url} />
                <span
                  className="text-xs text-gray-600 mt-1 text-center truncate w-full"
                  style={{ maxWidth: imageWidth }}
                >
                  {getFileName(image.url)}
                </span>
              </div>
            )}

            {showFileName && isImage && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <p className="text-[10px] text-white truncate text-center">
                  {image.name || getFileName(image.url)}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {remainingCount > 0 && (
        <div
          className={cn(
            thumbnailSize,
            "border border-gray-200 rounded-lg overflow-hidden",
            "cursor-pointer hover:shadow-lg transition-shadow",
            "bg-gray-100 flex items-center justify-center",
          )}
          onClick={onShowMore}
        >
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-600">
              +{remainingCount}
            </span>
            <p className="text-xs text-gray-500">more</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon({ url }: { url: string }) {
  const ext = url.split(".").pop()?.toLowerCase() ?? "";
  const colorMap: Record<string, string> = {
    pdf: "text-red-500",
    doc: "text-blue-500",
    docx: "text-blue-500",
    xls: "text-green-500",
    xlsx: "text-green-500",
    ppt: "text-orange-500",
    pptx: "text-orange-500",
  };
  const color = colorMap[ext] ?? "text-gray-500";

  return (
    <svg className={cn("w-10 h-10", color)} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
