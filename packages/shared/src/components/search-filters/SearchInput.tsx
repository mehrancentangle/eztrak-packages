import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import { resetPageParam } from "../../utils/resetPageParam";
import type { SearchInputProps } from "./types";

export function SearchInput({
  placeholder = "Search...",
  searchBtn = "",
  searchClassName = "",
  searchWrapperClass = "",
  searchIconClassName = "",
  defaultParam = "query",
  showIcon = true,
  name = "search",
  type = "search",
  liveSearch = false,
  debounceDelay = 500,
  customIcon = null,
  defaultValue,
  pageParam = "page",
  ...props
}: SearchInputProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get(defaultParam) || defaultValue || "";

  const [inputValue, setInputValue] = useState(queryParam);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateSearchParams = (searchQuery: string) => {
    const nextValue = searchQuery?.trim() ?? "";

    setSearchParams((prev) => {
      // Same query as the URL already holds: the result set is unchanged, so
      // leave the current page alone.
      if ((prev.get(defaultParam) ?? "") === nextValue) {
        return prev;
      }

      if (nextValue) {
        prev.set(defaultParam, nextValue);
      } else {
        prev.delete(defaultParam);
      }

      return resetPageParam(prev, pageParam);
    });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get(name);
    updateSearchParams(String(searchQuery ?? ""));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (liveSearch) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updateSearchParams(value);
      }, debounceDelay);
    }

    if (value === "") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setInputValue("");
      updateSearchParams("");
    }
  };

  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "flex items-center justify-between bg-white rounded-xl px-2 h-11 border",
        searchWrapperClass,
      )}
    >
      {showIcon && (
        <button
          type="submit"
          className={cn(
            "bg-white text-secondary rounded-full flex items-center justify-center w-10 h-10",
            searchBtn,
          )}
        >
          {customIcon ? (
            customIcon
          ) : (
            <FiSearch
              className={cn("h-5 w-5 text-gray-400", searchIconClassName)}
            />
          )}
        </button>
      )}
      <input
        value={inputValue}
        onChange={handleInputChange}
        name={name}
        type={type}
        className={cn("outline-none text-sm w-96", searchClassName)}
        placeholder={placeholder}
        {...props}
      />
    </form>
  );
}
