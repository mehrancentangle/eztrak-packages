/**
 * Sends pagination back to the first page after a filter changes the result set.
 *
 * Only touches `pageKey` when it is already present, so filter-only screens that
 * never paginate keep their URL clean. Mutates and returns `params` so it can be
 * chained inside a `setSearchParams((prev) => ...)` updater.
 */
export function resetPageParam(
  params: URLSearchParams,
  pageKey = "page",
  defaultPage = "1",
) {
  if (params.has(pageKey)) {
    params.set(pageKey, defaultPage);
  }
  return params;
}
