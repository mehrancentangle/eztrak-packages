export interface PaginationData {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

export interface CustomPaginationProps {
  paginationData: PaginationData | null;
  paginationPageSize?: number[];
}
