import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    const plugins = (config.plugins ?? []).flat(Number.POSITIVE_INFINITY);
    config.plugins = plugins.filter((plugin) => {
      if (!plugin || typeof plugin !== "object" || !("name" in plugin)) {
        return true;
      }
      // @vitejs/plugin-react 6 ships a Vite 8 refresh wrapper. Storybook 8
      // still runs Vite 6, and that wrapper crashes iframe.html.
      return plugin.name !== "vite:react:refresh-wrapper";
    });
    return config;
  },
};

export default config;
