import { cn } from "../../utils/cn";
import { truncateText } from "../../utils/helpers";
import { ToolTip } from "./ToolTip";
import type { TooltipTextProps } from "./types";

export function TooltipText({
  text = "",
  maxLength = 20,
  fallback = "-",
  placement = "top",
  delayShow,
  delayHide,
  className,
  textClassName,
  tooltipClassName,
  tooltipStyle,
  showTooltip = true,
  tooltipWhenTruncatedOnly = false,
}: TooltipTextProps) {
  const hasValue = text !== null && text !== undefined && text !== "";
  const fullText = hasValue ? String(text) : fallback;
  const displayText = truncateText(fullText, maxLength);
  const isTruncated = displayText !== fullText;
  const tooltipDisabled =
    !showTooltip || !hasValue || (tooltipWhenTruncatedOnly && !isTruncated);

  return (
    <ToolTip
      text={fullText}
      placement={placement}
      delayShow={delayShow}
      delayHide={delayHide}
      className={cn("inline-block max-w-full", className)}
      tooltipClassName={tooltipClassName}
      tooltipStyle={tooltipStyle}
      wrapperTabIndex={tooltipDisabled ? undefined : 0}
      disabled={tooltipDisabled}
    >
      <span className={cn("inline-block max-w-full align-bottom", textClassName)}>
        {displayText}
      </span>
    </ToolTip>
  );
}
