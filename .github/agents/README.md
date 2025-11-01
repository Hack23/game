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
**Purpose:** PixiJS 8.x game development with React integration

Specialized in:
- PixiJS with @pixi/react components
- Game loop implementation with useTick
- Event handling and user input
- Audio integration with @pixi/sound and Howler.js
- Performance optimization for games

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

When working with GitHub Copilot coding agent, you can request help from specific agents:
- "Ask the game-developer agent to implement a new sprite"
- "Have the security-specialist review this dependency"
- "Request the test-engineer to write tests for this component"

The coding agent will automatically apply the specialized knowledge and guidelines from the relevant agent.

## Agent Configuration

Each agent is configured with:
- **name:** Unique identifier for the agent
- **description:** Brief summary of the agent's expertise
- **prompt:** Detailed instructions and guidelines for the agent

Agents follow the project's coding standards defined in `.github/copilot-instructions.md` and add specialized domain knowledge on top.

## More Information

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
- [Repository Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
