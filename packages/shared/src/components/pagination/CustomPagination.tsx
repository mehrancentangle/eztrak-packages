import { type ChangeEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import { confirmationAlert } from "../../utils/handleApiError";
import type {
  CustomPaginationProps,
  ResetColumnsButtonProps,
  TableLayoutToolbarControlsProps,
} from "./types";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
const ALL_PAGES_VALUE = -1;

function padCount(num: number) {
  return num.toString().padStart(2, "0");
}

function RefreshIcon({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export function ResetColumnsButton({
  onReset,
  disabled = false,
  isLoading = false,
}: ResetColumnsButtonProps) {
  const handleClick = () => {
    confirmationAlert(onReset, {
      text: "Reset column order, widths, and visibility to defaults?",
      icon: "warning",
      title: "Reset column layout to default",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      title="Reset column layout to default"
      className="inline-flex items-center gap-1.5 rounded-xl border border-primary-150 bg-white px-3 py-1.5 text-sm font-medium text-primary-150 hover:bg-gray-50 focus:outline-none disabled:hover:bg-white"
    >
      <RefreshIcon size={14} className={cn(isLoading ? "animate-spin" : "")} />
      Reset columns
    </button>
  );
}

export function TableLayoutToolbarControls({
  layoutStatus = {},
  onResetLayout,
  renderResetControl,
  isLoading = false,
}: TableLayoutToolbarControlsProps) {
  const { isLayoutLoading, isLayoutSaving, isLayoutResetting } = layoutStatus;
  const isLayoutBusy = isLayoutLoading || isLayoutSaving || isLayoutResetting;

  return (
    <div className="flex items-center gap-3">
      {onResetLayout &&
        (renderResetControl ? (
          renderResetControl(onResetLayout)
        ) : (
          <ResetColumnsButton
            onReset={onResetLayout}
            disabled={isLayoutBusy}
            isLoading={isLoading}
          />
        ))}
    </div>
  );
}

export function CustomPagination({
  paginationData,
  paginationPageSize,
  pageSizeOptions: pageSizeOptionsProp,
  isLoading = false,
  paramNames,
  onPageChange,
  onPageSizeChange,
  onResetLayout,
  renderResetControl,
  layoutStatus,
  showAllPagesOption = false,
  classNames,
  className,
}: CustomPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageKey = paramNames?.page ?? "page";
  const perPageKey = paramNames?.perPage ?? "perPage";
  const pageSizeOptions =
    pageSizeOptionsProp ?? paginationPageSize ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const perPageParam = searchParams.get(perPageKey);
  const perPageNumber =
    perPageParam !== null && perPageParam !== ""
      ? parseInt(perPageParam, 10)
      : NaN;
  const isShowingAll = perPageNumber === ALL_PAGES_VALUE;

  const currentPage = paginationData
    ? Math.max(0, paginationData.currentPage - 1)
    : 0;

  const handlePageChange = (pageNumber: number) => {
    if (
      !paginationData ||
      pageNumber < 0 ||
      pageNumber >= paginationData.pageCount
    ) {
      return;
    }

    const safePage = Math.max(
      1,
      Math.min(pageNumber + 1, paginationData.pageCount)
    );
    const newParams = new URLSearchParams(searchParams);
    newParams.set(pageKey, String(safePage));
    setSearchParams(newParams, { replace: true });
    onPageChange?.(safePage);
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parsed = parseInt(event.target.value, 10);
    if (
      !Number.isFinite(parsed) ||
      (parsed < 1 && parsed !== ALL_PAGES_VALUE)
    ) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set(pageKey, "1");
    newParams.set(perPageKey, String(parsed));
    setSearchParams(newParams, { replace: true });
    onPageSizeChange?.(parsed);
  };

  const createPageButtons = () => {
    const buttons: ReactNode[] = [];
    const maxButtons = 5;
    const totalPages = Math.max(1, paginationData?.pageCount ?? 1);

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
          onClick={() => handlePageChange(0)}
          aria-label="Page 1"
          className={cn(
            "px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors",
            classNames?.pageButton
          )}
        >
          1
        </button>
      );

      if (startPage > 1) {
        buttons.push(
          <span
            key="ellipsis1"
            aria-hidden="true"
            className="px-2 py-2 text-gray-400"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = currentPage === i;
      buttons.push(
        <button
          key={i + 1}
          type="button"
          onClick={() => handlePageChange(i)}
          aria-label={`Page ${i + 1}`}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "px-3 py-2 text-sm rounded-md transition-colors",
            isActive
              ? cn("bg-gray-400 text-white", classNames?.activePageButton)
              : cn(
                  "text-gray-600 hover:text-gray-600 hover:bg-gray-50",
                  classNames?.pageButton
                )
          )}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        buttons.push(
          <span
            key="ellipsis2"
            aria-hidden="true"
            className="px-2 py-2 text-gray-400"
          >
            ...
          </span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => handlePageChange(totalPages - 1)}
          aria-label={`Page ${totalPages}`}
          className={cn(
            "px-3 py-2 text-sm text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors",
            classNames?.pageButton
          )}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (isLoading || !paginationData) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50">
        <span className="text-gray-500">
          {isLoading ? "Loading..." : "No pagination data"}
        </span>
      </div>
    );
  }

  const effectiveSizeOptions =
    paginationData.perPage > 0 &&
    !pageSizeOptions.includes(paginationData.perPage)
      ? [...pageSizeOptions, paginationData.perPage].sort((a, b) => a - b)
      : pageSizeOptions;

  const selectValue = isShowingAll
    ? ALL_PAGES_VALUE
    : paginationData.perPage ||
      (Number.isFinite(perPageNumber) && perPageNumber > 0
        ? perPageNumber
        : 10);

  const startItem =
    paginationData.totalCount === 0
      ? 0
      : (paginationData.currentPage - 1) * paginationData.perPage + 1;
  const endItem = Math.min(
    startItem + paginationData.perPage - 1,
    paginationData.totalCount
  );

  const { isLayoutLoading, isLayoutSaving, isLayoutResetting } =
    layoutStatus ?? {};
  const isLayoutBusy =
    isLayoutLoading || isLayoutSaving || isLayoutResetting;

  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4",
        className,
        classNames?.root
      )}
    >
      <div className={cn("flex-1", classNames?.info)}>
        <span className="text-xs font-medium text-neutral-400">
          {isShowingAll
            ? `Showing All ${paginationData.totalCount ?? 0} Results`
            : `Showing ${padCount(startItem)} - ${padCount(endItem)} of ${paginationData.totalCount ?? 0} results`}
        </span>
      </div>

      <nav
        aria-label="Pagination"
        className={cn("flex items-center space-x-1", classNames?.nav)}
      >
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || isShowingAll}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.7 2.3a1 1 0 0 1 0 1.4L6.4 8l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z" />
          </svg>
        </button>

        <div className="flex items-center space-x-1">
          {isShowingAll ? (
            <span className="px-3 py-2 text-sm text-gray-400" aria-hidden="true">
              All
            </span>
          ) : (
            createPageButtons()
          )}
        </div>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage >= paginationData.pageCount - 1 || isShowingAll
          }
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.3 13.7a1 1 0 0 1 0-1.4L9.6 8 5.3 3.7a1 1 0 0 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4 0z" />
          </svg>
        </button>
      </nav>

      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-3">
          {onResetLayout &&
            (renderResetControl ? (
              renderResetControl(onResetLayout)
            ) : (
              <ResetColumnsButton
                onReset={onResetLayout}
                disabled={isLayoutBusy}
                isLoading={isLoading}
              />
            ))}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pagination-per-page"
              className="text-sm text-gray-600"
            >
              Items per page
            </label>
            <select
              id="pagination-per-page"
              value={selectValue}
              onChange={handlePageSizeChange}
              className={cn(
                "px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                classNames?.select
              )}
            >
              {showAllPagesOption && (
                <option value={ALL_PAGES_VALUE}>All</option>
              )}
              {effectiveSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomPagination;
