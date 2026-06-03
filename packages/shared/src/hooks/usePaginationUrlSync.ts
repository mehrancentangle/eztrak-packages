import { useEffect } from "react";
import type { SetURLSearchParams } from "react-router-dom";

export const usePaginationUrlSync = (
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams,
  page: number,
  setPage: (page: number) => void,
  perPage: number,
  setPerPage: (perPage: number) => void,
  defaultPage = 1,
  defaultPerPage = 20
) => {
  useEffect(() => {
    const currentUrlPage = parseInt(searchParams.get("page") ?? "") || defaultPage;
    const currentUrlPerPage =
      parseInt(searchParams.get("perPage") ?? "") || defaultPerPage;
    const hasPageParam = searchParams.has("page");
    const hasPerPageParam = searchParams.has("perPage");

    if (!hasPageParam || !hasPerPageParam) {
      const newParams = new URLSearchParams(searchParams);

      if (!hasPageParam) {
        newParams.set("page", defaultPage.toString());
      }

      if (!hasPerPageParam) {
        newParams.set("perPage", defaultPerPage.toString());
      }

      setSearchParams(newParams, { replace: true });
      return;
    }

    if (currentUrlPage !== page) {
      setPage(currentUrlPage);
    }

    if (currentUrlPerPage !== perPage) {
      setPerPage(currentUrlPerPage);
    }
  }, [
    searchParams,
    setSearchParams,
    page,
    setPage,
    perPage,
    setPerPage,
    defaultPage,
    defaultPerPage,
  ]);
};
