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
    "framer-motion",
    "react",
    "react-dom",
    "react-hot-toast",
    "react-icons",
    "react-icons/fa",
    "react-icons/io5",
    "react-router-dom",
    "sweetalert2",
  ],
});
