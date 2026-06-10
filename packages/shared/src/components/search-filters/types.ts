import type { ReactNode } from "react";

export interface ResetFiltersButtonProps {
  /** Button label text. Defaults to "Reset Filters". */
  label?: string;
  /** Leading icon. Defaults to a reset icon; pass `null` to hide it. */
  icon?: ReactNode;
  /** Extra classes merged with the default button styles. */
  className?: string;
  /** Called after the search params are cleared. */
  onReset?: () => void;
  disabled?: boolean;
}
