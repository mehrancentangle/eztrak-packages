export type CellEditorInputType = "text" | "number" | "date" | "dropdown";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CellEditPayload {
  propertyName: string;
  propertyValue: string | number | null;
  entityId: string | number;
  entityName: string;
}

export interface CustomCellEditorRef {
  getValue: () => string | number | null | undefined;
  isCancelBeforeStart: () => boolean;
  isCancelAfterEnd: () => boolean;
}

export interface CustomCellEditorProps {
  value: string | number | null | undefined;
  name: string;
  inputType?: CellEditorInputType;
  stopEditing: () => void;
  entityId: string | number;
  entityName?: string;
  onSave: (payload: CellEditPayload) => Promise<void>;
  dropdownOptions?: DropdownOption[];
}
