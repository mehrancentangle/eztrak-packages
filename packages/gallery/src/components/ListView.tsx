import { BsDownload, BsTrash, BsZoomIn } from "react-icons/bs";
import type { ListViewProps } from "../types";
import { buildFullUrl, isImageFile, getFileName, getFileExtension } from "../utils/fileUtils";
import { cn } from "../utils/cn";

export function ListView({
  images,
  baseUrl = "",
  onImageClick,
  onDelete,
  onDownload,
  enableDelete = false,
  enableDownload = true,
  enableMultiSelect = false,
  selectedImages,
  onToggleSelect,
  gap = "gap-1",
}: ListViewProps) {
  return (
    <div className={cn("flex flex-col", gap)}>
      {images.map((image, index) => {
        const isImage = isImageFile(image.url);
        const fullUrl = buildFullUrl(image.url, baseUrl);
        const ext = getFileExtension(image.url).toUpperCase();
        const isSelected = selectedImages?.has(index);

        return (
          <div
            key={image.id ?? index}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg",
              "hover:bg-gray-50 transition-colors cursor-pointer group",
              isSelected && "bg-blue-50 ring-1 ring-blue-200",
            )}
            onClick={() => onImageClick(image, index)}
          >
            {enableMultiSelect && (
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded border-2",
                  "flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300",
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

            {/* Thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              {isImage ? (
                <img
                  src={fullUrl}
                  alt={image.name || ""}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-[10px] font-bold">{ext || "FILE"}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">
                {image.name || getFileName(image.url)}
              </p>
              <p className="text-xs text-gray-400 uppercase">{ext}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isImage && (
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                  title="Preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick(image, index);
                  }}
                >
                  <BsZoomIn size={14} />
                </button>
              )}
              {enableDownload && (
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                  title="Download"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(image, index);
                  }}
                >
                  <BsDownload size={14} />
                </button>
              )}
              {enableDelete && (
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-red-50 text-red-400 transition-colors"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(image, index);
                  }}
                >
                  <BsTrash size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
