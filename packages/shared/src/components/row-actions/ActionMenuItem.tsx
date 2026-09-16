import { ToolTip } from "../tooltip/ToolTip";
import { cn } from "../../utils/cn";
import {
  ROW_ACTION_DEFAULT_ICON_SIZE,
  ROW_ACTION_DEFAULT_MENU_TOOLTIP_STYLE,
  ROW_ACTION_ITEM_HOVER_CLASS,
  ROW_ACTION_ITEM_TEXT_CLASS,
} from "./presets";
import type { ActionMenuItemProps } from "./types";

export function ActionMenuItem({
  label,
  icon: Icon,
  iconSize = ROW_ACTION_DEFAULT_ICON_SIZE,
  iconClassName,
  labelClassName,
  tooltip,
  tooltipPlacement = "top",
  tooltipDelayShow,
  tooltipDelayHide,
  tooltipClassName,
  tooltipStyle,
  disabled = false,
  danger = false,
  highlight = false,
  showLabel = true,
  className,
  onClick,
}: ActionMenuItemProps) {
  const tooltipText = tooltip ?? label;

  return (
    <ToolTip
      text={tooltipText}
      disabled={!tooltipText}
      placement={tooltipPlacement}
      delayShow={tooltipDelayShow}
      delayHide={tooltipDelayHide}
      tooltipClassName={tooltipClassName}
      tooltipStyle={{ ...ROW_ACTION_DEFAULT_MENU_TOOLTIP_STYLE, ...tooltipStyle }}
      className={showLabel ? "block w-full" : "inline-flex"}
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
          ROW_ACTION_ITEM_TEXT_CLASS,
          showLabel
            ? "w-full rounded-xl px-3 py-2 text-left"
            : "justify-center rounded-md p-1",
          disabled ? "cursor-not-allowed opacity-50" : ROW_ACTION_ITEM_HOVER_CLASS,
          highlight && !danger && "text-primary-150",
          className,
        )}
      >
        {Icon ? (
          <Icon
            className={cn("shrink-0", iconClassName)}
            aria-hidden
            size={iconSize}
          />
        ) : null}
        {showLabel ? <span className={labelClassName}>{label}</span> : null}
      </button>
    </ToolTip>
  );
}
