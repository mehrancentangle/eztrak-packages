import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "framer-motion",
    "react",
    "react-dom",
    "react-icons",
    "react-icons/bs",
    "react-icons/bi",
    "react-icons/fi",
    "react-icons/hi2",
  ],
});
