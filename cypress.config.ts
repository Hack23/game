import { defineConfig } from "cypress";

// Centralize report directories with proper typing
const REPORTS_BASE_DIR = "cypress";
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
    video: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    downloadsFolder: "cypress/downloads",
    fixturesFolder: "cypress/fixtures",
    responseTimeout: 10000,
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
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          // Add flags to suppress WebGL warnings and enable software rendering
          launchOptions.args.push("--enable-unsafe-swiftshader");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--disable-features=VizDisplayCompositor");
          launchOptions.args.push("--disable-gpu");
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-dev-shm-usage");
          // Suppress specific WebGL warnings
          launchOptions.args.push("--disable-logging");
          launchOptions.args.push("--silent");
          launchOptions.args.push("--log-level=3");
        }
        return launchOptions;
      });
    },
    indexHtmlFile: "cypress/support/component-index.html",
  },
});
