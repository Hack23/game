#!/usr/bin/env python3
"""
Create 5 priority GitHub issues for the Hack23/game repository.
This script uses the GitHub REST API to create issues.

Requirements:
    pip install requests

Usage:
    export GITHUB_TOKEN="your_token_here"
    python3 create-issues.py
"""

import os
import sys
import requests
import json

# Repository configuration
REPO_OWNER = "Hack23"
REPO_NAME = "game"
API_BASE = "https://api.github.com"

# Issue definitions
ISSUES = [
    {
        "title": "🔒 Fix 12 High-Severity Security Findings from ZAP Scan",
        "labels": ["security", "priority:critical", "size:small", "type:security"],
        "body": """## 🎯 Objective

Address 12 security findings identified in ZAP Full Scan Report (Issue #320) to strengthen application security posture and align with Hack23 AB's ISMS security standards.

## 📋 Background

The OWASP ZAP dynamic security scan identified multiple security misconfigurations in the deployed application at https://hack23.github.io/game/. These findings relate to missing security headers, CSP policy issues, and cross-domain misconfigurations that could expose the application to various attacks.

**Current State:**
- 12 unique security alert types identified
- Most findings relate to missing or misconfigured HTTP security headers
- Some issues stem from GitHub Pages deployment limitations
- SECURITY_HEADERS.md exists but implementation may be incomplete

**Policy Alignment:**
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)

## ✅ Acceptance Criteria

- [ ] All 12 ZAP security findings are addressed or documented as accepted risks
- [ ] Security headers implementation in `index.html` is complete and correct
- [ ] Content Security Policy (CSP) allows necessary resources while blocking unsafe sources
- [ ] X-Frame-Options prevents clickjacking attacks
- [ ] X-Content-Type-Options prevents MIME-type sniffing
- [ ] Permissions Policy restricts unnecessary browser features
- [ ] Documentation updated in SECURITY_HEADERS.md with justifications
- [ ] E2E test added to verify security headers are present
- [ ] New ZAP scan shows reduction in security findings

## 🛠️ Implementation Guidance

### Files to Modify
1. **`index.html`** - Update meta tags for security headers
2. **`SECURITY_HEADERS.md`** - Document implementation details
3. **`cypress/e2e/security-headers.cy.ts`** (new) - Add security header verification test
4. **`.github/workflows/zap-scan.yml`** - Ensure scan runs on PRs

### Specific ZAP Findings to Address

1. **CORS Misconfiguration [40040]** - 2 instances
2. **CSP: Failure to Define Directive with No Fallback [10055]** - 6 instances
3. **CSP: Meta Policy Invalid Directive [10055]** - 1 instance
4. **CSP: style-src unsafe-inline [10055]** - 4 instances
5. **Cross-Domain Misconfiguration [10098]** - 1 instance
6. **Missing Anti-clickjacking Header [10020]** - 1 instance
7. **Relative Path Confusion [10051]** - 2 instances
8. **X-Frame-Options Defined via META [10020]** - 1 instance
9. **Insufficient Site Isolation Against Spectre [90004]** - 2 instances
10. **Permissions Policy Header Not Set [10063]** - 4 instances
11. **Strict-Transport-Security Header Not Set [10035]** - 4 instances
12. **X-Content-Type-Options Header Missing [10021]** - 1 instance

### Example Security Headers Implementation

```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  media-src 'self' blob:;
  worker-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" />

<!-- Anti-Clickjacking -->
<meta http-equiv="X-Frame-Options" content="DENY" />

<!-- MIME-Type Sniffing Prevention -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />

<!-- Permissions Policy -->
<meta http-equiv="Permissions-Policy" content="
  camera=(),
  microphone=(),
  geolocation=(),
  interest-cohort=()
" />

<!-- Site Isolation (Spectre Protection) -->
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
<meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
```

## 🔗 Related Resources

- [ZAP Full Scan Report Issue #320](https://github.com/Hack23/game/issues/320)
- [OWASP ZAP Alert Reference](https://www.zaproxy.org/docs/alerts/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [SECURITY_HEADERS.md](SECURITY_HEADERS.md)

## 📊 Success Metrics

- ZAP scan findings reduced from 12 to ≤3 (informational only)
- All critical and high severity findings resolved
- Security header verification test passes"""
    },
    {
        "title": "⚡ Optimize Three.js Bundle Size from 1.1MB to <500KB",
        "labels": ["performance", "priority:high", "size:medium", "type:performance"],
        "body": """## 🎯 Objective

Reduce the Three.js bundle size from 1.1MB to under 500KB by implementing tree-shaking, code splitting, and selective imports to improve page load times and user experience.

## 📋 Background

The current production build generates a Three.js bundle of 1.1MB (309KB gzipped), which significantly impacts initial page load performance. This large bundle size is due to importing the entire Three.js library instead of using selective imports.

**Current State:**
- Total bundle size: 1.2MB
- Three.js bundle: `three-rZOyD2Np.js` - 1.1MB (309KB gzipped)
- App bundle: `index-CGrTmcPt.js` - 60KB (16KB gzipped)
- Build warning: "Some chunks are larger than 500 kB after minification"

**Target State:**
- Three.js bundle: <500KB (goal: 300-400KB uncompressed)
- Improved Lighthouse performance score
- Faster time-to-interactive (TTI)

## ✅ Acceptance Criteria

- [ ] Three.js bundle size reduced to <500KB uncompressed
- [ ] Code splitting implemented for Three.js components
- [ ] Only required Three.js modules are imported (no wildcard imports)
- [ ] Build warnings about large chunks are resolved
- [ ] Lighthouse performance score improves by 10+ points
- [ ] All existing functionality still works (game plays correctly)
- [ ] Unit tests pass with new import structure
- [ ] E2E tests verify game functionality
- [ ] Bundle analysis report generated and documented

## 🛠️ Implementation Guidance

### Files to Modify

1. **`src/App.tsx`** - Replace wildcard Three.js imports with selective imports
2. **`vite.config.ts`** - Configure manual chunks for better code splitting
3. **`package.json`** - Add bundle analysis script
4. **`docs/PERFORMANCE.md`** (new) - Document optimization strategies

### Step 1: Replace Wildcard Imports

Current import pattern:
```typescript
import * as THREE from "three";
```

Replace with selective imports:
```typescript
import { 
  Vector3, 
  Mesh, 
  BufferGeometry,
  MeshStandardMaterial,
  // ... only what you actually use
} from "three";
```

### Step 2: Configure Vite for Manual Chunking

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
});
```

## 🔗 Related Resources

- [Three.js Tree Shaking Guide](https://threejs.org/docs/#manual/en/introduction/Installation)
- [Vite Manual Chunks Configuration](https://vitejs.dev/guide/build.html#chunking-strategy)
- [React Three Fiber Performance Tips](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls)

## 📊 Success Metrics

**Before:**
- Three.js bundle: 1.1MB (309KB gzipped)
- Total bundle: 1.2MB

**Target:**
- Three.js bundle: <500KB (<150KB gzipped)
- Total bundle: <700KB
- Lighthouse Performance: +10 points improvement
- TTI (Time to Interactive): <3 seconds on 3G"""
    },
    {
        "title": "📦 Update 3 Outdated Dependencies to Latest Versions",
        "labels": ["dependencies", "priority:high", "size:small", "type:chore"],
        "body": """## 🎯 Objective

Update 3 outdated development dependencies to their latest versions to ensure compatibility, security patches, and access to latest features while maintaining project stability.

## 📋 Background

The project currently has 3 minor version updates available for development dependencies. While there are no security vulnerabilities, keeping dependencies up-to-date is a best practice that:
- Ensures compatibility with latest tools
- Provides access to bug fixes and improvements
- Reduces technical debt
- Aligns with [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)

**Current State:**
```json
{
  "@types/react-dom": "19.2.2",  // latest: 19.2.3
  "@vitejs/plugin-react": "5.1.0", // latest: 5.1.1
  "jsdom": "27.1.0"                // latest: 27.2.0
}
```

**Impact:** Development dependencies only - no production runtime impact

## ✅ Acceptance Criteria

- [ ] All 3 dependencies updated to latest versions
- [ ] `package.json` and `package-lock.json` updated
- [ ] No breaking changes introduced
- [ ] All unit tests pass after update
- [ ] All E2E tests pass after update
- [ ] Build completes successfully
- [ ] License compliance check passes
- [ ] No new security vulnerabilities introduced

## 🛠️ Implementation Guidance

### Update Commands

```bash
# Update all three dependencies at once
npm install --save-dev \\
  @types/react-dom@19.2.3 \\
  @vitejs/plugin-react@5.1.1 \\
  jsdom@27.2.0
```

### Verification Steps

```bash
# 1. Run linter
npm run lint

# 2. Run type checking
npm run build

# 3. Run unit tests
npm run test

# 4. Run test coverage
npm run coverage

# 5. Run E2E tests
npm run test:e2e

# 6. Check license compliance
npm run test:licenses

# 7. Verify no security issues
npm audit
```

## 🔗 Related Resources

- [@types/react-dom releases](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/master/types/react-dom)
- [@vitejs/plugin-react releases](https://github.com/vitejs/vite-plugin-react/releases)
- [jsdom releases](https://github.com/jsdom/jsdom/releases)
- [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)

## 📊 Success Metrics

**Before:**
- Outdated dependencies: 3
- Security vulnerabilities: 0

**After:**
- Outdated dependencies: 0
- Security vulnerabilities: 0
- All tests passing: ✅
- Build successful: ✅"""
    },
    {
        "title": "📝 Add Comprehensive API Documentation with Architecture Diagrams",
        "labels": ["documentation", "priority:medium", "size:medium", "type:docs"],
        "body": """## 🎯 Objective

Create comprehensive API documentation with architecture diagrams to improve developer onboarding, maintainability, and alignment with ISMS documentation requirements.

## 📋 Background

The project currently has excellent security documentation but lacks detailed technical documentation for:
- Component API interfaces
- Game state management architecture
- Audio system architecture
- Three.js integration patterns
- Hook APIs and usage examples

**Current State:**
- README.md provides high-level overview ✅
- Security documentation is comprehensive ✅
- Component-level documentation is minimal ⚠️
- Architecture diagrams are missing ⚠️
- API reference documentation is missing ⚠️

## ✅ Acceptance Criteria

- [ ] API documentation created for all public components
- [ ] Architecture diagrams added using Mermaid
- [ ] Component interface documentation complete
- [ ] Hook API documentation with usage examples
- [ ] Code examples for common patterns
- [ ] Documentation follows consistent format
- [ ] All documentation validated (no broken links)
- [ ] README.md updated with links to new documentation
- [ ] Documentation includes TypeScript type signatures

## 🛠️ Implementation Guidance

### Files to Create/Modify

1. **`docs/API_REFERENCE.md`** (new) - Complete API documentation
2. **`docs/ARCHITECTURE.md`** (new) - System architecture with diagrams
3. **`docs/COMPONENTS.md`** (new) - Component documentation
4. **`docs/HOOKS.md`** (new) - Hook API documentation
5. **`README.md`** - Add links to new documentation

### Example Architecture Diagram

```mermaid
graph TB
    subgraph "React Application"
        App[App Component]
        GameState[useGameState Hook]
        Audio[useAudioManager Hook]
    end

    subgraph "3D Rendering Layer"
        Canvas[React Three Fiber Canvas]
        Scene[3D Scene]
        Player[Player Object]
        Controls[OrbitControls]
    end

    App --> Canvas
    App --> GameState
    App --> Audio
    Canvas --> Scene
    Scene --> Player
```

### JSDoc Example

```typescript
/**
 * Player component representing the clickable player in the 3D scene.
 * 
 * @component
 * @example
 * ```tsx
 * <Player 
 *   position={[0, 0, 0]} 
 *   color="#00ff88"
 *   onHit={() => handleHit()}
 * />
 * ```
 */
export function Player({ position, color, onHit }: PlayerProps): JSX.Element {
  // implementation
}
```

## 🔗 Related Resources

- [TypeDoc](https://typedoc.org/)
- [Mermaid.js](https://mermaid.js.org/)
- [JSDoc](https://jsdoc.app/)
- [C4 Model](https://c4model.com/)

## 📊 Success Metrics

- All public components documented (5 components)
- All custom hooks documented (2 hooks)
- 3 architecture diagrams created
- 10+ code examples provided
- 100% of links validated"""
    },
    {
        "title": "✅ Increase App.tsx Test Coverage from 62.82% to 80%+",
        "labels": ["testing", "priority:medium", "size:medium", "type:test"],
        "body": """## 🎯 Objective

Improve test coverage for `src/App.tsx` from 62.82% to at least 80% by adding comprehensive unit tests for untested code paths and edge cases.

## 📋 Background

The project maintains strong overall test coverage at 82.92%, but the main `App.tsx` component has notably lower coverage at 62.82%. This component contains critical game logic and UI interactions that should be thoroughly tested.

**Current Coverage:**
```
File     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
---------|---------|----------|---------|---------|------------------
App.tsx  |  62.82  |  60.11   |  72.41  |  63.94  | 144,148,353-362,444
```

**Target Coverage:**
- Statements: 80%+ (currently 62.82%)
- Branches: 75%+ (currently 60.11%)
- Functions: 80%+ (currently 72.41%)
- Lines: 80%+ (currently 63.94%)

## ✅ Acceptance Criteria

- [ ] App.tsx statement coverage ≥80%
- [ ] App.tsx branch coverage ≥75%
- [ ] App.tsx function coverage ≥80%
- [ ] App.tsx line coverage ≥80%
- [ ] All uncovered lines (144, 148, 353-362, 444) are tested
- [ ] Edge cases and error scenarios covered
- [ ] Tests follow existing patterns in codebase
- [ ] All new tests pass in CI/CD pipeline
- [ ] Coverage report generated and verified

## 🛠️ Implementation Guidance

### Files to Modify/Create

1. **`src/App.test.tsx`** - Add missing test cases
2. **`src/App.interaction.test.tsx`** - Enhance interaction tests
3. **`src/App.integration.test.tsx`** - Add integration scenarios
4. **`src/App.error.test.tsx`** (new) - Test error boundaries and edge cases

### Uncovered Lines to Test

- **Line 144:** Conditional branch or error handler
- **Line 148:** Audio initialization or state update
- **Lines 353-362:** Block of code (function or complex conditional)
- **Line 444:** Cleanup or export

### Example Test Structure

```typescript
describe('App - Uncovered Code Paths', () => {
  it('should handle audio initialization failure gracefully', async () => {
    // Test audio failure scenario
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/game/i)).toBeInTheDocument();
    });
  });

  it('should handle rapid clicking on player', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const canvas = screen.getByRole('img', { hidden: true });
    for (let i = 0; i < 10; i++) {
      await user.click(canvas);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/combo/i)).toBeInTheDocument();
    });
  });
});
```

### Verification Commands

```bash
# View coverage in detail
npm run coverage -- --reporter=html

# Check coverage report
# App.tsx should show ≥80% coverage
```

## 🔗 Related Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📊 Success Metrics

**Before:**
- Statements: 62.82%
- Branches: 60.11%
- Functions: 72.41%
- Lines: 63.94%

**Target:**
- Statements: ≥80%
- Branches: ≥75%
- Functions: ≥80%
- Lines: ≥80%
- Total tests: +20-30 new tests"""
    }
]


