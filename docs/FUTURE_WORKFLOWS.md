# Future Workflows: Node.js 27 Upgrade Plan

## Overview

This document describes the plan to track **Node.js 27** in the forward-compatibility workflow (`test-and-report-latest-node.yml`) as a canary for the eventual **Node.js 28 LTS** upgrade.

Node.js 27 is expected in **October 2026**. Because Node.js 27 is an **odd-numbered non-LTS release**, the primary CI, devcontainer, and `package.json` will **remain on Node.js 26 LTS** throughout. Only `test-and-report-latest-node.yml` will advance to `27.0.0-nightly` once those builds are published.

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

### Phase 1 — Forward-Compat Workflow (when Node.js 27 nightly builds are published)

> **Prerequisite:** Confirm `27.0.0-nightly` builds are available on [nodejs.org/download/nightly](https://nodejs.org/download/nightly/) before running these changes.

- [ ] **`.github/workflows/test-and-report-latest-node.yml`** — 4 occurrences: change `node-version: "26.0.0-nightly"` → `node-version: "27.0.0-nightly"` (prepare, build-validation, unit-tests, e2e-tests)

> **Note:** Primary workflows (`test-and-report.yml`, `release.yml`, `codeql.yml`, Copilot setup), `package.json` engines, and the devcontainer **remain on Node.js 26 LTS** for this phase. The full migration to Node.js 27 does not apply — Node.js 27 is odd-numbered and non-LTS. The next primary-workflow upgrade will happen when **Node.js 28 LTS** is released (April 2027).

### Phase 2 — Documentation (same PR as Phase 1)

- [ ] **`docs/End-of-Life-Strategy.md`** — Update version matrix forward-compat row to "27 nightly (`27.0.0-nightly`)", update note text
- [ ] **`docs/WORKFLOWS.md`** — Update forward-compat Node.js version to "27 nightly"
- [ ] **`docs/FUTURE_WORKFLOWS.md`** (this file) — Update to reflect Node.js 28 LTS as the next planned primary upgrade

### Phase 3 — Validation (same PR)

- [ ] Verify `test-and-report-latest-node.yml` passes on the PR
- [ ] Confirm all other CI jobs continue to pass (they all remain on Node.js 26)
- [ ] Run `npm audit` to check for any dependency advisories

---

## Sed Commands for Automation

The following command updates the forward-compat workflow to Node.js 27 nightly. Run only after confirming `27.0.0-nightly` builds are available on [nodejs.org/download/nightly](https://nodejs.org/download/nightly/):

```bash
# Update the forward-compat nightly workflow from 26.0.0-nightly to 27.0.0-nightly
sed -i 's/node-version: "26.0.0-nightly"/node-version: "27.0.0-nightly"/g' .github/workflows/test-and-report-latest-node.yml
```

> **Note:** The commands below are for the **future Node.js 28 LTS upgrade** (April 2027), not for Node.js 27. Primary workflows, `package.json`, and the devcontainer stay on Node.js 26 until Node.js 28 LTS.

```bash
# === Node.js 28 LTS upgrade (April 2027) — DO NOT run for Node.js 27 ===

# Update all workflow node-version references (double-quoted)
find .github/workflows -name "*.yml" -exec sed -i 's/node-version: "26"/node-version: "28"/g' {} +

# Update the forward-compat nightly to 28.0.0-nightly (once available)
sed -i 's/node-version: "27.0.0-nightly"/node-version: "28.0.0-nightly"/g' .github/workflows/test-and-report-latest-node.yml

# Update copilot-setup.yml (single-quoted)
sed -i "s/node-version: '26'/node-version: '28'/g" .github/workflows/copilot-setup.yml
sed -i 's/Node\.js 26/Node.js 28/g' .github/workflows/copilot-setup.yml

# Update package.json engines field
sed -i 's/"node": ">=26"/"node": ">=28"/' package.json

# Update devcontainer image
sed -i 's/javascript-node:26-trixie/javascript-node:28-trixie/' .devcontainer/devcontainer.json
sed -i 's/"version": "26"/"version": "28"/' .devcontainer/devcontainer.json
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
