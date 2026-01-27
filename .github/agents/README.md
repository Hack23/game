# GitHub Copilot Custom Agents

This directory contains custom agent configurations for GitHub Copilot coding agent. Each agent is specialized for different aspects of game development and provides expert guidance following the project's standards.

## 🎯 Available Agents

### 🎯 product-task-agent
**Expert in product analysis, quality improvement, and GitHub issue creation**

Specialized in:
- Product quality analysis across code, UI/UX, security, and performance
- Creating well-structured GitHub issues with proper labels and assignments
- Coordinating between specialized agents for task implementation
- ISMS compliance verification and security alignment (v3.2, 2026)
- Identifying improvements and creating actionable tasks

**Tools:** `view`, `edit`, `create`, `bash`, `search_code`, `custom-agent`

**Key Capabilities:**
- 🔍 Analyze codebase for quality, security, and UX improvements
- 📝 Create structured GitHub issues with clear acceptance criteria
- 🤝 Assign tasks to appropriate specialized agents
- 🔒 Verify ISMS policy alignment and compliance (v3.2, 2026)
- 📊 Generate comprehensive product improvement plans
- ✅ Run quality checks: `npm run lint`, `npm run build`, `npm run test`, `npm run coverage`, `npm run test:licenses`

---

### 🎮 game-developer
**Expert in Three.js game development with React integration**

Specialized in:
- Three.js with @react-three/fiber and @react-three/drei
- Game loop implementation with useFrame
- 3D scene composition and event handling
- Audio integration with Howler.js
- Performance optimization for 60fps 3D games
- Strict TypeScript typing for game components

**Tools:** `view`, `edit`, `create`, `bash`, `custom-agent`

**Quality Checks:** `npm run lint`, `npm run build`, `npm run test`, `npm run coverage`, `npm run test:e2e`, `npm run test:licenses`

---

### 🎨 frontend-specialist
**Expert in React and UI development with strict TypeScript**

Specialized in:
- React 19 features and modern hooks
- Strict TypeScript typing and best practices
- Component-based architecture
- State management and Context API
- Frontend testing with Vitest and React Testing Library
- Vite build optimization

**Tools:** `view`, `edit`, `create`, `bash`, `custom-agent`

**Quality Checks:** `npm run lint`, `npm run build`, `npm run test`, `npm run coverage`, `npm run test:licenses`

---

### 🧪 test-engineer
**Expert in comprehensive testing strategies and quality assurance**

Specialized in:
- Unit testing with Vitest and jsdom
- E2E testing with Cypress
- React Testing Library best practices
- Test coverage and quality metrics (80%+ target)
- Testing 3D game interactions
- CI/CD integration and test automation

**Tools:** `view`, `edit`, `create`, `bash`, `search_code`, `custom-agent`

**Quality Checks:** `npm run lint`, `npm run build`, `npm run test`, `npm run coverage`, `npm run test:e2e`, `npm run test:licenses`

---

### 🔒 security-specialist
**Expert in security, compliance, and supply chain protection**

