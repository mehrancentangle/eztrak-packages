import {

  forwardRef,

  useEffect,

  useImperativeHandle,

  useRef,

  useState,

  type ChangeEvent,

  type KeyboardEvent,

} from "react";

import toast from "react-hot-toast";

import { FaCheck, FaTimes } from "react-icons/fa";

import { cn } from "../../utils/cn";
import { toDateInputValue } from "../../utils/helpers";

import type { CellEditPayload, CustomCellEditorProps, CustomCellEditorRef } from "./types";



function ButtonSpinner() {

  return (

    <svg

      className="animate-spin"

      width={8}

      height={8}

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

      className,

    },

    ref

  ) => {

    const normalizedInitial = normalizeInitialValue(initialValue, inputType);

    const [value, setValue] = useState<string | number>(normalizedInitial);

    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const selectRef = useRef<HTMLSelectElement>(null);



    useImperativeHandle(ref, () => ({

      getValue: () => value,

      isCancelBeforeStart: () => false,

      isCancelAfterEnd: () => false,

    }));



    useEffect(() => {

      if (inputType === "dropdown") {

        const el = selectRef.current;

        if (el) {

          el.focus();

        }

        return;

      }



      const el = inputRef.current;

      if (!el) {

        return;

      }

      el.focus();

      if (inputType !== "date") {

        el.select();

      }

    }, [inputType]);



    const handleSave = async () => {

      if (isLoading) {

        return;

      }



      if (String(value) === String(normalizedInitial)) {

        stopEditing();

        return;

      }



      if (!entityId) {

        toast.error("Entity ID is required");

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



    return (

      <div
        className={cn(
          "flex items-center w-full h-full min-h-0 overflow-hidden gap-0.5 min-w-[80px]",
          className
        )}
      >

        {inputType === "dropdown" ? (

          <select

            ref={selectRef}

            value={String(value)}

            onChange={handleDropdownChange}

            onKeyDown={handleKeyDown}

            className="flex-1 h-full p-0 text-[10px] border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0 truncate"

            disabled={isLoading}

          >

            <option value="" disabled>

              Select option...

            </option>

            {dropdownOptions.map((opt) => (

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

            className="flex-1 h-full p-0 text-[10px] border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 min-w-0 truncate"

            placeholder="..."

            disabled={isLoading}

          />

        )}



        <div className="flex items-center shrink-0 gap-0.5">

          <button

            type="button"

            onClick={handleSave}

            disabled={isSaveDisabled}

            className="flex items-center justify-center w-4 h-4 text-white bg-green-500 rounded-sm hover:bg-green-600 disabled:opacity-50"

            title="Save (Enter)"

          >

            {isLoading ? (

              <ButtonSpinner />

            ) : (

              <FaCheck size={7} aria-hidden />

            )}

          </button>

          <button

            type="button"

            onClick={handleCancel}

            disabled={isLoading}

            className="flex items-center justify-center w-4 h-4 text-white bg-red-500 rounded-sm hover:bg-red-600 disabled:opacity-50"

            title="Cancel (Escape)"

          >

            <FaTimes size={7} aria-hidden />

          </button>

        </div>

      </div>

    );

  }

);



CustomCellEditor.displayName = "CustomCellEditor";



export default CustomCellEditor;


