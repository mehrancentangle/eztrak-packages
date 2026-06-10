import { useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import type {
  ResetFiltersButtonProps,
  ResetFiltersButtonVariant,
} from "./types";

const BASE_STYLES =
  "inline-flex items-center gap-1.5 px-5 py-3 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ResetFiltersButtonVariant, string> = {
  primary:
    "bg-white text-secondary border border-secondary hover:bg-lightGray hover:text-black",
  "primary-outline":
    "bg-white text-primary-150 border border-primary-150 font-bold hover:bg-primary-100 hover:text-white",
  "primary-fill":
    "bg-primary-150 text-white border border-primary-150 hover:bg-primary/90",
  secondary:
    "bg-primary-150 text-white border border-primary-150 hover:bg-primary/90",
  danger: "bg-red-600 text-white border border-red-600 hover:bg-red-700",
  outline: "bg-white text-primary border border-primary hover:bg-primary/10",
  ghost:
    "bg-transparent text-secondary border border-transparent hover:bg-primary/10",
};

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
  variant = "primary-outline",
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
      className={cn(BASE_STYLES, VARIANTS[variant], className)}
    >
      {resolvedIcon}
      {label}
    </button>
  );
}
