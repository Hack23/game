# Copilot Instructions

## Coding Guidelines

- **Strict Typing:**
  - _Use explicit types and interfaces; avoid `any` (use `unknown` if needed)_.
  - _Leverage utility types (Pick, Omit, Partial) and always define return types_.
  - _Enable TypeScript's strict options in `tsconfig.json` (e.g., `strictNullChecks`, `noImplicitAny`)_.

## Testing Guidelines

- **Vite & Vitest Integration:**
  - Configure Vite and Vitest for fast feedback and native ESM support.
  - Separate unit and integration tests, leveraging Vite's watch mode and coverage tools.
  - Mock external dependencies using existing helpers with proper TypeScript typings.
- **Quality Standards:**
  - Aim for a minimum of 80% code coverage.
  - Write tests for critical business logic and security paths.

## Summary

Focus on stability, strict TypeScript usage, and Vite-enhanced testing while reusing existing code.
This dev container includes an up-to-date version of Git, built from source as needed, pre-installed and available on the `PATH`.
This dev container includes `node`, `npm` and `eslint` pre-installed and available on the `PATH` for Node.js and JavaScript development.
This dev container includes the GitHub CLI (`gh`), which is pre-installed and available on the `PATH`. IMPORTANT: `gh api -f` does not support object values, use multiple `-f` flags with hierarchical keys and string values instead. When using GitHub actions `actions/upload-artifact` or `actions/download-artifact` use v4 or later.
