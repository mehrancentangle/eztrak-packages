import { cn } from "../../utils/cn";
import type { CardSkeletonProps, CardSkeletonVariant } from "./types";

const DEFAULT_LINE_WIDTHS = ["w-32", "w-48"];

function shouldShowAvatar(
  variant: CardSkeletonVariant,
  showAvatar: boolean | undefined
) {
  return showAvatar ?? variant === "profile";
}

function shouldShowImage(
  variant: CardSkeletonVariant,
  showImage: boolean | undefined
) {
  return showImage ?? variant === "image";
}

function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-10 h-10 text-gray-200 dark:text-gray-700", className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
    </svg>
  );
}

function SkeletonBlock({
  widthClass,
  className,
  isFirst,
}: {
  widthClass: string;
  className?: string;
  isFirst: boolean;
}) {
  return (
    <div
      className={cn(
        isFirst ? "h-2.5 mb-2" : "h-2",
        "bg-gray-200 rounded-full dark:bg-gray-700",
        widthClass,
        className
      )}
    />
  );
}

export function CardSkeleton({
  variant = "profile",
  count = 1,
  lines = 2,
  lineWidths = DEFAULT_LINE_WIDTHS,
  showAvatar,
  showImage,
  animationDuration = "0.7s",
  className,
  style,
  avatarClassName,
  imageClassName,
  contentClassName,
  lineClassName,
  srLabel = "Loading...",
  ...props
}: CardSkeletonProps) {
  const skeletons = Array.from({ length: Math.max(1, count) }, (_, index) => {
    const renderAvatar = shouldShowAvatar(variant, showAvatar);
    const renderImage = shouldShowImage(variant, showImage);

    return (
      <div
        key={index}
        className={cn("animate-pulse md:p-6 dark:border-gray-700", className)}
        style={{ animationDuration, ...style }}
        {...props}
      >
        {renderImage ? (
          <div
            className={cn(
              "mb-4 h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700",
              imageClassName
            )}
          />
        ) : null}
        <div className={cn("flex items-center mt-4 gap-4", contentClassName)}>
          {renderAvatar ? <AvatarSkeleton className={avatarClassName} /> : null}
          <div>
            {Array.from({ length: Math.max(1, lines) }, (_, lineIndex) => (
              <SkeletonBlock
                key={lineIndex}
                widthClass={
                  lineWidths[lineIndex] ??
                  lineWidths[lineWidths.length - 1] ??
                  DEFAULT_LINE_WIDTHS[1]
                }
                className={lineClassName}
                isFirst={lineIndex === 0}
              />
            ))}
          </div>
        </div>
        <span className="sr-only">{srLabel}</span>
      </div>
    );
  });

  return <>{skeletons}</>;
}
