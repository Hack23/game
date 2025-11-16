# 🎯 Product Task Agent - Usage Guide

## Overview

The **product-task-agent** is a specialized GitHub Copilot custom agent designed to analyze your game project comprehensively and create actionable GitHub issues for improvements. It focuses on quality, UI/UX, security, and ISMS compliance.

## 🎯 Key Capabilities

### 1. Product Analysis
- **Code Quality Assessment**: Analyze codebase structure, technical debt, and maintainability
- **UI/UX Evaluation**: Use Playwright to test and capture UI interactions
- **Security Review**: Check ISMS compliance, dependency vulnerabilities, and security controls
- **Performance Analysis**: Review build times, bundle sizes, and runtime performance

### 2. GitHub Issue Creation
- **Structured Issues**: Creates well-formatted issues with clear objectives and acceptance criteria
- **Proper Labeling**: Applies appropriate labels for categorization
- **Agent Assignment**: Suggests and assigns issues to specialized agents
- **ISMS Alignment**: References relevant security policies when applicable

### 3. Agent Coordination
- **Task Delegation**: Routes issues to appropriate specialized agents
- **Context Provision**: Provides detailed analysis and implementation guidance
- **Cross-Agent Collaboration**: Coordinates complex tasks involving multiple agents

## 🚀 Example Usage Scenarios

### Scenario 1: Comprehensive Product Analysis

**Prompt:**
```
@workspace Use the product-task-agent to analyze the entire codebase and create prioritized improvement issues covering:
- Code quality and technical debt
- UI/UX improvements
- Security and ISMS compliance
- Test coverage gaps
- Documentation completeness
```

**Expected Output:**
The agent would:
1. Scan the codebase using `search_code` and `view` tools
2. Run Playwright tests to capture UI screenshots
3. Review ISMS policy mapping for compliance gaps
4. Check test coverage reports
5. Create 5-10 prioritized GitHub issues with:
   - Clear descriptions and acceptance criteria
   - Appropriate labels (feature, bug, security, etc.)
   - Agent assignments (@game-developer, @frontend-specialist, etc.)
   - ISMS policy references where applicable

### Scenario 2: UI/UX Accessibility Audit

**Prompt:**
```
@workspace Use product-task-agent to:
1. Run Playwright accessibility tests on all major UI components
2. Capture screenshots of accessibility issues
3. Create GitHub issues for each finding
4. Assign to frontend-specialist for implementation
```

**Example Issue Created:**

```markdown
# Improve Volume Control Accessibility

## 🎯 Objective
Enhance the volume control component to meet WCAG 2.1 AA standards.

## 📋 Context
Current volume control lacks keyboard navigation and ARIA labels.

**Impact:** Users with accessibility needs cannot control audio.

## ✅ Acceptance Criteria
- [ ] Volume control is fully keyboard navigable
- [ ] ARIA labels present for screen readers
- [ ] Focus indicators visible and meet WCAG contrast ratios
- [ ] Touch targets minimum 44x44px

## 🔍 Analysis
**File:** `src/components/VolumeControl.tsx`

**Playwright Screenshot:** [attached]

**Current Implementation:**
- Missing `aria-label` and `role` attributes
- No keyboard event handlers
- Touch targets are 32x32px (below minimum)

## 💡 Recommended Approach
1. Add keyboard event handlers for arrow keys
2. Implement ARIA attributes: `role="slider"`, `aria-valuemin="0"`, etc.
3. Add visible focus outline with `:focus-visible`
4. Increase touch target size using CSS padding

## 👥 Suggested Agent Assignment
@frontend-specialist - Expert in React UI and accessibility

## 🏷️ Labels
`enhancement`, `ui-ux`, `accessibility`, `compliance`

## 📚 References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Privacy Policy - Inclusive Design](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md)
```

### Scenario 3: Security and ISMS Compliance Review

**Prompt:**
```
@workspace Use product-task-agent to:
1. Review ISMS policy mapping completeness
2. Check for missing security controls
3. Verify supply chain security measures
4. Create issues for any gaps found
5. Assign to security-specialist
```

**Expected Issues:**
- Missing SBOM quality validation documentation
- Outdated dependency with known CVE
- Security header configuration needs review
- CodeQL finding requires remediation
- License compliance check for new dependency

### Scenario 4: Test Coverage Improvement

**Prompt:**
```
@workspace Use product-task-agent to:
1. Analyze current test coverage (target: 80%+)
2. Identify untested components and critical paths
3. Create issues for missing tests
4. Assign to test-engineer
```

**Example Issue:**

```markdown
# Add E2E Tests for Game State Persistence

## 🎯 Objective
Implement E2E tests to verify game state saves and loads correctly.

## 📋 Context
Current E2E coverage: 65% (target: 80%+)
Missing tests for:
- Save game functionality
- Load game functionality
- State persistence across browser sessions

## ✅ Acceptance Criteria
- [ ] E2E test for save game flow
- [ ] E2E test for load game flow
- [ ] E2E test for state persistence
- [ ] Tests pass in CI/CD pipeline
- [ ] Coverage increases to 75%+

## 💡 Recommended Approach
Use Cypress to:
1. Start a new game and achieve a specific state
2. Save the game
3. Reload the page
4. Load the saved game
5. Verify state matches

## 👥 Suggested Agent Assignment
@test-engineer - Expert in Cypress E2E testing

## 🏷️ Labels
`testing`, `e2e`, `game-logic`, `quality`
```

## 🛠️ Tool Integration

### GitHub MCP Server
```bash
# Create issue
gh issue create \
  --title "Improve accessibility" \
  --body "..." \
  --label "enhancement,ui-ux" \
  --assignee "@frontend-specialist"

# List open issues
gh issue list --state open

# Search for related issues
gh issue list --search "label:accessibility"
```

