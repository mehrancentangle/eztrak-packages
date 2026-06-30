import type { IconType } from "react-icons";
import type { TippyProps } from "@tippyjs/react";
import type { ReactNode } from "react";

export type PopupActionHandler<TRow = unknown> = (
  actionType: string,
  rowData?: TRow,
) => void;

export type PopupDropDownContent<TRow = unknown> =
  | ReactNode
  | ((handleAction: PopupActionHandler<TRow>) => ReactNode);

export interface PopupCellRendererParams<TRow = unknown> {
  data?: TRow;
  [key: string]: unknown;
}

export interface PopupCellRendererProps<TRow = unknown> {
  dropDownContent: PopupDropDownContent<TRow>;
  actionIcon?: IconType;
  title?: string;
  className?: string;
  hideTitle?: boolean;
  /** AG Grid cell renderer params; row data is read from `params.data`. */
  params?: PopupCellRendererParams<TRow>;
  onAction?: (
    actionType: string,
    rowData: TRow | undefined,
    hide: () => void,
  ) => void;
  placement?: TippyProps["placement"];
  tippyProps?: Omit<
    Partial<TippyProps>,
    "children" | "content" | "visible" | "placement"
  >;
}
