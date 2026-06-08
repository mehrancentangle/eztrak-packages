import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { CustomPagination } from "../components/pagination/CustomPagination";

const meta: Meta<typeof CustomPagination> = {
  title: "Components/CustomPagination",
  component: CustomPagination,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof CustomPagination>;

export const Default: Story = {
  args: {
    paginationData: {
      currentPage: 1,
      pageCount: 10,
      perPage: 20,
      totalCount: 193,
    },
    className: "bg-white w-full max-w-5xl",
  },
};

export const EmptyResults: Story = {
  args: {
    paginationData: {
      currentPage: 1,
      pageCount: 0,
      perPage: 20,
      totalCount: 0,
    },
    className: "bg-white w-full max-w-5xl",
  },
};

export const Loading: Story = {
  args: {
    paginationData: null,
    isLoading: true,
  },
};

export const WithAllPagesOption: Story = {
  args: {
    paginationData: {
      currentPage: 1,
      pageCount: 1,
      perPage: -1,
      totalCount: 42,
    },
    showAllPagesOption: true,
    className: "bg-white w-full max-w-5xl",
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/?perPage=-1&page=1"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const WithResetLayout: Story = {
  args: {
    paginationData: {
      currentPage: 3,
      pageCount: 10,
      perPage: 20,
      totalCount: 193,
    },
    onResetLayout: () => {
      // eslint-disable-next-line no-alert
      alert("Reset layout");
    },
    className: "bg-white w-full max-w-5xl",
  },
};
