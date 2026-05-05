# CI/CD Workflows Documentation

## Overview

This document describes all GitHub Actions workflows in the **game** project. All workflows follow the security-first principles defined in the [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC) and use hardened runners via `step-security/harden-runner`.

**Current Node.js version: 26**
**Current TypeScript version: 6.0.3**

---

## Workflow Inventory

| Workflow File | Trigger | Purpose | Node.js |
|---------------|---------|---------|----------|
| `test-and-report.yml` | push/PR to `main` | Primary CI — build, test, E2E | **26** |
| `test-and-report-latest-node.yml` | push/PR to `main` | Forward-compat CI on latest Node | **27 nightly** |
| `release.yml` | tag push / workflow_dispatch | Build, attest, and release | **26** |
| `codeql.yml` | push/PR/schedule | Static code analysis | **26** |
| `copilot-setup-steps.yml` | push/PR/workflow_dispatch | Copilot environment setup | **26** |
| `copilot-setup.yml` | workflow_dispatch | Copilot environment guide | **26** |
| `dependency-review.yml` | PR to `main` | Dependency vulnerability scan | N/A |
| `scorecards.yml` | push/schedule | OpenSSF Scorecard | N/A |
| `zap-scan.yml` | schedule/workflow_dispatch | OWASP ZAP DAST scan | N/A |
| `lighthouse-performance.yml` | push/PR | Lighthouse performance check | N/A |
| `labeler.yml` | PR | Automatic PR labeling | N/A |
| `setup-labels.yml` | workflow_dispatch | Repository label management | N/A |

---

## Primary CI: `test-and-report.yml`

**Trigger:** Push to `main`, Pull Request to `main`

**Node.js:** 26

**Job Graph:**

```
prepare
  └─→ build-validation
        ├─→ unit-tests
        │     └─→ report
        └─→ e2e-tests
              └─→ report
```

### Jobs

#### `prepare`
Sets up the environment shared by downstream jobs.

| Step | Action |
|------|--------|
| Harden runner | `step-security/harden-runner` (egress-policy: audit) |
| Checkout | `actions/checkout@v6.0.2` |
| Setup Node.js 26 | `actions/setup-node@v6.4.0` with `cache: npm` |
| Cache apt packages | `actions/cache@v5.0.3` ⚠️ |
| Install system deps | xvfb, libgtk, Chrome dependencies |
| Install dependencies | `npm install` |
| Cache Cypress binary | `actions/cache@v5.0.3` (`~/.cache/Cypress`) |
| Verify Cypress | `npx cypress verify` |

> **Note:** The apt package cache (`/var/cache/apt/archives`) may produce `tar: exit code 2` warnings on GitHub-hosted runners when cached files disappear during packaging. This is cosmetic and does not affect correctness, but may add noise to CI logs. `actions/setup-node` with `cache: npm` handles npm caching, so no separate `~/.npm` cache step is needed.

**Permissions:** `contents: read`

#### `build-validation`
Builds the application and validates SBOM quality.

| Step | Action |
|------|--------|
| Install dependencies | `npm ci` |
| Build application | `npm run build` |
| Check licenses | `npm run test:licenses` |
| Generate SBOM | `anchore/sbom-action@v0.23.1` (SPDX-JSON) |
| Validate SBOM quality | `sbomqs score` — minimum 7.0/10 |
| Upload artifacts | `actions/upload-artifact@v7.0.0` |

**Permissions:** `contents: write`, `actions: read`, `id-token: write`, `pull-requests: write`

#### `unit-tests`
Runs Vitest unit tests with coverage reporting.

| Step | Action |
|------|--------|
| Install dependencies | `npm install` |
| Run tests with coverage | `npm run test:ci` (JUnit XML output) |
| Upload coverage report | `actions/upload-artifact@v7.0.0` |

**Permissions:** `contents: write`, `actions: read`, `checks: write`

#### `e2e-tests`
Runs Cypress end-to-end tests with display server support.

| Step | Action |
|------|--------|
| Install dependencies | `npm install` |
| Run E2E tests | `xvfb-run npm run test:e2e` |
| Upload results | Videos, screenshots, results |

**Permissions:** `contents: write`, `actions: read`, `checks: write`, `pull-requests: write`

#### `report`
Aggregates all test artifacts.

| Step | Action |
|------|--------|
| Download all artifacts | `actions/download-artifact@v8.0.1` |
| Upload combined reports | `actions/upload-artifact@v7.0.0` |

**Runs if:** `always()` — collects results regardless of test outcome.

---

## Forward Compatibility: `test-and-report-latest-node.yml`

