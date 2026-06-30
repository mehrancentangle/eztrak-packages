import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { dropdownStyles } from "./dropdownStyles";
import { cn } from "../../utils/cn";
import type { DropdownFilterProps } from "./types";

export function DropdownFilter<Option extends Record<string, unknown>>({
  name,
  valueKey = "id",
  options,
  placeholder,
  borderRadius = "20px",
  className,
  isClearable = true,
  isSearchable = true,  
  isDisabled = false,
  isLoading = false,
  ...otherProps
}: DropdownFilterProps<Option>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = searchParams.get(name);
  const selectedOption = currentValue
    ? options?.find(
        (option) => option[valueKey]?.toString() === currentValue,
      ) ?? null
    : null;

  const handleChange = (selected: Option | null) => {
    setSearchParams((prev) => {
      if (!selected || selected[valueKey] === "") {
        prev.delete(name);
      } else {
        prev.set(name, String(selected[valueKey]));
      }
      return prev;
    });
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
