import type { CSSProperties, ReactNode } from "react";

export type CellEditorInputType = "text" | "number" | "date" | "dropdown";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CellEditPayload {
  propertyName: string;
  propertyValue: string | number | null;
  entityId?: string | number;
  entityName?: string;
}

export interface CustomCellEditorRef {
  getValue: () => string | number | null | undefined;
  isCancelBeforeStart: () => boolean;
  isCancelAfterEnd: () => boolean;
  /** Tells AG Grid to render this editor as a floating popup, free of column width */
  isPopup: () => boolean;
}

export interface CustomCellEditorProps {
  value: string | number | null | undefined;
  name: string;
  inputType?: CellEditorInputType;
  stopEditing: (cancel?: boolean) => void;
  entityId?: string | number;
  entityName?: string;
  onSave: (payload: CellEditPayload) => Promise<void>;

  /** Standard {value, label} dropdown options */
  dropdownOptions?: DropdownOption[];
  /** Raw options array with custom key shapes (use with valueKey/labelKey) */
  customOptions?: Record<string, unknown>[];
  /** Key to read as option value from customOptions items (default: "value") */
  valueKey?: string;
  /** Key to read as option label from customOptions items (default: "label") */
  labelKey?: string;

  /** Extra inline styles applied to the wrapper div (merged with default layout) */
  containerStyle?: CSSProperties;
  /** Tailwind/CSS class(es) for the wrapper div */
  className?: string;
  /** Tailwind/CSS class(es) applied directly to the <input> or <select> */
  inputClassName?: string;

  /** Replaces the built-in ButtonSpinner when isLoading is true */
  loadingIndicator?: ReactNode;
  /** Replaces the default FaCheck icon in the save button */
  saveButtonContent?: ReactNode;
  /** Replaces the default FaTimes icon in the cancel button */
  cancelButtonContent?: ReactNode;
  /** Inline styles for the save button */
  saveButtonStyle?: CSSProperties;
  /** Inline styles for the cancel button */
  cancelButtonStyle?: CSSProperties;
  /** Extra class(es) for the save button */
  saveButtonClassName?: string;
  /** Extra class(es) for the cancel button */
  cancelButtonClassName?: string;
}
