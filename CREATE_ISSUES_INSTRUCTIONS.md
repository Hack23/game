# Creating GitHub Issues - Instructions

## Automated Creation (Recommended)

The repository includes a script `create-issues.sh` that will create all 5 priority issues automatically.

### Prerequisites
- GitHub CLI (`gh`) installed
- Authenticated with GitHub: `gh auth login`
- Write access to the repository

### Run the Script

```bash
# Make the script executable (if not already)
chmod +x create-issues.sh

# Run the script to create all 5 issues
./create-issues.sh
```

The script will create all 5 issues with proper labels, descriptions, and formatting.

## Manual Creation

If you prefer to create issues manually, copy the content from `PRIORITY_ISSUES.md` for each issue:

### Issue 1: 🔒 Fix 12 High-Severity Security Findings from ZAP Scan
- **Labels:** `security`, `priority:critical`, `size:small`, `type:security`
- **Content:** See PRIORITY_ISSUES.md, Issue 1 section

### Issue 2: ⚡ Optimize Three.js Bundle Size from 1.1MB to <500KB
- **Labels:** `performance`, `priority:high`, `size:medium`, `type:performance`
- **Content:** See PRIORITY_ISSUES.md, Issue 2 section

### Issue 3: 📦 Update 3 Outdated Dependencies to Latest Versions
- **Labels:** `dependencies`, `priority:high`, `size:small`, `type:chore`
- **Content:** See PRIORITY_ISSUES.md, Issue 3 section

### Issue 4: 📝 Add Comprehensive API Documentation with Architecture Diagrams
- **Labels:** `documentation`, `priority:medium`, `size:medium`, `type:docs`
- **Content:** See PRIORITY_ISSUES.md, Issue 4 section

### Issue 5: ✅ Increase App.tsx Test Coverage from 62.82% to 80%+
- **Labels:** `testing`, `priority:medium`, `size:medium`, `type:test`
- **Content:** See PRIORITY_ISSUES.md, Issue 5 section

## Using GitHub CLI Directly

You can also create individual issues using the GitHub CLI:

```bash
# Example for Issue 1
gh issue create \
  --repo Hack23/game \
  --title "🔒 Fix 12 High-Severity Security Findings from ZAP Scan" \
  --label "security,priority:critical,size:small,type:security" \
  --body-file <(sed -n '/^## Issue 1:/,/^## Issue 2:/p' PRIORITY_ISSUES.md | head -n -1)
```

## Verification

After creating the issues, verify they were created successfully:

```bash
gh issue list --repo Hack23/game --limit 5
```

You should see 5 new issues with the titles matching the priority issues specification.
