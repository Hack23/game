// ***********************************************************
// This support/e2e.ts file is processed and loaded automatically
// before your test files.
//
// This is a great place to put global configuration and behavior
// that modifies Cypress.
// ***********************************************************

// Import commands using ES module syntax
import "./commands";

// You can read more here:
// https://on.cypress.io/configuration

// Add browser launch configuration
Cypress.on("before:browser:launch", (browser, launchOptions) => {
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
