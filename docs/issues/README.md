# 🎯 Next Release Preparation - Top 5 Priority Issues

This directory contains the automated workflow and documentation for creating priority issues for the next release.

## Quick Start

### Method 1: Run the Automated Workflow (Recommended)

```bash
# Via GitHub UI
1. Go to Actions → "Create Priority Issues for Release"
2. Click "Run workflow"
3. All 5 issues will be created with proper labels

# Via GitHub CLI
gh workflow run create-priority-issues.yml
```

### Method 2: Use the Documentation

Review the detailed specifications in [`PRIORITY_ISSUES_NEXT_RELEASE.md`](../PRIORITY_ISSUES_NEXT_RELEASE.md) and create issues manually or adapt the templates.

## What Gets Created

The workflow creates **5 high-priority issues** designed to be:
- ✅ **Small-to-medium effort** (1-6 hours each)
- ✅ **Independent** (can be worked on in parallel)
- ✅ **Well-defined** with clear acceptance criteria
- ✅ **High impact** on security, performance, or code quality
- ✅ **ISMS-compliant** (aligned with Hack23 AB policies)

## The 5 Priority Issues

| # | Issue | Priority | Effort | Impact |
|---|-------|----------|--------|--------|
| 1 | 🔒 Security Headers Enhancement | High | Medium | Critical |
| 2 | 🔷 TypeScript Strict Typing (8 fixes) | High | Small | High |
| 3 | ⚡ Bundle Size Optimization | High | Medium | High |
| 4 | 🧪 Test Coverage Improvement | High | Small | High |
| 5 | 📦 Dependency Updates & Security Audit | Medium | Small | Medium |

**Total Estimated Effort:** 13-19 hours

## Files in This Package

```
.github/workflows/
  └── create-priority-issues.yml    # Automated workflow to create all 5 issues

docs/
  ├── PRIORITY_ISSUES_NEXT_RELEASE.md   # Complete specifications
  └── issues/
      └── README.md                     # This file
```

## Issue Priority Scoring

Issues were prioritized using the formula:
```
Priority Score = (Impact × 2) + Urgency + Effort Bonus
Where: Small=+3, Medium=+2, Large=+1, XL=0
```

All issues scored 12-17 points, making them top priorities for the next release.

## Features

### Workflow Features
- ✅ **Hardened runner** with security audit logging
- ✅ **Comprehensive labels** (type, priority, size, domain)
- ✅ **Summary report** showing all created issues
- ✅ **Rate limiting** between issue creations
- ✅ **SHA-pinned actions** for supply chain security

### Documentation Features
- ✅ **Detailed objectives** and background for each issue
- ✅ **Specific acceptance criteria** (testable requirements)
- ✅ **Implementation guidance** with code examples
- ✅ **Related resources** and ISMS policy links
- ✅ **Metadata** (priority, effort, impact, labels)

## Usage Examples

### Create All Issues at Once
```bash
gh workflow run create-priority-issues.yml
```

### Create Individual Issues
```bash
# Issue 1 - Security Headers
gh issue create \
  --title "🔒 Enhance security headers based on ZAP scan findings" \
  --label "type:security,priority:high,size:medium,domain:infrastructure" \
  --body "$(sed -n '/^## Issue 1/,/^## Issue 2/p' docs/PRIORITY_ISSUES_NEXT_RELEASE.md)"
```

### Check Workflow Status
```bash
gh run list --workflow=create-priority-issues.yml
gh run view <run-id>
```

## Why These 5 Issues?

These issues were selected based on comprehensive repository analysis:

### Analysis Findings
- ✅ **Tests:** 133 tests passing
- ✅ **Build:** Successful
- ⚠️ **Linting:** 8 TypeScript warnings
- ⚠️ **Security:** ZAP scan findings in issue #320
- ⚠️ **Performance:** 1.1MB Three.js bundle
- ⚠️ **Coverage:** App.tsx at 62.82% (target: 80%+)
- ⚠️ **Dependencies:** 1 outdated package

### Strategic Goals
1. **Security First** - Address ZAP findings before production
2. **Code Quality** - Achieve 100% TypeScript strict compliance
3. **Performance** - Reduce bundle size for better UX
4. **Test Confidence** - Reach 80%+ coverage target
5. **Supply Chain** - Keep dependencies current and secure

## Next Steps

1. **Run the workflow** to create all 5 issues
2. **Assign issues** to team members
3. **Track progress** in your project board
4. **Start with Issue #1** (Security Headers) - highest priority
5. **Work in parallel** on other issues as they're independent

## Support

- **Workflow Issues:** Check Actions tab for logs
- **Issue Templates:** Review `PRIORITY_ISSUES_NEXT_RELEASE.md`
- **ISMS Policies:** See [Hack23 ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC)
- **General Help:** Open a discussion or contact the maintainer

---

**Last Updated:** 2025-11-11
**Version:** 1.0.0
**Status:** Ready for use
