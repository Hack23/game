/// <reference types="cypress" />

// This file is a great place to define custom commands and overwrite existing ones.

// Define custom command types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Custom command implementation
Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

// For more comprehensive examples of custom commands:
// https://on.cypress.io/custom-commands

export {};
