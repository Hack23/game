# GitHub Copilot Custom Agents

This directory contains custom agent configurations for GitHub Copilot coding agent. Each agent is specialized for different aspects of game development and has specific expertise and guidelines.

## Available Agents

### 🎨 frontend-specialist
**Purpose:** React and UI development with strict TypeScript

Specialized in:
- React 19 features and modern hooks
- Strict TypeScript typing and best practices
- Component-based architecture
- Frontend testing with Vitest and React Testing Library

### 🎮 game-developer
**Purpose:** Three.js game development with React integration

Specialized in:
- Three.js with @react-three/fiber and @react-three/drei
- Game loop implementation with useFrame
- 3D scene composition and event handling
- Audio integration with Howler.js
- Performance optimization for 3D games

### 🧪 test-engineer
**Purpose:** Comprehensive testing strategies

Specialized in:
- Unit testing with Vitest
- E2E testing with Cypress
- React Testing Library best practices
- Test coverage and quality assurance
- CI/CD integration

### 🔒 security-specialist
**Purpose:** Security, compliance, and supply chain protection

Specialized in:
- Supply chain security (OSSF Scorecard, SLSA)
- License compliance verification
- SBOM quality validation
- Secure coding practices
- CodeQL and vulnerability scanning

### 📝 documentation-writer
**Purpose:** Technical documentation and user guides

Specialized in:
- README and project documentation
- API documentation with JSDoc
- Security documentation
- Code comments and inline documentation
- User guides and tutorials

## How to Use

When working with GitHub Copilot coding agent, you can request help from specific agents by mentioning them in your requests. Here are some example phrases (use natural language):
- "Ask the game-developer agent to implement a new sprite"
- "Have the security-specialist review this dependency"
- "Request the test-engineer to write tests for this component"

The coding agent will automatically apply the specialized knowledge and guidelines from the relevant agent based on your request.

## Agent Configuration

Each agent is configured with YAML frontmatter containing:
- **name:** Unique identifier for the agent (lowercase with hyphens)
- **description:** Brief summary of the agent's expertise (max 200 characters)
- **tools:** Array of tools the agent can use (e.g., `["view", "edit", "create", "bash"]`)

The agent's instructions and guidelines are provided in the markdown body after the frontmatter.

Agents follow the project's coding standards defined in `.github/copilot-instructions.md` and add specialized domain knowledge on top.

### Example Agent Structure

```yaml
---
name: agent-name
description: Brief description of agent expertise
tools: ["view", "edit", "create", "bash"]
---

Agent instructions and guidelines go here in the markdown body...
```

## More Information

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
- [Repository Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
