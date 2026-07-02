import { BsGrid3X3, BsCardImage, BsListUl } from "react-icons/bs";
import type { ViewMode } from "../types";
import { cn } from "../utils/cn";

interface ViewModeSwitcherProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const modes: { mode: ViewMode; icon: typeof BsGrid3X3; label: string }[] = [
  { mode: "grid", icon: BsGrid3X3, label: "Grid view" },
  { mode: "carousel", icon: BsCardImage, label: "Carousel view" },
  { mode: "list", icon: BsListUl, label: "List view" },
];

export function ViewModeSwitcher({
  viewMode,
  onChange,
  className,
}: ViewModeSwitcherProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-gray-200 bg-white p-0.5", className)}>
      {modes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={viewMode === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "px-2.5 py-1.5 rounded-md text-sm transition-colors",
            viewMode === mode
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
