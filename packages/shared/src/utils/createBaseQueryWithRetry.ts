import { retry } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { isRetryableError, type RtkQueryError } from "./handleApiError";

export type CreateBaseQueryWithRetryOptions = {
  maxRetries?: number;
  maxBackoffMs?: number;
};

function getRequestMethod(args: unknown): string {
  if (typeof args === "string") return "GET";
  if (args && typeof args === "object" && "method" in args) {
    const method = (args as { method?: string }).method;
    return (method || "GET").toUpperCase();
  }
  return "GET";
}

/**
 * Wraps an authenticated baseQuery with RTK Query retry for GET requests only.
 * Retries transient network/server errors with exponential backoff.
 */
export function createBaseQueryWithRetry(
  baseQueryWithReauth: BaseQueryFn,
  {
    maxRetries = 3,
    maxBackoffMs = 8000,
  }: CreateBaseQueryWithRetryOptions = {}
): BaseQueryFn {
  const retryableQuery = retry(
    async (args, api, extraOptions) => {
      const result = await baseQueryWithReauth(args, api, extraOptions);

      if (result.error && !isRetryableError(result.error as RtkQueryError)) {
        retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries,
      backoff: (attempt: number) =>
        new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * 2 ** attempt, maxBackoffMs))
        ),
    }
  );

  const baseQueryWithConditionalRetry: BaseQueryFn = async (
    args,
    api,
    extraOptions
  ) => {
    const method = getRequestMethod(args);
    if (method !== "GET") {
      return baseQueryWithReauth(args, api, extraOptions);
    }
    return retryableQuery(args, api, extraOptions);
  };

  return baseQueryWithConditionalRetry;
}
