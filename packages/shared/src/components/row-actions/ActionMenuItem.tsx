import { ToolTip } from "../tooltip/ToolTip";
import { cn } from "../../utils/cn";
import type { ActionMenuItemProps } from "./types";

const MENU_TOOLTIP_STYLE = { zIndex: 10000 } as const;

export function ActionMenuItem({
  label,
  icon: Icon,
  tooltip,
  disabled = false,
  danger = false,
  highlight = false,
  showLabel = true,
  onClick,
}: ActionMenuItemProps) {
  const tooltipText = tooltip ?? label;

  return (
    <ToolTip
      text={tooltipText}
      disabled={!tooltipText}
      className={showLabel ? "block w-full" : "inline-flex"}
      tooltipStyle={MENU_TOOLTIP_STYLE}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          if (disabled) return;
          onClick();
        }}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors duration-150",
          showLabel
            ? "w-full rounded-xl px-3 py-2 text-left"
            : "justify-center rounded-md p-1",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-primary-50 hover:text-primary-150",
          danger && !disabled && "text-red-500 hover:bg-red-50 hover:text-red-600",
          highlight && !danger && "text-primary-150",
        )}
      >
        {Icon ? <Icon className="shrink-0" aria-hidden size={16} /> : null}
        {showLabel ? <span>{label}</span> : null}
      </button>
    </ToolTip>
  );
}
