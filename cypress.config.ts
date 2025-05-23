import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },
  video: true,
  screenshotOnRunFailure: true,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "cypress.config.reporter.json",
  },
});
