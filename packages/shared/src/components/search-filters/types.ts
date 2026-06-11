import type { InputHTMLAttributes, ReactNode } from "react";

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

export interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "type" | "value" | "onChange" | "defaultValue"
  > {
  placeholder?: string;
  searchBtn?: string;
  searchClassName?: string;
  searchWrapperClass?: string;
  searchIconClassName?: string;
  defaultParam?: string;
  showIcon?: boolean;
  name?: string;
  type?: string;
  liveSearch?: boolean;
  debounceDelay?: number;
  customIcon?: ReactNode | null;
  defaultValue?: string;
}
