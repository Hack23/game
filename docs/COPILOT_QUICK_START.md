# GitHub Copilot Quick Start Guide

This guide helps you get started with GitHub Copilot in this repository, leveraging the configured MCP (Model Context Protocol) servers for enhanced AI assistance.

## 🚀 Quick Setup

### Option 1: GitHub Codespaces (Recommended)

1. Click the **Code** button on the repository
2. Select **Codespaces** tab
3. Click **Create codespace on main**
4. Wait for automatic setup (2-3 minutes)
5. Start coding with Copilot!

**Benefits:**
- ✅ Zero configuration required
- ✅ All MCP servers pre-configured
- ✅ Copilot extensions pre-installed
- ✅ Development environment ready to use

### Option 2: Local Development with VS Code

1. Clone the repository:
   ```bash
   git clone https://github.com/Hack23/game.git
   cd game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Open in VS Code:
   ```bash
   code .
   ```

4. Install GitHub Copilot extension from VS Code Marketplace

5. MCP servers will be automatically loaded from `.github/mcp-config.json`

## 💬 Using Copilot Chat

### Basic Commands

**Ask questions about the codebase:**
```
What does the Game component do?
```

**Get code suggestions:**
```
Create a new Three.js sprite component for a player character
```

**Debug issues:**
```
Why is this TypeScript error occurring?
```

**Generate tests:**
```
Write unit tests for the Player component
```

### MCP-Enhanced Commands

With MCP servers, Copilot has enhanced capabilities:

**File System Access:**
```
Find all React components in the src directory
Show me the structure of the components folder
```

**GitHub Integration:**
```
What are the recent issues in this repository?
Show me the latest pull requests
```

**Git History:**
```
What changes were made to this file recently?
Show me the commit history for this component
```

**Documentation Search (if Brave API key configured):**
```
Search for Three.js sprite anchor documentation
Find React 19 best practices for hooks
```

## 🎮 Game Development with Copilot

### Creating New Game Components

1. Open Copilot Chat
2. Ask: "Create a new Three.js sprite component following the project guidelines"
3. Review the generated code
4. Accept and customize as needed

### Adding Game Logic

1. Describe your game mechanic
2. Example: "Add collision detection between player and enemies"
3. Copilot will suggest implementation using Three.js patterns

### Writing Tests

1. Open a component file
2. Ask: "Generate Vitest unit tests for this component"
3. Copilot will create tests following project conventions

## 📝 Copilot Best Practices

### Be Specific

❌ Bad: "Make a component"
✅ Good: "Create a TypeScript React component for a Three.js sprite with position state"

### Provide Context

❌ Bad: "Fix this"
✅ Good: "This TypeScript error occurs because the texture type is not defined. How do I properly type a Three.js texture?"

### Reference Project Guidelines

✅ "Following the strict TypeScript rules in copilot-instructions.md, create a game component"

### Use Inline Suggestions

1. Start typing code
2. Wait for Copilot suggestions (gray text)
3. Press **Tab** to accept
4. Press **Esc** to dismiss

## 🔍 MCP Server Capabilities

### Filesystem Server
- Read and write project files
- List directory contents
- Search for files
- Understand project structure

### GitHub Server
- Access repository metadata
- Read issues and PRs
- View workflow status
- Search code

### Git Server
- View commit history
- Understand code changes
- Track file evolution
- Analyze branches

### Memory Server
- Remember conversation context
- Track your preferences
- Maintain session history
- Improve suggestions over time

### Playwright Server
- Automate browser testing
- Debug UI components
- Take screenshots
- Test interactions

## ⚙️ Configuration Files

### `.github/copilot-instructions.md`
- Coding guidelines for this project
- TypeScript strict mode rules
- Three.js patterns
- Testing requirements

### `.github/copilot-setup-steps.yml`
- Pre-installation steps
- MCP server configuration
- Environment setup
- Validation checks

### `.github/mcp-config.json`
- MCP server definitions
- Command configurations
- Environment variables
- Enable/disable settings

## 🛠️ Troubleshooting

### Copilot Not Working

1. Check Copilot is enabled in VS Code settings
2. Verify you're signed in to GitHub
3. Reload VS Code window
4. Check Copilot status bar icon

### MCP Servers Not Loading

1. Verify `.github/mcp-config.json` exists
2. Check environment variables are set
3. Restart VS Code or Codespace
4. Review VS Code output panel for errors

### Suggestions Not Relevant

1. Be more specific in your prompts
2. Reference project guidelines
3. Provide more context
4. Try rephrasing your question

### Performance Issues

1. Disable unused MCP servers in `.github/mcp-config.json`
2. Close unnecessary files
3. Restart VS Code
4. Check system resources

## 📚 Learning Resources

### Project Documentation
- [MCP Configuration Guide](MCP_CONFIGURATION.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [README](../README.md)
- [Security Policy](../SECURITY.md)
- [ISMS Policy Mapping](ISMS_POLICY_MAPPING.md)

### Security & Compliance
This project follows [Hack23 AB's Information Security Management System (ISMS)](https://github.com/Hack23/ISMS-PUBLIC):
- 🔐 [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- 🛠️ [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - SDLC and testing requirements
- 📦 [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) - Supply chain security

For security questions, use the **🔒 security-specialist** agent.

### External Resources
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [MCP Specification](https://github.com/modelcontextprotocol/specification)
- [Three.js Documentation](https://pixijs.download/release/docs/index.html)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Example Workflows

### Building a New Game Feature

1. **Plan**: Ask Copilot to help design the feature
   ```
   Help me design a scoring system for the game
   ```

2. **Implement**: Generate the component
   ```
   Create a ScoreDisplay component using Three.js Text
   ```

3. **Test**: Generate unit tests
   ```
   Write Vitest tests for the ScoreDisplay component
   ```

4. **Document**: Add JSDoc comments
   ```
   Add TypeScript JSDoc documentation to this component
   ```

### Debugging Issues

1. **Identify**: Describe the problem
   ```
   The sprite is not rendering at the correct position
   ```

2. **Analyze**: Get suggestions
   ```
   What could cause incorrect sprite positioning in Three.js?
   ```

3. **Fix**: Implement the solution
   ```
   Update the sprite position calculation to account for anchor points
   ```

4. **Verify**: Generate test cases
   ```
   Create tests to verify sprite positioning
   ```

### Refactoring Code

1. **Review**: Understand current code
   ```
   Explain how this component works
   ```

2. **Improve**: Get refactoring suggestions
   ```
   How can I improve this code following TypeScript best practices?
   ```

3. **Refactor**: Apply changes
   ```
   Refactor this to use React hooks instead of class components
   ```

4. **Test**: Ensure functionality
   ```
   Generate regression tests for this refactored component
   ```

## 🤝 Contributing

When contributing code with Copilot:

1. Follow project guidelines in `.github/copilot-instructions.md`
2. Ensure TypeScript strict mode compliance
3. Add tests for new features
4. Run `npm run lint` and `npm run test`
5. Review Copilot suggestions before accepting

## 📞 Support

For help with Copilot or MCP servers:
- Review [MCP Configuration Guide](MCP_CONFIGURATION.md)
- Check [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- Open an issue in this repository

Happy coding with Copilot! 🚀
