# Runtime & Toolchain End-of-Life Strategy

## Overview

This document defines the strategy for managing Node.js runtime and TypeScript compiler versions in the **game** project, ensuring we stay on actively maintained releases and plan upgrades proactively. All version decisions align with the [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC).

---

## Current Status (May 2026)

### Node.js

| Node.js | Release Date | Status | Bug Fixes Until | Security Fixes Until |
|---------|-------------|--------|-----------------|----------------------|
| **26 (Current)** | Apr 22, 2026 | ✅ **Active — in use** | Oct 2026 | Oct 2027 |
| 25 | Oct 15, 2025 | ⚠️ Security-only | N/A | Jun 1, 2026 |
| 24 (LTS – Krypton) | May 2025 | Active LTS | Oct 2026 | Apr 28, 2028 |
| 22 (LTS – Jod) | Apr 2024 | Maintenance | Oct 2025 | Apr 30, 2027 |

> **Note:** Node.js 26 is an even-numbered release that will graduate to **Active LTS in October 2026**. It was released on April 22, 2026. We use Node.js 27 nightly builds in the forward-compatibility workflow (`test-and-report-latest-node.yml`) to validate readiness for the next release.

### TypeScript

| TypeScript | Release Date | Status | Support Until |
|-----------|-------------|--------|---------------|
| **6.0.2** | Mar 2026 | ✅ **Active — in use** | Until 7.0 release (~12 months) |
| 5.9.x | Feb 2026 | Previous stable | Limited — security patches only |
| 5.8.x | Dec 2025 | End of life | ❌ No support |

> **Note:** TypeScript 6.0 is a major release with breaking changes including stricter module resolution with `moduleResolution: "bundler"`, removal of implicit `global` namespace, and stricter `NodeJS` namespace handling. The project uses `@typescript-eslint 8.58.0` which supports `typescript >=4.8.4 <6.1.0`.

---

## Node.js Release Cadence

The OpenJS Foundation follows a predictable release schedule:

- **Every April** — A new **even-numbered** major version is published as "Current"; odd-numbered Current versions reach EOL
- **Every October** — The April even-numbered release graduates to "Active LTS", and a new odd-numbered major is published as "Current"
- **Active LTS** lasts 12 months; **Maintenance LTS** lasts an additional 18 months

```
Version  | Release   | Current  | Active LTS    | Maintenance LTS | EOL
---------|-----------|----------|---------------|-----------------|----------
Node 20  | Apr 2023  | ~6 mo    | Oct 2023      | Oct 2024        | Apr 2026
Node 22  | Apr 2024  | ~6 mo    | Oct 2024      | Oct 2025        | Apr 2027
Node 24  | May 2025  | ~6 mo    | Oct 2025      | Oct 2026        | Apr 2028
Node 25  | Oct 2025  | ~6 mo    | N/A (odd)     | N/A             | Jun 2026
Node 26  | Apr 2026  | ~6 mo    | Oct 2026      | Oct 2027        | Apr 2029
Node 27  | Oct 2026  | ~6 mo    | N/A (odd)     | N/A             | Jun 2027
Node 28  | Apr 2027  | ~6 mo    | Oct 2027      | Oct 2028        | Apr 2030
```

---

## TypeScript Release Cadence

Microsoft publishes TypeScript on a roughly quarterly schedule:

- **Major versions** (e.g., 5.0 → 6.0) ship approximately once per year with breaking changes
- **Minor versions** (e.g., 6.0 → 6.1) ship every 2–3 months with new features
- **Patch versions** (e.g., 6.0.1 → 6.0.2) ship as needed for bug fixes

```
Version  | Release   | Status         | @typescript-eslint Support
---------|-----------|----------------|---------------------------
TS 5.8   | Dec 2025  | End of life    | 8.x (>=4.8.4 <6.1.0)
TS 5.9   | Feb 2026  | Previous       | 8.x (>=4.8.4 <6.1.0)
TS 6.0   | Mar 2026  | Current ✅     | 8.x (>=4.8.4 <6.1.0)
TS 6.1   | ~Jun 2026 | Planned        | Requires @typescript-eslint update
TS 7.0   | ~2027     | Future         | Requires @typescript-eslint update
```

### TypeScript Upgrade Policy

1. **Upgrade to new patch versions immediately** — bug fixes only, no breaking changes.
2. **Upgrade to new minor versions within 2 weeks** — validate `tsc -b`, ESLint, and all tests pass.
3. **Upgrade to new major versions within 1 month** — major versions may require code changes and `@typescript-eslint` compatibility updates.
4. **Never use TypeScript versions unsupported by `@typescript-eslint`** — this would disable type-aware linting.

### TypeScript Upgrade Triggers

