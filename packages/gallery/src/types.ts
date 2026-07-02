import type { ReactNode } from "react";

export interface GalleryImage {
  id?: string | number;
  url: string;
  name?: string;
  /** Original/server URL for API operations (rotate, delete) */
  serverUrl?: string;
  [key: string]: unknown;
}

export type ViewMode = "grid" | "carousel" | "list";

export type RotationDegree = 0 | 90 | 180 | 270;

export interface GalleryCarouselProps {
  images: GalleryImage[];
  /** Base URL to prefix relative image paths */
  baseUrl?: string;
  /** Initial view mode */
  viewMode?: ViewMode;
  /** Allow switching between view modes */
  enableViewModeSwitch?: boolean;
  /** Initial image index to display */
  initialIndex?: number;

  // Feature flags
  enableDownload?: boolean;
  enableRotate?: boolean;
  enableDelete?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  /** Allow selecting multiple images */
  enableMultiSelect?: boolean;

  // Callbacks
  onDownload?: (image: GalleryImage, index: number) => void;
  onDownloadMultiple?: (images: GalleryImage[]) => void;
  onRotate?: (image: GalleryImage, index: number) => void;
  onDelete?: (image: GalleryImage, index: number) => void;
  onImageClick?: (image: GalleryImage, index: number) => void;
  onViewModeChange?: (mode: ViewMode) => void;

  // Appearance
  className?: string;
  thumbnailSize?: string;
  imageHeight?: string;
  imageWidth?: string;
  maxVisibleItems?: number;
  columns?: number;
  gap?: string;
  /** z-index for fullscreen overlay */
  zIndex?: number;
  /** Show image filename below thumbnail */
  showFileName?: boolean;
  /** Show image counter info */
  showImageInfo?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom empty state renderer */
  renderEmpty?: () => ReactNode;
}

export interface ImagePreviewProps {
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  baseUrl?: string;

  enableDownload?: boolean;
  enableRotate?: boolean;
  enableDelete?: boolean;
  enableZoom?: boolean;

  onDownload?: (image: GalleryImage, index: number) => void;
  onRotate?: (image: GalleryImage, index: number) => void;
  onDelete?: (image: GalleryImage, index: number) => void;

  /** Cache-busting version map: { [imageUrl]: timestamp } */
  imageVersions?: Record<string, number>;
  showImageInfo?: boolean;
  showThumbnails?: boolean;
  zIndex?: number;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  zIndex?: number;
}

export interface GridViewProps {
  images: GalleryImage[];
  baseUrl?: string;
  onImageClick: (image: GalleryImage, index: number) => void;
  onDelete?: (image: GalleryImage, index: number) => void;
  enableDelete?: boolean;
  enableMultiSelect?: boolean;
  selectedImages?: Set<number>;
  onToggleSelect?: (index: number) => void;
  thumbnailSize?: string;
  imageHeight?: string;
  imageWidth?: string;
  columns?: number;
  gap?: string;
  maxVisibleItems?: number;
  showFileName?: boolean;
  onShowMore?: () => void;
}

export interface CarouselViewProps {
  images: GalleryImage[];
  baseUrl?: string;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onImageClick: (image: GalleryImage, index: number) => void;
  showThumbnails?: boolean;
  thumbnailSize?: number;
}

export interface ListViewProps {
  images: GalleryImage[];
  baseUrl?: string;
  onImageClick: (image: GalleryImage, index: number) => void;
  onDelete?: (image: GalleryImage, index: number) => void;
  onDownload?: (image: GalleryImage, index: number) => void;
  enableDelete?: boolean;
  enableDownload?: boolean;
  enableMultiSelect?: boolean;
  selectedImages?: Set<number>;
  onToggleSelect?: (index: number) => void;
  showFileName?: boolean;
  gap?: string;
}
