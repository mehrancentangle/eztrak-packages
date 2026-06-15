import { useId } from "react";
import { Tooltip } from "react-tooltip";
import type { ToolTipProps } from "./types";

const defaultTooltipStyle = {
  color: "#fff",
  borderRadius: "5px",
  zIndex: 999,
  textAlign: "justify",
  maxWidth: "300px",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  overflowWrap: "break-word",
} as const;

export function ToolTip({
  text = "tool tip",
  placement = "top",
  delayShow,
  delayHide,
  className,
  tooltipClassName,
  tooltipStyle,
  wrapperTabIndex,
  disabled = false,
  children,
}: ToolTipProps) {
  const generatedId = useId();
  const tooltipId = `eztrak-tooltip-${generatedId.replace(/:/g, "")}`;
  const tooltipText = String(text ?? "");

  if (disabled || !tooltipText) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <span
        className={className}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipText}
        tabIndex={wrapperTabIndex}
      >
        {children}
      </span>
      <Tooltip
        id={tooltipId}
        place={placement}
        positionStrategy="fixed"
        delayShow={delayShow}
        delayHide={delayHide}
        className={tooltipClassName}
        style={{ ...defaultTooltipStyle, ...tooltipStyle }}
      />
    </>
  );
}
