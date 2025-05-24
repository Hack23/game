import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "cypress/",
        "dist/",
        ".eslintrc.cjs",
        "vite.config.ts",
        "vitest.config.ts",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      // Fix react-reconciler module resolution
      "react-reconciler/constants": "react-reconciler/constants.js",
    },
  },
  optimizeDeps: {
    include: ["@pixi/react", "pixi.js", "react-reconciler"],
  },
  ssr: {
    noExternal: ["@pixi/react", "pixi.js"],
  },
});
