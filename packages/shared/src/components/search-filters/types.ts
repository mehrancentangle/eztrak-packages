import type { ReactNode } from "react";

export type ResetFiltersButtonVariant =
  | "primary"
  | "primary-outline"
  | "primary-fill"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost";

export interface ResetFiltersButtonProps {
  /** Button label text. Defaults to "Reset Filters". */
  label?: string;
  /** Show the text label. Defaults to true. Set false for an icon-only button. */
  showLabel?: boolean;
  /** Leading icon. Defaults to a reset icon; pass `null` to hide it. */
  icon?: ReactNode;
  /** Visual style variant. Defaults to "primary-outline". */
  variant?: ResetFiltersButtonVariant;
  /** Extra classes merged with the default button styles. */
  className?: string;
  /** Called after the search params are cleared. */
  onReset?: () => void;
  disabled?: boolean;
}
