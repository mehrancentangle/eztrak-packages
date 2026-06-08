import type { Meta, StoryObj } from "@storybook/react";
import { EztrakTabs } from "../components/tabs/EztrakTabs";

const sampleTabs = [
  { id: "overview", label: "Overview", content: <p>Overview content</p> },
  { id: "details", label: "Details", content: <p>Details content</p> },
  { id: "history", label: "History", content: <p>History content</p> },
];

const meta: Meta<typeof EztrakTabs> = {
  title: "Components/EztrakTabs",
  component: EztrakTabs,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof EztrakTabs>;

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    defaultTabId: "overview",
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      ...sampleTabs.slice(0, 2),
      { id: "archived", label: "Archived", content: <p>Archived</p>, disabled: true },
    ],
    defaultTabId: "overview",
  },
};

export const NavOnly: Story = {
  args: {
    tabs: sampleTabs,
    showPanels: false,
    defaultTabId: "details",
  },
};
