import type { InputHTMLAttributes, ReactNode } from "react";
import type { Props as SelectProps } from "react-select";

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

export interface DropdownFilterProps<Option extends Record<string, unknown>>
  extends Omit<
    SelectProps<Option, false>,
    "value" | "onChange" | "options" | "styles" | "name"
  > {
  /** URL search param key synced with the selected option. */
  name: string;
  /** Option field used as the search param value. Defaults to "id". */
  valueKey?: string;
  options?: Option[];
  placeholder?: string;
  /** Partial theme overrides merged with the default Eztrak palette. */
  /** Border radius applied to the control, menu, and options. Defaults to "5px". */
  borderRadius?: string;
  /** When true, persists the selected value in localStorage under `name`. */
  saveToLocalStorage?: boolean;
}
