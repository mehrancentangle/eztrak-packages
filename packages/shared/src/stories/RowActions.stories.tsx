import type { Meta, StoryObj } from "@storybook/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { RowActions } from "../components/row-actions/RowActions";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

type SampleRow = { id: string; name: string; hasNotes: boolean };

const sampleRow: SampleRow = { id: "1", name: "Drum Inspect", hasNotes: true };

const meta: Meta<typeof RowActions<SampleRow>> = {
  title: "Components/RowActions",
  component: RowActions,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof RowActions<SampleRow>>;

export const DefaultMenu: Story = {
  args: {
    data: sampleRow,
    actions: [
      { preset: "edit", onClick: () => undefined },
      { preset: "delete", onClick: () => undefined },
      { preset: "notes", highlight: (row) => Boolean(row?.hasNotes), onClick: () => undefined },
      { preset: "history", onClick: () => undefined },
    ],
  },
};

export const CustomTriggerAndClassName: Story = {
  args: {
    data: sampleRow,
    actionIcon: HiDotsHorizontal,
    className: "text-primary-150",
    menuClassName: "min-w-[200px]",
    actions: [
      { preset: "edit", onClick: () => undefined },
      { preset: "delete", onClick: () => undefined },
    ],
  },
};

export const InlineIcons: Story = {
  args: {
    data: sampleRow,
    mode: "inline",
    actions: [
      { preset: "edit", onClick: () => undefined },
      { preset: "delete", onClick: () => undefined },
      { preset: "history", onClick: () => undefined },
    ],
  },
};

export const CustomHover: Story = {
  args: {
    data: sampleRow,
    itemClassName: "hover:bg-gray-100 hover:text-gray-800",
    actions: [
      { preset: "edit", onClick: () => undefined },
      { preset: "delete", onClick: () => undefined },
    ],
  },
};

export const CustomTooltip: Story = {
  args: {
    data: sampleRow,
    triggerTooltip: "More options",
    tooltipPlacement: "right",
    iconSize: 18,
    actions: [
      { preset: "edit", tooltip: "Edit this record", onClick: () => undefined },
      { preset: "delete", tooltip: false, onClick: () => undefined },
      { type: "divider" },
      { preset: "notes", tooltip: "View pickup notes", onClick: () => undefined },
    ],
  },
};
