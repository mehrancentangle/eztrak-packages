import { useEffect, useRef } from "react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { dropdownStyles } from "./dropdownStyles";
import { cn } from "../../utils/cn";
import { resetPageParam } from "../../utils/resetPageParam";
import {
  getItemFromLocalStorage,
  removeItem,
  storeItemInLocalStorage,
} from "../../utils/localStorage";
import type { DropdownFilterProps } from "./types";

export function DropdownFilter<Option extends Record<string, unknown>>({
  name,
  valueKey = "id",
  options,
  placeholder,
  borderRadius = "12px",
  className,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  saveToLocalStorage = false,
  pageParam = "page",
  ...otherProps
}: DropdownFilterProps<Option>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasRestoredFromStorage = useRef(false);

  useEffect(() => {
    if (!saveToLocalStorage || hasRestoredFromStorage.current) return;
    hasRestoredFromStorage.current = true;

    if (searchParams.get(name)) return;

    const stored = getItemFromLocalStorage<string>(name);
    if (stored != null && stored !== "") {
      setSearchParams((prev) => {
        prev.set(name, String(stored));
        // Restoring a stored filter narrows the result set too, so a deep-linked
        // page number would land out of range.
        return resetPageParam(prev, pageParam);
      });
    }
  }, [saveToLocalStorage, name, pageParam, searchParams, setSearchParams]);

  const currentValue = searchParams.get(name);
  const selectedOption = currentValue
    ? options?.find(
        (option) => option[valueKey]?.toString() === currentValue,
      ) ?? null
    : null;

  const handleChange = (selected: Option | null) => {
    const selectedValue =
      selected && selected[valueKey] !== "" ? String(selected[valueKey]) : null;

    setSearchParams((prev) => {
      // Re-selecting the current option leaves the result set alone, so keep the
      // page the user is on.
      if ((prev.get(name) ?? "") === (selectedValue ?? "")) {
        return prev;
      }

      if (!selectedValue) {
        prev.delete(name);
      } else {
        prev.set(name, selectedValue);
      }

      return resetPageParam(prev, pageParam);
    });

    if (saveToLocalStorage) {
      if (selectedValue) {
        storeItemInLocalStorage(name, selectedValue);
      } else {
        removeItem(name);
      }
    }
  };

  return (
    <div className={cn(className)}>
    <Select<Option, false>
      placeholder={placeholder ?? `Select ${name}`}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      getOptionValue={(option) => String(option[valueKey] ?? "")}
      getOptionLabel={(option) =>
        String(option.label ?? option.name ?? option[valueKey] ?? "")
      }
      styles={dropdownStyles<Option>(borderRadius)}
      {...otherProps}
    />
    </div>
  );
}
