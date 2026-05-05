# Future Workflows: Node.js 27 Upgrade Plan

## Overview

This document describes the planned upgrade of all CI/CD workflows, devcontainer configuration, and documentation from **Node.js 26** to **Node.js 27**.

Node.js 27 is expected in **October 2026**. This upgrade plan is designed to be executed immediately after the official Node.js 27 release.

> **✅ Node.js 26 upgrade completed May 2026.** All workflows, devcontainer, and `package.json` have been updated. The forward-compatibility workflow (`test-and-report-latest-node.yml`) currently uses `26.0.0-nightly` (Node.js 27 nightly builds do not yet exist; they will be published once Node.js 27 development starts, expected October 2026). Update the forward-compat workflow to `27.0.0-nightly` once those builds are available.

---

## Node.js 27 Release Facts

| Attribute | Detail |
|-----------|--------|
| **Expected release** | October 2026 |
| **Initial status** | Current (odd-numbered — no LTS) |
| **EOL** | ~June 2027 |
| **Why upgrade** | Forward-compatibility testing; next primary target is Node.js 28 LTS (April 2027) |

Node.js 27 is an **odd-numbered** release and will **not** become LTS. We use it in the forward-compatibility workflow (`test-and-report-latest-node.yml`) to validate readiness for Node.js 28.

---

## Upgrade Checklist

When Node.js 27 is officially released, execute the following steps in a single PR:

### Phase 1 — Core Configuration (Day 1)

- [ ] **`package.json`** — Update `engines.node` from `>=26` to `>=27`
- [ ] **`.devcontainer/devcontainer.json`** — Update image from `javascript-node:26-trixie` to `javascript-node:27-trixie`, and node feature version from `"26"` to `"27"`

### Phase 2 — GitHub Actions Workflows (Day 1)

Update `node-version` from `"26"` to `"27"` in each of the following files:

- [ ] **`.github/workflows/test-and-report.yml`** — 4 occurrences (prepare, build-validation, unit-tests, e2e-tests)
- [ ] **`.github/workflows/release.yml`** — 2 occurrences (prepare, build)
- [ ] **`.github/workflows/codeql.yml`** — 1 occurrence (analyze)
- [ ] **`.github/workflows/copilot-setup-steps.yml`** — 1 occurrence
- [ ] **`.github/workflows/copilot-setup.yml`** — 1 occurrence in `node-version`, 1 occurrence in setup report text (`Node.js 26` → `Node.js 27`)
- [ ] **`.github/workflows/test-and-report-latest-node.yml`** — 4 occurrences (update from `"26.0.0-nightly"` to `"27.0.0-nightly"` once Node.js 27 nightly builds are published; then advance to `"28.0.0-nightly"` once Node.js 28 nightly builds exist)

### Phase 3 — Documentation (Day 1–2)

- [ ] **`docs/End-of-Life-Strategy.md`** — Update "Current Status" table, highlight Node.js 27 as active
- [ ] **`docs/WORKFLOWS.md`** — Update "Current Node.js version" and all version references
- [ ] **`docs/FUTURE_WORKFLOWS.md`** (this file) — Update to reflect Node.js 28 as the next planned upgrade
- [ ] **`README.md`** — Update any Node.js version badges or requirements section if present

### Phase 4 — Validation (Day 2)

- [ ] Verify all CI jobs pass on the PR before merging
- [ ] Confirm `test-and-report-latest-node.yml` passes
- [ ] Confirm `release.yml` dry-run succeeds
- [ ] Confirm devcontainer builds successfully with Node.js 27
- [ ] Run `npm audit` to check for any dependency advisories under Node.js 27
- [ ] Check `npm run test:licenses` passes

---

## Sed Commands for Automation

The following commands can be run to perform the bulk of the Node.js 26 → 27 migration:

