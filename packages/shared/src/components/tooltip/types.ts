import type { CSSProperties, ReactNode } from "react";
import type { PlacesType } from "react-tooltip";

export interface ToolTipProps {
  text?: string | number | null;
  placement?: PlacesType;
  delayShow?: number;
  delayHide?: number;
  className?: string;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  wrapperTabIndex?: number;
  disabled?: boolean;
  children: ReactNode;
}

export interface TooltipTextProps {
  text?: string | number | null;
  maxLength?: number;
  fallback?: string;
  placement?: PlacesType;
  delayShow?: number;
  delayHide?: number;
  className?: string;
  textClassName?: string;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  showTooltip?: boolean;
  tooltipWhenTruncatedOnly?: boolean;
}
