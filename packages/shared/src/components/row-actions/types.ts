import type { IconType } from "react-icons";
import type { TippyProps } from "@tippyjs/react";
import type { ConfirmationAlertOptions } from "../../utils/handleApiError";

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

export type RowActionFlag<TRow> = boolean | ((row: TRow | undefined) => boolean);

export type RowAction<TRow = unknown> = {
  /** Unique id. Falls back to `preset` when omitted. */
  key?: string;
  label?: string;
  icon?: IconType;
  preset?: RowActionPresetName;
  onClick: (row: TRow | undefined) => void;
  /** If set, the action is hidden unless `hasPermission(permission)` is true. */
  permission?: string;
  hidden?: RowActionFlag<TRow>;
  disabled?: RowActionFlag<TRow>;
  danger?: boolean;
  highlight?: RowActionFlag<TRow>;
  /** Default = resolved label. `false` hides the tooltip. */
  tooltip?: string | false;
  confirm?: ConfirmationAlertOptions;
  /** Default `true`. */
  closeOnClick?: boolean;
};

export type RowActionsList<TRow = unknown> =
  | RowAction<TRow>[]
  | ((data: TRow | undefined) => RowAction<TRow>[]);

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
  /** Default `"Actions"`. Pass `false` to hide. */
  triggerTooltip?: string | false;
  hasPermission?: (permission: string) => boolean;
  placement?: TippyProps["placement"];
}

export interface ActionMenuItemProps {
  label: string;
  icon?: IconType;
  tooltip?: string;
  disabled?: boolean;
  danger?: boolean;
  highlight?: boolean;
  showLabel?: boolean;
  onClick: () => void;
}

export interface ResolvedRowAction<TRow = unknown> {
  key: string;
  label: string;
  icon?: IconType;
  onClick: (row: TRow | undefined) => void;
  disabled: boolean;
  danger: boolean;
  highlight: boolean;
  tooltip?: string;
  confirm?: ConfirmationAlertOptions;
  closeOnClick: boolean;
}

export interface RowActionPreset {
  label: string;
  icon: IconType;
  danger?: boolean;
}