Specialized in:
- Supply chain security (OSSF Scorecard, SLSA)
- License compliance verification
- SBOM quality validation (min 7.0/10)
- Secure coding practices and OWASP guidelines
- CodeQL and vulnerability scanning
- Dependency management and audit
- [ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC) (v3.2, 2026) policy compliance
- Security documentation aligned with [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

**Tools:** `view`, `edit`, `bash`, `search_code`, `custom-agent`

**Quality Checks:** `npm audit`, `npm run test:licenses`, `npm run lint`, `npm run build`, `npm run test`

---

### 📝 documentation-writer
**Expert in technical documentation and user guides**

Specialized in:
- README and project documentation
- API documentation with JSDoc
- Security documentation (SECURITY.md)
- Code comments and inline documentation
- User guides and tutorials
- Mermaid diagrams and architecture docs

**Tools:** `view`, `edit`, `create`, `search_code`, `custom-agent`

**Quality Checks:** Verify code examples, check links, ensure ISMS references are current (v3.2, 2026)

---

## 🔄 Agent Workflow

```mermaid
graph TB
    User[Developer Request] --> Copilot[GitHub Copilot]
    Copilot --> AgentSelect{Select Agent}
    
    AgentSelect -->|Product Analysis| TaskAgent[🎯 product-task-agent]
    AgentSelect -->|3D Game Code| GameDev[🎮 game-developer]
    AgentSelect -->|UI/React Code| Frontend[🎨 frontend-specialist]
    AgentSelect -->|Testing| TestEng[🧪 test-engineer]
    AgentSelect -->|Security| Security[🔒 security-specialist]
    AgentSelect -->|Documentation| DocWriter[📝 documentation-writer]
    
    TaskAgent --> Tools[Agent Tools]
    GameDev --> Tools
    Frontend --> Tools
    TestEng --> Tools
    Security --> Tools
    DocWriter --> Tools
    
    Tools --> MCP[MCP Servers]
    MCP --> FS[📁 Filesystem]
    MCP --> GH[🐙 GitHub]
    MCP --> Git[📋 Git]
    MCP --> PW[🎭 Playwright]
    
    Tools --> Output[Code/Docs/Tests/Issues]
    
    TaskAgent -.->|Creates Issues| GH
    TaskAgent -.->|Assigns| GameDev
    TaskAgent -.->|Assigns| Frontend
    TaskAgent -.->|Assigns| TestEng
    TaskAgent -.->|Assigns| Security
    TaskAgent -.->|Assigns| DocWriter
    
    style TaskAgent fill:#FFC107,stroke:#F57C00,stroke-width:3px,color:#000
    style GameDev fill:#4CAF50
    style Frontend fill:#2196F3
    style TestEng fill:#FF9800
    style Security fill:#D32F2F
    style DocWriter fill:#9C27B0
```

## 💡 How to Use

When working with GitHub Copilot, request help from specific agents using natural language:

**Example Requests:**
```
@workspace Use the product-task-agent to analyze the codebase and create improvement issues

@workspace Ask the product-task-agent to review UI/UX and create accessibility issues

@workspace Use the game-developer agent to create a new Three.js sprite component

@workspace Ask the security-specialist to review this dependency for vulnerabilities

@workspace Have the test-engineer write Vitest tests for this component

@workspace Request the frontend-specialist to refactor this with React hooks

@workspace Use the documentation-writer to create JSDoc comments for this API
```

The coding agent will automatically apply the specialized knowledge and guidelines from the relevant agent.

### 🎯 Product Task Agent Usage

The product-task-agent is your go-to for:
- **Product Analysis:** Comprehensive quality, security, and UX assessment
- **Issue Creation:** Creating structured GitHub issues with proper categorization
- **Agent Coordination:** Assigning tasks to specialized agents
- **ISMS Compliance:** Verifying alignment with Hack23 AB security policies

**Example Workflows:**
```
@workspace Use product-task-agent to:
- Analyze the codebase for quality improvements and create prioritized issues
- Review UI/UX using Playwright and create accessibility enhancement issues
- Check ISMS compliance and create security alignment issues
- Identify test coverage gaps and assign to test-engineer
- Review documentation completeness and assign to documentation-writer
```

## 🛠️ Agent Tools

Each agent has access to specific tools based on their responsibilities:

| Tool | Alias | Description | Agents |
|------|-------|-------------|---------|
| **view** | read | Read file contents, inspect code | All agents |
| **edit** | edit | Modify existing files | All agents |
| **create** | create | Create new files | 🎮 🎨 🧪 📝 |
| **bash** | shell | Execute shell commands, run npm scripts, build, test | 🎮 🎨 🧪 🔒 |
| **search_code** | search | Search codebase for patterns | 🧪 🔒 📝 |
| **custom-agent** | - | Invoke other custom agents for specialized tasks | All agents |
| **web** | - | Web search (requires configuration) | Available but not assigned |
| **todo** | - | Task management (requires configuration) | Available but not assigned |

### MCP Server Capabilities

In addition to agent tools, all agents can leverage MCP (Model Context Protocol) servers configured in `.github/copilot-mcp.json`:

- **📁 Filesystem Server:** Secure file access and project structure navigation
- **🐙 GitHub Server:** Repository metadata, issues, PRs, and workflow status
- **📋 Git Server:** Commit history, branches, and code evolution tracking
- **💭 Memory Server:** Conversation context and session history
- **🎭 Playwright Server:** Browser automation for testing and debugging
- **🔍 Brave Search:** Documentation search (requires API key)

MCP servers provide enhanced capabilities beyond basic agent tools, enabling agents to perform complex operations like browser automation, repository analysis, and contextual memory.

## ⚙️ Agent Configuration

Each agent is defined in a markdown file with YAML frontmatter:

```yaml
---
name: agent-name
description: Brief description of agent expertise (max 200 chars)
tools: ["view", "edit", "create", "bash"]
---

You are the [Agent Name], a specialized expert in...

## Core Expertise

You specialize in:
- Area 1
- Area 2

## Guidelines

- Guideline 1
- Guideline 2

## Remember

- Key principle 1
- Key principle 2
```

### Required Properties

- **name:** Lowercase with hyphens (e.g., `game-developer`)
- **description:** Max 200 characters describing expertise
- **tools:** Array of tool aliases the agent needs

### Agent Design Principles

✅ **Single Responsibility:** Each agent focuses on one domain
✅ **Minimal Tools:** Only include tools the agent actually needs
✅ **Clear Expertise:** Well-defined areas of specialization
✅ **Quality Checks:** All agents reference relevant npm scripts for validation
✅ **ISMS Alignment:** All agents follow [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC) (v3.2, 2026)
✅ **Consistent Standards:** All agents follow project guidelines in `.github/copilot-instructions.md`

**Note on MCP Servers:** Repository-level agents (in `.github/agents/`) cannot have MCP server configurations. MCP servers are configured at the repository level in `.github/copilot-mcp.json` and are available to all agents through the Copilot environment.

## 📊 Agent Specialization Matrix

| Domain | Primary Agent | Secondary Agent | MCP Server |
|--------|--------------|-----------------|------------|
| Product Analysis | 🎯 product-task-agent | All agents | GitHub, Playwright |
| Issue Management | 🎯 product-task-agent | - | GitHub |
| Three.js/3D | 🎮 game-developer | 🧪 test-engineer | Playwright |
| React/UI | 🎨 frontend-specialist | 🧪 test-engineer | Playwright |
| Testing | 🧪 test-engineer | 🎮 🎨 | Playwright |
| Security | 🔒 security-specialist | 🎯 product-task-agent | GitHub |
| Documentation | 📝 documentation-writer | - | Filesystem |
| ISMS Compliance | 🔒 security-specialist | 🎯 product-task-agent | GitHub |

## 📚 Resources

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
- [Repository Custom Instructions](../copilot-instructions.md)
- [MCP Configuration](../copilot-mcp.json)
- [Hack23 AB ISMS (v3.2, 2026)](https://github.com/Hack23/ISMS-PUBLIC)
- [ISMS Policy Mapping](../../docs/ISMS_POLICY_MAPPING.md)