**Trigger:** Push to `main`, Pull Request to `main`

**Node.js:** 27 nightly (updated to each new major nightly release as it ships)

**Purpose:** Tests the application against the latest Node.js release to detect breaking changes before they affect the primary workflow. Uses the same job structure as `test-and-report.yml`.

This workflow serves as the **canary** for Node.js upgrades. When a new version is released:
1. This workflow is updated to the new version first
2. Once CI passes, the primary workflow is updated

---

## Release Workflow: `release.yml`

**Trigger:** Push to tags matching `v*`, or `workflow_dispatch`

**Node.js:** 26

**Job Graph:**

```
prepare
  └─→ build
        └─→ release
```

### Jobs

#### `prepare`
Validates the full application (tests + E2E) before building a release.

| Step | Action |
|------|--------|
| Get version | Extracts from tag or input |
| Install system deps | xvfb, Chrome, D-Bus |
| Setup Node.js 26 | `actions/setup-node@v6.4.0` |
| Install + build + test | `npm ci`, `npm run build`, E2E, coverage |
| Set version | `npm version` (workflow_dispatch only) |
| Auto-commit | `stefanzweifel/git-auto-commit-action@v7.1.0` |

**Permissions:** `contents: write`

#### `build`
Creates the release artifact with SBOM and attestations.

| Step | Action |
|------|--------|
| Setup Node.js 26 | `actions/setup-node@v6.4.0` |
| Build | `npm run build` |
| Create ZIP | `game-{version}.zip` |
| Generate SBOM | `anchore/sbom-action@v0.23.1` (SPDX-JSON) |
| Build attestation | `actions/attest-build-provenance@v4.1.0` |
| SBOM attestation | `actions/attest@v4.1.0` |

**Permissions:** `contents: read`, `id-token: write`, `attestations: write`

#### `release`
Publishes the GitHub Release and deploys to GitHub Pages.

| Step | Action |
|------|--------|
| Draft release notes | `release-drafter/release-drafter@v7.1.0` |
| Create release | `ncipollo/release-action@v1.21.0` |
| Deploy to Pages | `JamesIves/github-pages-deploy-action@v4.8.0` |

**Permissions:** `contents: write`, `id-token: write`

---

## Security Workflows

### CodeQL Analysis: `codeql.yml`

**Trigger:** Push/PR to `main`, weekly schedule (Monday 00:00 UTC)

**Node.js:** 26

**Languages:** `javascript`, `typescript`

Runs GitHub's CodeQL static analysis engine with the custom configuration at `.github/codeql-config.yml`.

### Dependency Review: `dependency-review.yml`

**Trigger:** Pull Request to `main`

Reviews dependency changes for known vulnerabilities using the GitHub Advisory Database.

### OpenSSF Scorecard: `scorecards.yml`

**Trigger:** Push to `main`, weekly schedule

Measures supply-chain security posture across multiple dimensions (branch protection, CI, dependency pinning, etc.).

### OWASP ZAP Scan: `zap-scan.yml`

**Trigger:** Schedule, workflow_dispatch

Runs a baseline DAST scan against the deployed application for common web vulnerabilities.

### Lighthouse Performance: `lighthouse-performance.yml`

**Trigger:** Push/PR

Measures and reports Core Web Vitals and performance budgets.

---

## Copilot Environment Workflows

### `copilot-setup-steps.yml`

Pre-installs all tools and MCP servers required by GitHub Copilot coding agent:
- Chrome + Xvfb for Playwright/Three.js rendering
- Node.js 26 with npm cache
- Global MCP server packages (`@modelcontextprotocol/server-*`, `@playwright/mcp`)

**Node.js:** 26

### `copilot-setup.yml`

Reference workflow that documents and validates the full Copilot development environment. Runs on workflow_dispatch only.

**Node.js:** 26

---

## Security Practices Applied to All Workflows

1. **Hardened runners** — `step-security/harden-runner` with egress auditing on every job
2. **Pinned action versions** — workflow files pin actions to full SHA digests (version labels in docs are human-readable references)
3. **Minimal permissions** — `permissions: read-all` at top level, elevated only per-job as needed
4. **Supply chain attestation** — SBOM and build provenance on every release
5. **SBOM quality gate** — minimum score of 7.0/10 enforced in CI

---

## References

- [End-of-Life-Strategy.md](./End-of-Life-Strategy.md) — Node.js version lifecycle management
- [FUTURE_WORKFLOWS.md](./FUTURE_WORKFLOWS.md) — Node.js 27 upgrade plan (Node.js 26 upgrade completed)
- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC)
