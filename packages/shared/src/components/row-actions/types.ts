import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import type { TippyProps } from "@tippyjs/react";
import type { PlacesType } from "react-tooltip";
import type { ConfirmationAlertOptions } from "../../utils/handleApiError";
import type { PopupCellRendererProps } from "../popup-cell-renderer/types";

export type RowActionPresetName =
  | "edit"
  | "delete"
  | "view"
  | "notes"
  | "history"
  | "download"
  | "archive"
  | "resolve";

export type RowActionsMode = "menu" | "inline";

export type RowActionItemType = "item" | "divider";

export type RowActionFlag<TRow> = boolean | ((row: TRow | undefined) => boolean);

export type RowActionConfirmFn = (
  onConfirm: () => void | Promise<void>,
  options?: ConfirmationAlertOptions,
) => void;

export type RowAction<TRow = unknown> = {
  /** Unique id. Falls back to `preset` when omitted. */
  key?: string;
  /** `"divider"` renders a separator. Default `"item"`. */
  type?: RowActionItemType;
  label?: string;
  icon?: IconType;
  /** Overrides `RowActions` `iconSize` for this item. */
  iconSize?: number;
  preset?: RowActionPresetName;
  onClick?: (row: TRow | undefined) => void;
  /** Fully custom row content (skips the default icon+label button). */
  content?: ReactNode;
  /** If set, the action is hidden unless `hasPermission(permission)` is true. */
  permission?: string;
  hidden?: RowActionFlag<TRow>;
  disabled?: RowActionFlag<TRow>;
  danger?: boolean;
  highlight?: RowActionFlag<TRow>;
  /** Default = resolved label. `false` hides the tooltip. */
  tooltip?: string | false;
  tooltipPlacement?: PlacesType;
  confirm?: ConfirmationAlertOptions;
  /** Default `true`. */
  closeOnClick?: boolean;
  /** Extra classes on this item (merged after defaults; can override hover). */
  className?: string;
};

export type RowActionsList<TRow = unknown> =
  | RowAction<TRow>[]
  | ((data: TRow | undefined) => RowAction<TRow>[]);

export interface RowActionsRenderContext<TRow = unknown> {
  data: TRow | undefined;
  actions: ResolvedRowAction<TRow>[];
  hide: () => void;
  defaultMenu: ReactNode;
}

export interface RowActionItemRenderContext<TRow = unknown> {
  data: TRow | undefined;
  hide: () => void;
  defaultItem: ReactNode;
}

export interface RowActionsProps<TRow = unknown> {
  actions: RowActionsList<TRow>;
  data?: TRow;
  mode?: RowActionsMode;
  /** Override the default vertical 3-dots trigger. */
  actionIcon?: IconType;
  /** Extra classes on the trigger button (merged with defaults). */
  className?: string;
  /** Extra classes on the dropdown panel (merged with defaults). */
  menuClassName?: string;
  /**
   * Extra classes on every menu/inline item (merged after defaults).
   * Override hover here, e.g. `hover:bg-gray-100 hover:text-gray-800`.
   */
  itemClassName?: string;
  itemIconClassName?: string;
  /** Default `16`. */
  iconSize?: number;
  /** Default `"Actions"`. Pass `false` to hide. */
  triggerTooltip?: string | false;
  triggerAriaLabel?: string;
  hasPermission?: (permission: string) => boolean;
  placement?: TippyProps["placement"];
  tippyProps?: PopupCellRendererProps<TRow>["tippyProps"];
  /** Override default `Fa*` preset icons/labels for this instance. */
  presets?: Partial<Record<RowActionPresetName, Partial<RowActionPreset>>>;
  /** Default: shared `confirmationAlert`. */
  confirmFn?: RowActionConfirmFn;
  tooltipPlacement?: PlacesType;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  /** Replace one item’s markup. */
  renderItem?: (
    action: ResolvedRowAction<TRow>,
    ctx: RowActionItemRenderContext<TRow>,
  ) => ReactNode;
  /** Replace the dropdown panel. Still opened by the default trigger unless `renderTrigger` is set. */
  renderMenu?: (ctx: RowActionsRenderContext<TRow>) => ReactNode;
  /** Replace trigger + popup engine entirely (e.g. a custom popover). */
  renderTrigger?: (ctx: Omit<RowActionsRenderContext<TRow>, "hide"> & {
    hide: () => void;
  }) => ReactNode;
}

export interface ActionMenuItemProps {
  label: string;
  icon?: IconType;
  iconSize?: number;
  iconClassName?: string;
  tooltip?: string;
  tooltipPlacement?: PlacesType;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  tooltipClassName?: string;
  tooltipStyle?: CSSProperties;
  disabled?: boolean;
  danger?: boolean;
  highlight?: boolean;
  showLabel?: boolean;
  className?: string;
  onClick: () => void;
}

export interface ResolvedRowAction<TRow = unknown> {
  key: string;
  type: RowActionItemType;
  label: string;
  icon?: IconType;
  iconSize?: number;
  content?: ReactNode;
  onClick?: (row: TRow | undefined) => void;
  disabled: boolean;
  danger: boolean;
  highlight: boolean;
  tooltip?: string;
  tooltipPlacement?: PlacesType;
  confirm?: ConfirmationAlertOptions;
  closeOnClick: boolean;
  className?: string;
}

export interface RowActionPreset {
  label: string;
  icon: IconType;
  danger?: boolean;
}
