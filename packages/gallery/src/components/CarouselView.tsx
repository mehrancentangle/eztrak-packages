import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import type { CarouselViewProps } from "../types";
import { buildFullUrl } from "../utils/fileUtils";
import { cn } from "../utils/cn";

export function CarouselView({
  images,
  baseUrl = "",
  selectedIndex,
  onIndexChange,
  onImageClick,
  showThumbnails = true,
  thumbnailSize = 60,
}: CarouselViewProps) {
  const goNext = useCallback(() => {
    onIndexChange(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  }, [selectedIndex, images.length, onIndexChange]);

  const goPrev = useCallback(() => {
    onIndexChange(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  }, [selectedIndex, images.length, onIndexChange]);

  const currentImage = images[selectedIndex];
  if (!currentImage) return null;

  const fullUrl = buildFullUrl(currentImage.url, baseUrl);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main image area */}
      <div className="relative w-full flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden min-h-[300px] max-h-[500px]">
        {images.length > 1 && (
          <button
            type="button"
            className="absolute left-3 z-10 p-2 rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white hover:shadow-lg transition-all"
            onClick={goPrev}
            aria-label="Previous"
          >
            <BsChevronLeft size={18} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={`${selectedIndex}-${currentImage.url}`}
            src={fullUrl}
            alt={currentImage.name || `Image ${selectedIndex + 1}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="max-h-[480px] max-w-full object-contain cursor-pointer p-4"
            onClick={() => onImageClick(currentImage, selectedIndex)}
            draggable={false}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <button
            type="button"
            className="absolute right-3 z-10 p-2 rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white hover:shadow-lg transition-all"
            onClick={goNext}
            aria-label="Next"
          >
            <BsChevronRight size={18} />
          </button>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1 max-w-full">
          {images.map((img, i) => {
            const thumbUrl = buildFullUrl(img.url, baseUrl);
            return (
              <button
                key={img.id ?? i}
                type="button"
                onClick={() => onIndexChange(i)}
                className={cn(
                  "shrink-0 rounded-lg overflow-hidden transition-all border-2",
                  selectedIndex === i
                    ? "border-blue-500 shadow-md scale-105"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
                style={{ width: thumbnailSize, height: thumbnailSize }}
              >
                <img
                  src={thumbUrl}
                  alt={img.name || `Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
