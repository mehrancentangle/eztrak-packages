import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";
import { toDateInputValue } from "../../utils/helpers";
import type { CellEditPayload, CustomCellEditorProps, CustomCellEditorRef, DropdownOption } from "./types";

function ButtonSpinner() {
  return (
    <svg
      className="animate-spin"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="white"
        strokeWidth="4"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function normalizeInitialValue(
  initialValue: CustomCellEditorProps["value"],
  inputType: CustomCellEditorProps["inputType"]
): string | number {
  if (inputType === "date" && initialValue != null && initialValue !== "") {
    return toDateInputValue(String(initialValue));
  }
  if (initialValue == null) {
    return "";
  }
  return initialValue;
}

export const CustomCellEditor = forwardRef<
  CustomCellEditorRef,
  CustomCellEditorProps
>(
  (
    {
      value: initialValue,
      name,
      inputType = "text",
      stopEditing,
      entityId,
      entityName = "Record",
      onSave,
      dropdownOptions = [],
      customOptions,
      valueKey = "value",
      labelKey = "label",
      containerStyle,
      className,
      inputClassName,
      loadingIndicator,
      saveButtonContent,
      cancelButtonContent,
      saveButtonStyle,
      cancelButtonStyle,
      saveButtonClassName,
      cancelButtonClassName,
    },
    ref
  ) => {
    const normalizedInitial = normalizeInitialValue(initialValue, inputType);
    const [value, setValue] = useState<string | number>(normalizedInitial);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Merge customOptions (arbitrary shape) and dropdownOptions ({value,label}) into one array
    const normalizedOptions = useMemo<DropdownOption[]>(() => {
      if (customOptions && customOptions.length > 0) {
        return customOptions.map((opt) => ({
          value: String(opt[valueKey] ?? ""),
          label: String(opt[labelKey] ?? ""),
        }));
      }
      return dropdownOptions;
    }, [customOptions, dropdownOptions, valueKey, labelKey]);

    const isDropdown = inputType === "dropdown" || normalizedOptions.length > 0;

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      isCancelBeforeStart: () => false,
      isCancelAfterEnd: () => false,
      isPopup: () => true,
    }));

    useEffect(() => {
      if (isDropdown) {
        selectRef.current?.focus();
        return;
      }
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      if (inputType !== "date") {
        el.select();
      }
    }, [isDropdown, inputType]);

    const handleSave = async () => {
      if (isLoading) return;

      if (String(value) === String(normalizedInitial)) {
        stopEditing();
        return;
      }

      if (!name) {
        toast.error("Property name is required");
        return;
      }

      setIsLoading(true);

      const payloadValue: string | number =
        inputType === "number" && value !== ""
          ? parseFloat(String(value))
          : value;

      const payload: CellEditPayload = {
        propertyName: name,
        propertyValue: payloadValue,
        entityId,
        entityName,
      };

      try {
        await onSave(payload);
        toast.success("Record updated successfully");
        stopEditing();
      } catch (error) {
        console.error("Update error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update record";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCancel = () => {
      setValue(normalizedInitial);
      stopEditing();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
      }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;
      if (inputType === "number") {
        newValue = newValue.replace(/[^0-9.-]/g, "");
      }
      setValue(newValue);
    };

    const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setValue(event.target.value);
    };

    const isSaveDisabled =
      isLoading || String(value) === String(normalizedInitial);

    const defaultInputClass =
      "w-48 px-2 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-400";

    const defaultSaveBtnClass =
      "px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 whitespace-nowrap shrink-0";

    const defaultCancelBtnClass =
      "px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 whitespace-nowrap shrink-0";

    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 min-w-[320px] bg-white border border-gray-200 rounded-md shadow-md",
          className
        )}
        style={containerStyle}
      >
        {isDropdown ? (
          <select
            ref={selectRef}
            value={String(value)}
            onChange={handleDropdownChange}
            onKeyDown={handleKeyDown}
            className={inputClassName ?? defaultInputClass}
            disabled={isLoading}
          >
            <option value="" disabled>
              Select option...
            </option>
            {normalizedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef}
            type={inputType}
            value={String(value)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={inputClassName ?? defaultInputClass}
            placeholder="..."
            disabled={isLoading}
          />
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={saveButtonClassName ?? (saveButtonStyle ? undefined : defaultSaveBtnClass)}
          style={saveButtonStyle}
          title="Save (Enter)"
        >
          {isLoading
            ? (loadingIndicator ?? <ButtonSpinner />)
            : (saveButtonContent ?? "Save")}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className={cancelButtonClassName ?? (cancelButtonStyle ? undefined : defaultCancelBtnClass)}
          style={cancelButtonStyle}
          title="Cancel (Escape)"
        >
          {cancelButtonContent ?? "Cancel"}
        </button>
      </div>
    );
  }
);

CustomCellEditor.displayName = "CustomCellEditor";

export default CustomCellEditor;
