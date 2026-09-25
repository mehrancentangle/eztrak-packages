import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "utils/index": "src/utils/index.ts",
    "hooks/index": "src/hooks/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // tsup otherwise deletes `import './Loader.css'` from the published JS.
  // Re-emit it as the package CSS export so consumers still load the sheet.
  injectStyle(css, fileId) {
    const normalized = fileId.replace(/\\/g, "/");
    if (normalized.endsWith("/Loader/Loader.css")) {
      return 'import "@eztrak/shared/components/loader.css";';
    }
    return `import styleInject from '#style-inject';styleInject(${css})`;
  },
  external: [
    "@tippyjs/react",
    "framer-motion",
    "react",
    "react-dom",
    "react-hot-toast",
    "react-icons",
    "react-icons/bi",
    "react-icons/fa",
    "react-icons/fi",
    "react-icons/io5",
    "react-router-dom",
    "react-tooltip",
    "sweetalert2",
    "tippy.js",
    "@eztrak/shared/components/loader.css",
  ],
});
