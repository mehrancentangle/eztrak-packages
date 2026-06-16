import type { CSSProperties, HTMLAttributes } from "react";

export type CardSkeletonVariant = "profile" | "image" | "content";

export interface CardSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardSkeletonVariant;
  count?: number;
  lines?: number;
  lineWidths?: string[];
  showAvatar?: boolean;
  showImage?: boolean;
  animationDuration?: CSSProperties["animationDuration"];
  avatarClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  lineClassName?: string;
  srLabel?: string;
}