```bash
# Update all workflow node-version references (double-quoted)
find .github/workflows -name "*.yml" -exec sed -i 's/node-version: "26"/node-version: "27"/g' {} +

# Update the forward-compat nightly workflow from 26.0.0-nightly to 27.0.0-nightly
# (run only after Node.js 27 nightly builds are confirmed available on nodejs.org/download/nightly)
sed -i 's/node-version: "26.0.0-nightly"/node-version: "27.0.0-nightly"/g' .github/workflows/test-and-report-latest-node.yml

# Update copilot-setup.yml (single-quoted)
sed -i "s/node-version: '26'/node-version: '27'/g" .github/workflows/copilot-setup.yml

# Update text references
sed -i 's/Node\.js 26/Node.js 27/g' .github/workflows/copilot-setup.yml

# Update package.json engines field
sed -i 's/"node": ">=26"/"node": ">=27"/' package.json

# Update devcontainer image
sed -i 's/javascript-node:26-trixie/javascript-node:27-trixie/' .devcontainer/devcontainer.json
sed -i 's/"version": "26"/"version": "27"/' .devcontainer/devcontainer.json
```

---

## Compatibility Considerations

### Known Ecosystem Dependencies to Monitor

| Package | Concern | Action |
|---------|---------|--------|
| `vite` | May ship Node.js 27 support update | Check release notes |
| `cypress` | Historically supports new Node quickly | Verify with `npx cypress verify` |
| `vitest` | Tracks Vite compatibility | Validate test suite passes |
| `typescript` | Generally Node-agnostic | No action expected |
| `@typescript-eslint` | Monitor peer dependency ranges | No action expected unless TS 6.1 ships |

### V8 Engine Changes (Node.js 27)

Node.js 27 will ship with a new V8 engine version. This may affect:
- WebAssembly performance
- JavaScript language features (new syntax, built-ins)
- Three.js WebGL rendering path (test via `test-and-report-latest-node.yml` first)

---

## Rollback Plan

If CI fails after the upgrade to Node.js 27:

1. Revert the PR
2. Re-pin `test-and-report-latest-node.yml` to Node.js 27 nightly and investigate failures
3. File issues against specific failing packages
4. Once all failures are resolved, re-open the upgrade PR

---

## Future Roadmap

| Target | Expected Date | Action Required |
|--------|--------------|----------------|
| Node.js 26 Active LTS | October 2026 | Already on 26; no action needed |
| Node.js 27 release | October 2026 | Update `test-and-report-latest-node.yml` from `26.0.0-nightly` to `27.0.0-nightly` once builds exist; primary workflow stays on Node.js 26 LTS |
| Node.js 28 LTS | April 2027 | Next LTS — update primary workflow to 28; update `test-and-report-latest-node.yml` to 28 nightly |
| Node.js 27 EOL | June 2027 | Move forward to 28 before this date |
| Node.js 26 EOL | April 2029 | Migrate to 28 before this date |

---

## TypeScript Upgrade Planning

### Current State

TypeScript **6.0.3** is in use. The `@typescript-eslint 8.59.2` peer dependency constraint is `typescript >=4.8.4 <6.1.0`.

### TypeScript 6.1 Upgrade (Expected ~June 2026)

When TypeScript 6.1 is released:

1. **Check `@typescript-eslint` compatibility** — version 8.59.2 requires `<6.1.0`; a newer release will be needed
2. **Update `@typescript-eslint`** to a version supporting TS 6.1
3. **Update `package.json`** — change `typescript` to the new version
4. **Run full validation** — `npm run build`, `npm run lint`, `npm run test`
5. **Review breaking changes** — consult [TypeScript release notes](https://devblogs.microsoft.com/typescript/)

### TypeScript 7.0 Upgrade (Expected ~2027)

Major version upgrades may require:

- Code changes for stricter type checking
- `tsconfig.json` updates for new compiler options
- `@typescript-eslint` major version upgrade
- Dedicated PR with full test suite validation

---

## Related Documents

- [End-of-Life-Strategy.md](./End-of-Life-Strategy.md) — Full Node.js lifecycle policy
- [WORKFLOWS.md](./WORKFLOWS.md) — Current CI/CD workflow documentation
- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Node.js Changelog](https://github.com/nodejs/node/blob/main/CHANGELOG.md)
