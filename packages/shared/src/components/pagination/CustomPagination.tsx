import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import type { CustomPaginationProps } from "./types";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

export function CustomPagination({
  paginationData,
  paginationPageSize,
}: CustomPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSizeOptions = paginationPageSize ?? DEFAULT_PAGE_SIZE_OPTIONS;

  useEffect(() => {
    if (paginationData) {
      setCurrentPage(paginationData.currentPage - 1);
    }
  }, [paginationData]);

  const onPageChange = (pageNumber: number) => {
    if (
      paginationData &&
      pageNumber >= 0 &&
      pageNumber < paginationData.pageCount
    ) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(pageNumber + 1));
      setSearchParams(newParams, { replace: true });
    }
  };

  const onPageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    newParams.set("perPage", event.target.value);
    setSearchParams(newParams, { replace: true });
  };

  const createPageButtons = () => {
    const buttons: ReactNode[] = [];
    const maxButtons = 5;
    const totalPages = paginationData?.pageCount ?? 1;

    let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(0, endPage - maxButtons + 1);
    }

    if (startPage > 0) {
      buttons.push(
        <button
          key="1"
          type="button"
          onClick={() => onPageChange(0)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          1
        </button>
      );

      if (startPage > 1) {
        buttons.push(
          <span key="ellipsis1" className="px-2 py-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i + 1}
          type="button"
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentPage === i
              ? "bg-gray-400 text-white"
              : "text-gray-600 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 py-2 text-gray-400">
            ...
          </span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const formatNumber = (num: number) => {
    return num ? num.toString().padStart(2, "0") : "00";
  };

  if (!paginationData) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50">
        <span className="text-gray-500">Loading pagination...</span>
      </div>
    );
  }

  const startItem =
    (paginationData.currentPage - 1) * paginationData.perPage + 1;
  const endItem = Math.min(
    startItem + paginationData.perPage - 1,
    paginationData.totalCount
  );

  return (
    <div className="flex items-center justify-between pb-4 bg-white">
      <div className="flex-1">
        <span className="text-sm text-gray-600">
          Showing {formatNumber(startItem)} - {formatNumber(endItem)} of{" "}
          {paginationData.totalCount ?? 0} results
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.7 2.3a1 1 0 0 1 0 1.4L6.4 8l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z" />
          </svg>
        </button>

        <div className="flex items-center space-x-1">{createPageButtons()}</div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= paginationData.pageCount - 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.3 13.7a1 1 0 0 1 0-1.4L9.6 8 5.3 3.7a1 1 0 0 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Item per page</span>
          <select
            value={paginationData.perPage || 10}
            onChange={onPageSizeChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
