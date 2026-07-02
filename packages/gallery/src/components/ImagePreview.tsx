import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BsX,
  BsDownload,
  BsArrowClockwise,
  BsTrash,
  BsZoomIn,
  BsZoomOut,
  BsChevronLeft,
  BsChevronRight,
  BsFullscreen,
  BsFullscreenExit,
} from "react-icons/bs";
import type { ImagePreviewProps, GalleryImage } from "../types";
import { getVersionedUrl, getFileName } from "../utils/fileUtils";
import { downloadImage } from "../utils/imageUtils";
import { useImageTransform } from "../hooks/useImageTransform";
import { ConfirmDialog } from "./ConfirmDialog";
import { cn } from "../utils/cn";

const DEFAULT_Z_INDEX = 1250;

function getPreviewRoot() {
  let root = document.getElementById("gallery-preview-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "gallery-preview-root";
    document.body.appendChild(root);
  }
  return root;
}

const TOOLBAR_BTN = cn(
  "p-2 rounded-lg text-white/90 hover:text-white",
  "hover:bg-white/15 transition-colors",
  "disabled:opacity-40 disabled:cursor-not-allowed",
);

export function ImagePreview({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  baseUrl = "",
  enableDownload = true,
  enableRotate = false,
  enableDelete = false,
  enableZoom = true,
  onDownload,
  onRotate,
  onDelete,
  imageVersions,
  showImageInfo = true,
  showThumbnails,
  zIndex = DEFAULT_Z_INDEX,
}: ImagePreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const { transform, transformStyle, rotate, zoomIn, zoomOut, reset } =
    useImageTransform();

  const imageDocs = useMemo<GalleryImage[]>(
    () =>
      images.map((img, i) => ({
        ...img,
        id: img.id ?? `preview-${i}`,
        name: img.name || getFileName(img.url),
      })),
    [images],
  );

  const currentImage = imageDocs[selectedIndex];

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(
        Math.min(initialIndex, Math.max(0, imageDocs.length - 1)),
      );
      reset();
    }
  }, [isOpen, initialIndex, imageDocs.length, reset]);

  useEffect(() => {
    reset();
  }, [selectedIndex, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen?.();
          } else {
            onClose();
          }
          break;
        case "ArrowLeft":
          setSelectedIndex((p) => (p > 0 ? p - 1 : imageDocs.length - 1));
          break;
        case "ArrowRight":
          setSelectedIndex((p) => (p < imageDocs.length - 1 ? p + 1 : 0));
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "r":
          rotate();
          break;
        case "0":
          reset();
          break;
      }
    };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [isOpen, isFullscreen, imageDocs.length, onClose, zoomIn, zoomOut, rotate, reset]);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const handleWheel = useCallback(
    (e: ReactWheelEvent) => {
      if (!enableZoom) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn(0.1);
      else zoomOut(0.1);
    },
    [enableZoom, zoomIn, zoomOut],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (transform.zoom <= 1) return;
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    },
    [transform.zoom],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      // We don't use the pan hook here to avoid re-rendering on every mouse move;
      // instead, we directly update the transform via CSS on the image element.
      // For simplicity, we'll keep using the hook-based approach.
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDownload = useCallback(async () => {
    if (!currentImage) return;
    if (onDownload) {
      onDownload(currentImage, selectedIndex);
    } else {
      await downloadImage(currentImage, baseUrl);
    }
  }, [currentImage, selectedIndex, onDownload, baseUrl]);

  const handleRotate = useCallback(() => {
    if (!currentImage) return;
    rotate();
    onRotate?.(currentImage, selectedIndex);
  }, [currentImage, selectedIndex, onRotate, rotate]);

  const handleDeleteConfirm = useCallback(() => {
    if (!currentImage) return;
    onDelete?.(currentImage, selectedIndex);
    setConfirmDelete(false);
    if (imageDocs.length <= 1) {
      onClose();
    } else if (selectedIndex >= imageDocs.length - 1) {
      setSelectedIndex((p) => Math.max(0, p - 1));
    }
  }, [currentImage, selectedIndex, imageDocs.length, onDelete, onClose]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((p) => (p < imageDocs.length - 1 ? p + 1 : 0));
  }, [imageDocs.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((p) => (p > 0 ? p - 1 : imageDocs.length - 1));
  }, [imageDocs.length]);

  const useThumbnails = showThumbnails ?? imageDocs.length > 1;

  if (!isOpen || imageDocs.length === 0) return null;

  const resolvedUrl = getVersionedUrl(
    currentImage.url,
    baseUrl,
    imageVersions,
  );

  return createPortal(
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 flex flex-col bg-black/95"
        style={{ zIndex }}
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
      >
        {/* Top toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-white/70 text-sm">
            {showImageInfo && (
              <span>
                {currentImage.name}
                {imageDocs.length > 1 &&
                  ` (${selectedIndex + 1} / ${imageDocs.length})`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {enableZoom && (
              <>
                <button
                  type="button"
                  className={TOOLBAR_BTN}
                  onClick={() => zoomOut()}
                  title="Zoom out (-)"
                >
                  <BsZoomOut size={18} />
                </button>
                <span className="text-white/60 text-xs min-w-[3rem] text-center">
                  {Math.round(transform.zoom * 100)}%
                </span>
                <button
                  type="button"
                  className={TOOLBAR_BTN}
                  onClick={() => zoomIn()}
                  title="Zoom in (+)"
                >
                  <BsZoomIn size={18} />
                </button>
              </>
            )}
            {enableRotate && (
              <button
                type="button"
                className={TOOLBAR_BTN}
                onClick={handleRotate}
                title="Rotate 90° (R)"
              >
                <BsArrowClockwise size={18} />
              </button>
            )}
            {enableDownload && (
              <button
                type="button"
                className={TOOLBAR_BTN}
                onClick={handleDownload}
                title="Download"
              >
                <BsDownload size={18} />
              </button>
            )}
            {enableDelete && (
              <button
                type="button"
                className={cn(TOOLBAR_BTN, "hover:bg-red-600/30 text-red-400 hover:text-red-300")}
                onClick={() => setConfirmDelete(true)}
                title="Delete"
              >
                <BsTrash size={18} />
              </button>
            )}
            <button
              type="button"
              className={TOOLBAR_BTN}
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              {isFullscreen ? (
                <BsFullscreenExit size={18} />
              ) : (
                <BsFullscreen size={18} />
              )}
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              type="button"
              className={TOOLBAR_BTN}
              onClick={onClose}
              title="Close (Esc)"
            >
              <BsX size={22} />
            </button>
          </div>
        </div>

        {/* Main image area */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Nav: Previous */}
          {imageDocs.length > 1 && (
            <button
              type="button"
              className="absolute left-4 z-10 p-3 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <BsChevronLeft size={20} />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={`${selectedIndex}-${currentImage.url}`}
              src={resolvedUrl}
              alt={currentImage.name || "Preview"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                ...transformStyle,
                maxHeight: "calc(100vh - 10rem)",
                maxWidth: "90vw",
                objectFit: "contain",
              }}
              draggable={false}
              onDoubleClick={() => {
                if (transform.zoom === 1) zoomIn(1);
                else reset();
              }}
            />
          </AnimatePresence>

          {/* Nav: Next */}
          {imageDocs.length > 1 && (
            <button
              type="button"
              className="absolute right-4 z-10 p-3 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors"
              onClick={goNext}
              aria-label="Next image"
            >
              <BsChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Thumbnails strip */}
        {useThumbnails && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-black/60 overflow-x-auto">
            {imageDocs.map((img, i) => {
              const thumbUrl = getVersionedUrl(img.url, baseUrl, imageVersions);
              return (
                <button
                  key={img.id ?? i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "flex-shrink-0 rounded-lg overflow-hidden transition-all",
                    "w-14 h-14 border-2",
                    selectedIndex === i
                      ? "border-white ring-1 ring-white/50 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
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

      <ConfirmDialog
        isOpen={confirmDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(false)}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        zIndex={zIndex + 100}
      />
    </>,
    getPreviewRoot(),
  );
}
