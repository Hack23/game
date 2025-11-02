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

Enables searching documentation for React, TypeScript, PixiJS, and Vite.

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
- pixijs.io - PixiJS website
- pixijs.download - PixiJS API docs
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

1. Open the repository in Codespaces
2. MCP servers are automatically configured
3. Use Copilot Chat to interact with them
4. Example: "Use the filesystem server to find all React components"

### In VS Code

1. Install GitHub Copilot extension
2. MCP servers load automatically from `.github/mcp-config.json`
3. Use Copilot Chat with enhanced context
4. Example: "Search documentation for PixiJS sprite anchors"

### With Copilot CLI

1. Install GitHub CLI: `gh extension install github/gh-copilot`
2. Configure MCP servers in your environment
3. Use: `gh copilot suggest "create a new game component"`

## Configuration Files

### `.github/copilot-setup-steps.yml`

Defines the setup process that runs before Copilot agent starts working:

- System dependencies installation
- Node.js project setup
- MCP server configuration
- Environment variables
- Validation steps

### `.github/mcp-config.json`

Standard MCP configuration file that defines available servers:

- Server commands
- Environment variables
- Enabled/disabled state
- Descriptions

### `.github/copilot-instructions.md`

Provides coding guidelines and project context to Copilot:

- TypeScript strict mode usage
- React and PixiJS patterns
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

### PixiJS Game Development
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

1. Check if the server is enabled in `.github/mcp-config.json`
2. Verify environment variables are set
3. Ensure npm can access the package
4. Restart VS Code or Codespace

### Performance Issues

1. Disable unused MCP servers
2. Limit filesystem server to specific directories
3. Use caching where available
4. Monitor resource usage

### Connection Errors

1. Check network connectivity
2. Verify API keys are valid
3. Check firewall settings
4. Review server logs

## Testing the Configuration

### Manual Validation

Run the setup workflow:
```bash
# Trigger the workflow manually from GitHub Actions UI
# Or use GitHub CLI:
gh workflow run copilot-setup.yml
```

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

## Further Reading

- [MCP Specification](https://github.com/modelcontextprotocol/specification)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot)

## Contributing

To add new MCP servers:

1. Research available MCP servers for your use case
2. Add configuration to `.github/mcp-config.json`
3. Document the server in this guide
4. Update `.github/copilot-setup-steps.yml` if needed
5. Test the configuration
6. Submit a pull request

## Support

For issues with MCP servers:
- Check the [MCP repository](https://github.com/modelcontextprotocol)
- Review [Copilot documentation](https://docs.github.com/en/copilot)
- Open an issue in this repository
