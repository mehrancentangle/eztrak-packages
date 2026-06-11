import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { CustomCellEditor } from "../components/cell-editor/CustomCellEditor";
import type { CellEditPayload } from "../components/cell-editor/types";

const mockSave = (delayMs = 1000) => async (payload: CellEditPayload) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  console.log("Saved:", payload);
};

function CellEditorDemo({
  inputType = "text",
  value,
  onSaveDelay = 1000,
  dropdownOptions,
}: {
  inputType?: "text" | "number" | "date" | "dropdown";
  value: string | number;
  onSaveDelay?: number;
  dropdownOptions?: { value: string; label: string }[];
}) {
  const [editing, setEditing] = useState(true);

  if (!editing) {
    return (
      <button
        type="button"
        className="text-sm text-blue-600 underline"
        onClick={() => setEditing(true)}
      >
        Re-open editor
      </button>
    );
  }

  return (
    <div className="w-48 h-8 border border-gray-200 rounded bg-white">
      <CustomCellEditor
        value={value}
        name="propertyName"
        inputType={inputType}
        entityId="entity-1"
        entityName="Package"
        stopEditing={() => setEditing(false)}
        onSave={mockSave(onSaveDelay)}
        dropdownOptions={dropdownOptions}
      />
    </div>
  );
}

const meta: Meta<typeof CustomCellEditor> = {
  title: "Components/CustomCellEditor",
  component: CustomCellEditor,
  decorators: [
    (Story) => (
      <>
        <Toaster position="top-right" />
        <Story />
      </>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "AG Grid cell editor with save/cancel buttons. For narrow columns, set `cellEditorPopup: true` in the column definition so the editor is not clipped.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomCellEditor>;

export const TextInput: Story = {
  render: () => <CellEditorDemo value="Sample text" inputType="text" />,
};

export const NumberInput: Story = {
  render: () => <CellEditorDemo value={42} inputType="number" />,
};

export const DateInput: Story = {
  render: () => <CellEditorDemo value="2024-06-15" inputType="date" />,
};

export const DropdownInput: Story = {
  render: () => (
    <CellEditorDemo
      value="active"
      inputType="dropdown"
      dropdownOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ]}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <CellEditorDemo value="Change value then save" onSaveDelay={3000} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Edit the value and click save (or press Enter) to see the loading spinner for 3 seconds.",
      },
    },
  },
};