| Trigger | Action | Timeline |
|---------|--------|----------|
| New patch release (e.g., 6.0.3) | Update `package.json`, run full CI | Within 1 week |
| New minor release (e.g., 6.1.0) | Verify `@typescript-eslint` compatibility first | Within 2 weeks |
| New major release (e.g., 7.0.0) | Full compatibility assessment, dedicated PR | Within 1 month |
| `@typescript-eslint` drops support | Upgrade `@typescript-eslint` or pin TypeScript | Within 24 hours |

---

## Version Upgrade Policy

### Principles

1. **Never run end-of-life Node.js in CI/CD or production** — upgrade within 30 days of EOL.
2. **Track even-numbered LTS releases for stability** — use Current (odd) releases for forward compatibility testing.
3. **Upgrade CI/CD and dev containers together** — single PR, all-or-nothing.
4. **Test on the next version before it is released** — reduce upgrade friction.

### Upgrade Triggers

| Trigger | Action | Timeline |
|---------|--------|----------|
| New major version release | Update `test-and-report-latest-node.yml` to new version | Within 1 week of release |
| Current version reaches EOL | Upgrade all workflows to next version | Before EOL date |
| LTS version graduates | Evaluate adoption for main workflow | Within 2 weeks |
| Security advisory | Apply patch or upgrade immediately | Within 24 hours |

---

## Upcoming Milestones

### ✅ Completed — Upgraded to Node.js 26: May 2026

All CI/CD workflows, devcontainer configuration, and `package.json` have been updated to Node.js 26. The forward-compatibility workflow (`test-and-report-latest-node.yml`) now targets Node.js 27 nightly.

### ⚠️ Upcoming — Node.js 25 Security EOL: June 1, 2026

Node.js 25 reaches full end-of-life on **June 1, 2026**. This project has already migrated to Node.js 26 — no action required.

### 📅 Future — Node.js 26 Active LTS: October 2026

When Node.js 26 enters Active LTS, it becomes the recommended production runtime. At this point:

- Node.js 24 transitions from Active LTS to Maintenance LTS
- Update `test-and-report-latest-node.yml` to Node.js 27 (already done) or 28 nightly

### 📅 Future — Node.js 27 Release: October 2026

Node.js 27 will be released in **October 2026** as an odd-numbered "Current" release. The forward-compatibility workflow (`test-and-report-latest-node.yml`) already targets Node.js 27 nightly builds.

### 📅 Future — Node.js 24 EOL: April 2028

Node.js 24 reaches end-of-life in April 2028. By this date, all workflows and devcontainers must have moved to Node.js 26 or later.

---

## Version Matrix

The project maintains two parallel test workflows and tracks toolchain versions:

### Node.js

| Workflow | Purpose | Current Node Version |
|----------|---------|----------------------|
| `test-and-report.yml` | Primary CI — stable, production-ready | **26** |
| `test-and-report-latest-node.yml` | Forward-compat — tests next version | **27 nightly** |

When a new Node.js version is released:
1. Update `test-and-report-latest-node.yml` to the new version first
2. Once validated (typically within the same sprint), update `test-and-report.yml`
3. Update all other workflows (`release.yml`, `codeql.yml`, copilot setup) together

### TypeScript & Toolchain

| Tool | Current Version | Peer Constraint | Upgrade Path |
|------|----------------|-----------------|-------------|
| TypeScript | **6.0.2** | — | Follow quarterly releases |
| @typescript-eslint | **8.58.0** | `typescript >=4.8.4 <6.1.0` | Must update before TS 6.1 |
| Vite | **8.0.3** | — | Follow major releases |
| Vitest | **4.1.2** | — | Keep aligned with Vite |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Security vulnerability in EOL Node.js | High (after EOL) | Critical | Upgrade before EOL |
| Incompatible npm packages | Medium | High | Run tests on new version early |
| Breaking API changes | Low | High | Test on Current release before it becomes primary |
| CI/CD downtime during upgrade | Low | Medium | Upgrade in dedicated PR with rollback plan |
| TypeScript major upgrade breaks build | Medium | High | Test with `tsc -b`, lint, and full test suite before merging |
| @typescript-eslint drops TypeScript version support | Medium | High | Monitor peer dependency ranges; pin TypeScript if needed |
| TypeScript strictness regression in new version | Low | Medium | Use project references and separate tsconfigs for app/test/node |

---

## References

- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Node.js End-of-Life Dates — endoflife.date](https://endoflife.date/nodejs)
- [TypeScript Release Notes](https://devblogs.microsoft.com/typescript/)
- [TypeScript End-of-Life Dates — endoflife.date](https://endoflife.date/typescript)
- [@typescript-eslint Supported TypeScript Versions](https://typescript-eslint.io/users/dependency-versions/)
- [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC)
- [WORKFLOWS.md](./WORKFLOWS.md) — Current CI/CD workflow documentation
- [FUTURE_WORKFLOWS.md](./FUTURE_WORKFLOWS.md) — Node.js 26 upgrade (completed)
