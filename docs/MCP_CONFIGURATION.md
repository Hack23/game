<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 AB Logo" width="192" height="192">
</p>

<h1 align="center">⚙️ Hack23 AB — MCP Configuration Guide</h1>

<p align="center">
  <strong>🤖 Model Context Protocol Setup</strong><br>
  <em>🎯 Enhancing GitHub Copilot with specialized context</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Effective-2025--11--10-success?style=for-the-badge" alt="Effective Date"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Quarterly-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 1.0 | **📅 Last Updated:** 2025-11-10 (UTC)  
**🔄 Review Cycle:** Quarterly | **⏰ Next Review:** 2026-02-10

---

# GitHub Copilot MCP Configuration Guide

This document explains how Model Context Protocol (MCP) servers enhance GitHub Copilot's capabilities for this game development project.

## What are MCP Servers?

Model Context Protocol (MCP) servers provide specialized tools and context to AI assistants like GitHub Copilot. They enable Copilot to:

- Access file systems and repositories
- Search documentation and best practices
- Interact with external services
- Maintain conversation context
- Execute specialized tools

## Configured MCP Servers

### 🗂️ Filesystem Server

**Package**: `@modelcontextprotocol/server-filesystem`

Provides secure filesystem access for reading and editing project files.

**Capabilities**:
- Read and write files in allowed directories
- List directory contents
- Create and delete files
- Search for files

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspaces/game"]
}
```

**Allowed Directories**:
- `src/` - Source code
- `public/` - Static assets
- `cypress/` - E2E tests
- `docs/` - Documentation
- `.github/` - GitHub configuration

### 🐙 GitHub Server

**Package**: `@modelcontextprotocol/server-github`

Provides access to GitHub repository data, issues, PRs, and workflows.

**Capabilities**:
- Read issues and pull requests
- Access repository metadata
- View workflow runs
- Search code and discussions

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    "GITHUB_OWNER": "Hack23",
    "GITHUB_REPO": "game"
  }
}
```

**Requirements**:
- `GITHUB_TOKEN` environment variable with repo access

### 📚 Git Server

**Package**: `@modelcontextprotocol/server-git`

Provides Git operations and repository history context.

**Capabilities**:
- View commit history
- Read branch information
- Access file changes
- Understand code evolution

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/workspaces/game"]
}
```

### 🧠 Memory Server

**Package**: `@modelcontextprotocol/server-memory`

Maintains conversation history and context between agent sessions.

**Capabilities**:
- Store conversation context
- Recall previous interactions
- Maintain user preferences
- Track session history

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

### 🔍 Brave Search Server (Optional)

**Package**: `@modelcontextprotocol/server-brave-search`

Enables searching documentation for React, TypeScript, Three.js, and Vite.

**Capabilities**:
- Search web documentation
- Find best practices
- Locate API references
- Discover code examples

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "${BRAVE_API_KEY}"
  },
  "disabled": true
}
```

**Requirements**:
- Brave Search API key from https://brave.com/search/api/
- Set `BRAVE_API_KEY` environment variable to enable

**Recommended Search Domains**:
- react.dev - React documentation
- threejs.org - Three.js website
- threejs.org/docs - Three.js API docs
- vitejs.dev - Vite documentation
- vitest.dev - Vitest documentation
- typescriptlang.org - TypeScript docs
- docs.cypress.io - Cypress documentation
- testing-library.com - Testing Library
- developer.mozilla.org - MDN Web Docs

### 🎭 Playwright Server

**Package**: `@modelcontextprotocol/server-playwright`

Browser automation for testing and debugging web applications.

**Capabilities**:
- Automate browser interactions
- Take screenshots
- Test UI components
- Debug rendering issues

