import React, { useMemo } from "react";
import { FaArrowsRotate, FaTriangleExclamation } from "react-icons/fa6";
import { cn } from "../../utils/cn";
import { classifyError } from "../../utils/handleApiError";
import { Loader } from "../Loader";
import type { TableErrorBoundaryProps } from "./types";

export const TableErrorBoundary: React.FC<TableErrorBoundaryProps> = ({
  isError,
  isLoading = false,
  refetch,
  children,
  error,
  errorMessage,
  className,
  minHeight = "280px",
}) => {
  const message = useMemo(() => {
    if (errorMessage) return errorMessage;
    if (error) return classifyError(error).userMessage;
    return "Unable to load table data. Please try again.";
  }, [error, errorMessage]);

  if (isLoading && !isError) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-xl bg-neutral-50",
          className
        )}
        style={{ minHeight }}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader size="40px" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center",
          className
        )}
        style={{ minHeight }}
        role="alert"
        aria-live="assertive"
      >
        <FaTriangleExclamation
          className="text-red-500"
          size={32}
          aria-hidden
        />
        <div className="max-w-md space-y-1">
          <p className="text-base font-semibold text-gray-800">
            Failed to load data
          </p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        {refetch && (
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-150 px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaArrowsRotate className={cn(isLoading && "animate-spin")} />
            {isLoading ? "Retrying..." : "Try again"}
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
