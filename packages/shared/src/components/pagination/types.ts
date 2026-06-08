import type { ReactNode } from "react";

export interface PaginationData {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

export interface CustomPaginationClassNames {
  root?: string;
  info?: string;
  nav?: string;
  pageButton?: string;
  activePageButton?: string;
  select?: string;
}

export interface LayoutStatus {
  isLayoutLoading?: boolean;
  isLayoutSaving?: boolean;
  isLayoutResetting?: boolean;
}

export interface ResetColumnsButtonProps {
  onReset: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface TableLayoutToolbarControlsProps {
  layoutStatus?: LayoutStatus;
  onResetLayout?: () => void;
  renderResetControl?: (onReset: () => void) => ReactNode;
  isLoading?: boolean;
}

export interface CustomPaginationProps {
  paginationData: PaginationData | null;
  /** @deprecated Use pageSizeOptions instead */
  paginationPageSize?: number[];
  pageSizeOptions?: number[];
  isLoading?: boolean;
  paramNames?: { page?: string; perPage?: string };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (perPage: number) => void;
  onResetLayout?: () => void;
  renderResetControl?: (onReset: () => void) => ReactNode;
  layoutStatus?: LayoutStatus;
  /** When true, adds an "All" option (perPage=-1) to the page-size select */
  showAllPagesOption?: boolean;
  classNames?: CustomPaginationClassNames;
  className?: string;
}
