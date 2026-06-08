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

export interface CustomPaginationProps {
  paginationData: PaginationData | null;
  /** @deprecated Use pageSizeOptions instead */
  paginationPageSize?: number[];
  pageSizeOptions?: number[];
  isLoading?: boolean;
  paramNames?: { page?: string; perPage?: string };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (perPage: number) => void;
  classNames?: CustomPaginationClassNames;
  className?: string;
}
