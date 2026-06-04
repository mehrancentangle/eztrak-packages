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
  external: ["react", "react-dom", "react-router-dom", "react-hot-toast", "sweetalert2"],
});