### Playwright MCP Server
```bash
# Take screenshot
npx playwright screenshot http://localhost:5173 --output /tmp/ui-screenshot.png

# Run accessibility test
npx playwright test --grep @accessibility

# Test different viewports
npx playwright test --device="iPhone 12"
```

### AWS Tools (if configured)
```bash
# Check CloudFront distribution
aws cloudfront list-distributions

# Review S3 bucket settings
aws s3api get-bucket-policy --bucket game-bucket

# Check Lambda function configurations
aws lambda list-functions
```

## 📊 Analysis Focus Areas

### 1. Code Quality
- **Metrics**: Cyclomatic complexity, code duplication, maintainability index
- **Issues**: Refactoring opportunities, design pattern improvements
- **Assignment**: @frontend-specialist or @game-developer

### 2. UI/UX Quality
- **Metrics**: Accessibility score, Lighthouse audit results, user flow completeness
- **Issues**: Accessibility gaps, responsive design problems, interaction improvements
- **Assignment**: @frontend-specialist

### 3. Security & Compliance
- **Metrics**: OSSF Scorecard, dependency vulnerabilities, policy coverage
- **Issues**: Security controls, ISMS alignment, supply chain risks
- **Assignment**: @security-specialist

### 4. Test Coverage
- **Metrics**: Unit test coverage (target: 80%+), E2E test coverage, critical path testing
- **Issues**: Missing tests, flaky tests, test quality improvements
- **Assignment**: @test-engineer

### 5. Documentation
- **Metrics**: API documentation completeness, README accuracy, inline comments
- **Issues**: Missing docs, outdated content, unclear instructions
- **Assignment**: @documentation-writer

## 🏷️ Label Guidelines

The product-task-agent uses these labels when creating issues:

| Label | Usage |
|-------|-------|
| `feature` | New functionality |
| `enhancement` | Improvement to existing feature |
| `bug` | Something isn't working |
| `security` | Security vulnerability or concern |
| `game-logic` | Game mechanics and rules |
| `graphics` | Visual elements and Three.js |
| `audio` | Sound effects and music |
| `ui-ux` | User interface and experience |
| `accessibility` | Accessibility improvements |
| `compliance` | ISMS/policy compliance |
| `supply-chain` | Dependency and supply chain |
| `dependencies` | Dependency updates |
| `ci-cd` | Build and deployment |
| `performance` | Performance optimization |
| `documentation` | Documentation improvements |
| `testing` | Test coverage and quality |

## 🔄 Workflow Example

### Complete Product Improvement Cycle

```mermaid
graph TD
    A[Product Task Agent] -->|Analyze| B[Codebase Analysis]
    B --> C{Identify Issues}
    
    C -->|Code Quality| D1[Create Issue]
    C -->|UI/UX| D2[Create Issue]
    C -->|Security| D3[Create Issue]
    C -->|Testing| D4[Create Issue]
    C -->|Documentation| D5[Create Issue]
    
    D1 -->|Assign| E1[@frontend-specialist]
    D2 -->|Assign| E2[@frontend-specialist]
    D3 -->|Assign| E3[@security-specialist]
    D4 -->|Assign| E4[@test-engineer]
    D5 -->|Assign| E5[@documentation-writer]
    
    E1 --> F[Implementation]
    E2 --> F
    E3 --> F
    E4 --> F
    E5 --> F
    
    F --> G[Code Review]
    G --> H[Merge to Main]
    H --> I[Continuous Improvement]
    
    I -.->|Next Cycle| A
    
    style A fill:#FFC107,stroke:#F57C00,stroke-width:3px
    style B fill:#E3F2FD,stroke:#1976D2,stroke-width:2px
    style C fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px
    style F fill:#E8F5E9,stroke:#388E3C,stroke-width:2px
```

## 💡 Best Practices

### When Using the Product Task Agent

1. **Be Specific**: Clearly state what areas you want analyzed
2. **Provide Context**: Mention current priorities or known issues
3. **Set Constraints**: Specify urgency, complexity, or resource limits
4. **Review Output**: Validate created issues before agent assignments
5. **Iterate**: Use feedback to refine future analysis requests

### Issue Creation Quality

The agent ensures all issues include:
- ✅ Clear, actionable objective
- ✅ Detailed context and analysis
- ✅ Specific acceptance criteria
- ✅ Implementation recommendations
- ✅ Appropriate agent assignment
- ✅ Relevant labels and references

## 🎓 Learning from Examples

### Good Prompt
```
@workspace Use product-task-agent to analyze the authentication flow for security vulnerabilities and ISMS compliance, focusing on:
- Password handling
- Session management
- Access control alignment with Access Control Policy
Create issues with code references and assign to security-specialist.
```

### Better Prompt
```
@workspace Use product-task-agent to:
1. Review src/auth/* for security vulnerabilities
2. Check compliance with https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md
3. Run Playwright tests to verify authentication UI
4. Create detailed GitHub issues with:
   - Code line references
   - Security findings with severity
   - ISMS policy citations
   - Screenshots from Playwright
5. Assign to @security-specialist
```

## 📚 Additional Resources

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
- [ISMS Policy Mapping](./ISMS_POLICY_MAPPING.md)
- [Hack23 AB ISMS-PUBLIC Repository](https://github.com/Hack23/ISMS-PUBLIC)
- [Custom Agents README](../.github/agents/README.md)

---

**Pro Tip:** The product-task-agent is most effective when given clear direction on what to analyze and how to prioritize findings. Start with broad analysis requests, then drill down into specific areas based on initial findings.
