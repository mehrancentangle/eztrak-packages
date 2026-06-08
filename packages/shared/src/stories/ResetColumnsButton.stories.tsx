import type { Meta, StoryObj } from "@storybook/react";
import { ResetColumnsButton } from "../components/pagination/CustomPagination";

const meta: Meta<typeof ResetColumnsButton> = {
  title: "Components/ResetColumnsButton",
  component: ResetColumnsButton,
};

export default meta;

type Story = StoryObj<typeof ResetColumnsButton>;

export const Default: Story = {
  args: {
    onReset: () => {
      // eslint-disable-next-line no-alert
      alert("Columns reset");
    },
  },
};

export const Disabled: Story = {
  args: {
    onReset: () => undefined,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    onReset: () => undefined,
    isLoading: true,
  },
};