def create_issue(token, issue_data):
    """Create a single GitHub issue."""
    url = f"{API_BASE}/repos/{REPO_OWNER}/{REPO_NAME}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
    }
    
    response = requests.post(url, headers=headers, json=issue_data)
    
    if response.status_code == 201:
        issue = response.json()
        return issue
    else:
        print(f"Error creating issue: {response.status_code}")
        print(f"Response: {response.text}")
        return None


def main():
    """Main function to create all issues."""
    token = os.environ.get("GITHUB_TOKEN")
    
    if not token:
        print("Error: GITHUB_TOKEN environment variable not set")
        print("Please set it with: export GITHUB_TOKEN='your_token_here'")
        sys.exit(1)
    
    print(f"Creating {len(ISSUES)} priority issues for {REPO_OWNER}/{REPO_NAME}...")
    print("")
    
    created_issues = []
    
    for i, issue_data in enumerate(ISSUES, 1):
        print(f"Creating Issue {i}: {issue_data['title']}...")
        issue = create_issue(token, issue_data)
        
        if issue:
            created_issues.append(issue)
            print(f"✓ Issue #{issue['number']} created: {issue['html_url']}")
        else:
            print(f"✗ Failed to create issue {i}")
        
        print("")
    
    print("=" * 60)
    print(f"✅ Successfully created {len(created_issues)}/{len(ISSUES)} issues")
    print("=" * 60)
    print("")
    print("Created Issues:")
    for issue in created_issues:
        print(f"  - #{issue['number']}: {issue['title']}")
        print(f"    {issue['html_url']}")
    
    return 0 if len(created_issues) == len(ISSUES) else 1


if __name__ == "__main__":
    sys.exit(main())
