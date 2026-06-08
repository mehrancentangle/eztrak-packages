import type { Preview } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import "../src/components/tabs/styles.css";
import "../src/storybook-globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default preview;
