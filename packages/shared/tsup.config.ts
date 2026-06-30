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
  ],
});