**Configuration**:
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-playwright"]
}
```

## How to Use MCP Servers

### In GitHub Codespaces

### In GitHub Codespaces

1. Open the repository in Codespaces
2. MCP servers are automatically configured
3. Use Copilot Chat to interact with them
4. Example: "Use the filesystem server to find all React components"

### In VS Code

1. Install GitHub Copilot extension
2. MCP servers load automatically with Copilot context
3. Use Copilot Chat with enhanced context
4. Example: "Search documentation for Three.js mesh anchors"

### With Copilot CLI

1. Install GitHub CLI: `gh extension install github/gh-copilot`
2. Configure MCP servers in your environment
3. Use: `gh copilot suggest "create a new game component"`

## Configuration Files

### `.github/copilot-instructions.md`

Provides coding guidelines and project context to Copilot:

- TypeScript strict mode usage
- React and Three.js patterns
- Testing requirements
- Security practices

## Stack-Specific Benefits

### React Development
- Component generation with proper TypeScript types
- Hook usage patterns
- State management best practices
- Performance optimization tips

### TypeScript
- Strict null checking support
- Interface and type generation
- Generic type usage
- Utility type suggestions

### Three.js Game Development
- Sprite and container patterns
- Game loop implementation
- Event handling
- Performance optimization

### Testing
- Vitest test generation
- Cypress E2E test creation
- Mock and stub patterns
- Coverage improvement suggestions

## Security Considerations

### Access Controls
- Filesystem server restricted to project directories
- Read-only access to `node_modules` and `dist`
- GitHub token uses minimal required permissions
- No secrets stored in configuration files

### Environment Variables
All sensitive data uses environment variables:
- `GITHUB_TOKEN` - GitHub API access
- `BRAVE_API_KEY` - Search API access (optional)

### Best Practices
- Never commit API keys or tokens
- Use GitHub Secrets for CI/CD
- Regularly update MCP server packages
- Review server logs for unusual activity

## Troubleshooting

### MCP Server Not Working

### MCP Server Not Working

1. Verify environment variables are set (especially `GITHUB_TOKEN`)
2. Ensure npm can access the package
3. Restart VS Code or Codespace
4. Check Copilot output panel for errors

### Performance Issues

1. Disable unused MCP servers in Copilot settings
2. Limit filesystem server to specific directories
3. Use caching where available
4. Monitor resource usage

### Connection Errors

1. Check network connectivity
2. Verify API keys are valid
3. Check firewall settings
4. Review server logs

## Testing the Configuration

### Local Testing

Test MCP servers locally:
```bash
# Install an MCP server
npx @modelcontextprotocol/server-filesystem /path/to/project

# Test GitHub server
npx @modelcontextprotocol/server-github

# Test Git server
npx @modelcontextprotocol/server-git --repository .
```

**Note:** MCP servers are automatically configured in GitHub Codespaces and VS Code with Copilot.

## Further Reading

- [MCP Specification](https://github.com/modelcontextprotocol/specification)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot)

## 🔒 Security Considerations

### API Key Security

When configuring MCP servers that require API keys (e.g., Brave Search):

- **Never commit API keys to the repository**
- Store keys in environment variables per [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)
- Use GitHub Codespaces secrets for secure storage
- Rotate keys regularly following security best practices
- Reference [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) for credential management

### Secure Development Environment

This project follows [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC):
- MCP servers operate in a hardened development environment
- All configurations follow [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- For security questions, consult the **🔒 security-specialist** agent

## Contributing

To add new MCP servers:

1. Research available MCP servers for your use case
2. Document the server capabilities in this guide
3. Update Copilot configuration as needed
4. Test the server integration
5. Submit a pull request

**Note:** MCP servers are configured through Copilot's environment rather than separate config files.

---

## 📚 Related Documents

### Internal Documentation
- 🏗️ [MCP Architecture](MCP_ARCHITECTURE.md) - Architecture diagrams and design
- 🚀 [Copilot Quick Start](COPILOT_QUICK_START.md) - Getting started guide
- 🤖 [Copilot Instructions](../.github/copilot-instructions.md) - Coding guidelines
- 📊 [ISMS Policy Mapping](ISMS_POLICY_MAPPING.md) - Feature-to-policy alignment

### ISMS-PUBLIC Policies
- 🔐 [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- 🛠️ [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - SDLC and CI/CD requirements
- 🔑 [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) - Authentication and authorization controls
- 🏷️ [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - CIA triad and impact levels

### External Resources
- [MCP Specification](https://github.com/modelcontextprotocol/specification) - Official MCP protocol documentation
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot) - Official Copilot documentation
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers) - Official MCP server implementations

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**📅 Effective Date:** 2025-11-10  
**⏰ Next Review:** 2026-02-10  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
