import { useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import type { ResetFiltersButtonProps } from "./types";

function ResetIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export function ResetFiltersButton({
  label = "Reset Filters",
  icon,
  className,
  onReset,
  disabled = false,
}: ResetFiltersButtonProps) {
  const [, setSearchParams] = useSearchParams();

  const handleReset = () => {
    setSearchParams({}, { replace: true });
    onReset?.();
  };

  const resolvedIcon = icon === undefined ? <ResetIcon size={16} /> : icon;

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-primary-150 bg-white px-3 py-1.5 text-sm font-medium text-primary-150 hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white",
        className
      )}
    >
      {resolvedIcon}
      {label}
    </button>
  );
}
