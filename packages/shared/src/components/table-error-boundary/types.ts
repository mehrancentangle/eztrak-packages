import type { ReactNode } from "react";
import type { RtkQueryError } from "../../utils/handleApiError";

export type TableErrorBoundaryProps = {
  isError: boolean;
  isLoading?: boolean;
  refetch?: () => void;
  children: ReactNode;
  error?: RtkQueryError | null;
  errorMessage?: string;
  className?: string;
  minHeight?: string | number;
};
