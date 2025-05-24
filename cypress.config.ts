import { defineConfig } from "cypress";

// Centralize report directories with proper typing
const REPORTS_BASE_DIR = "docs/cypress";
const REPORTS = {
  junit: `${REPORTS_BASE_DIR}/junit`,
  mochawesome: `${REPORTS_BASE_DIR}/mochawesome`,
  videos: `${REPORTS_BASE_DIR}/videos`,
  screenshots: `${REPORTS_BASE_DIR}/screenshots`,
  artifacts: `${REPORTS_BASE_DIR}/artifacts`,
} as const;

export default defineConfig({
  screenshotsFolder: REPORTS.screenshots,
  videosFolder: REPORTS.videos,
  experimentalMemoryManagement: true,
  video: true,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  viewportWidth: 1280,
  viewportHeight: 800,
  waitForAnimations: false,
  pageLoadTimeout: 10000,
  requestTimeout: 5000,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  // Simplified reporter configuration to avoid CommonJS conflicts
  reporter: "spec",
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    testIsolation: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    defaultCommandTimeout: 8000,
    chromeWebSecurity: false,
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Cypress.PluginConfigOptions {
      // Add any plugins here if needed
      return config;
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },
});
