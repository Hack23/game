// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import "./commands";

// Use React 19 compatible mount function
import { mount } from "cypress/react";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);

// Add browser launch configuration for component tests
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

// Example use:
// cy.mount(<MyComponent />)
