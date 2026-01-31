---
name: documentation-standards
description: Clear technical documentation with JSDoc, READMEs, Mermaid diagrams, ISMS policy references, and comprehensive code examples
license: MIT
---

# Documentation Standards Skill

## Context
This skill applies when:
- Writing or updating README files
- Documenting APIs, functions, or classes
- Creating architecture or design documentation
- Adding JSDoc comments to TypeScript code
- Creating diagrams for system architecture or flows
- Documenting security policies and compliance
- Writing user guides or tutorials
- Creating contribution guidelines

## Rules

1. **Document Security Context**: All security-related code must reference ISMS policies in documentation
2. **Use JSDoc for Public APIs**: All exported functions, classes, and interfaces must have JSDoc comments
3. **Include Type Information**: JSDoc comments must include `@param` and `@returns` with TypeScript types
4. **Provide Examples**: All public APIs must include code examples showing correct usage
5. **Document Exceptions**: Use `@throws` to document all possible exceptions and error conditions
6. **Use Mermaid for Diagrams**: Create flowcharts, sequence diagrams, and architecture diagrams using Mermaid
7. **Keep READMEs Current**: Update README.md when adding features, changing setup, or modifying architecture
8. **Write for Beginners**: Assume readers are unfamiliar with the codebase - explain context and rationale
9. **Link to External Docs**: Reference official documentation for frameworks, libraries, and standards
10. **Document Decisions**: Use Architecture Decision Records (ADRs) for significant technical decisions
11. **Security First**: Document threat models, security controls, and compliance requirements
12. **Show Anti-Patterns**: Include examples of incorrect usage to prevent common mistakes
13. **Maintain Changelog**: Keep CHANGELOG.md updated following Keep a Changelog format
14. **Version Documentation**: Clearly state which version of the code the documentation applies to
15. **Accessibility**: Use semantic markdown, descriptive link text, and alt text for images

## Examples

### ✅ Good Pattern: Comprehensive JSDoc

```typescript
/**
 * Authenticates a user with username and password credentials.
 * 
 * This function implements multi-factor authentication (MFA) as required by
 * Hack23 ISMS Policy AC-001 (Access Control Policy).
 * 
 * Security Controls:
 * - Password hashing with bcrypt (cost factor: 12)
 * - Account lockout after 5 failed attempts
 * - Session tokens expire after 15 minutes of inactivity
 * - Audit logging of all authentication attempts
 * 
 * Compliance: ISO 27001:2022 A.5.15, NIST CSF PR.AC-1, CIS Control 6.3
 * 
 * @param credentials - User login credentials
 * @param credentials.username - Username (alphanumeric, 3-32 chars)
 * @param credentials.password - Password (min 12 chars, complexity requirements)
 * @param options - Optional authentication options
 * @param options.rememberMe - Extend session to 7 days if true
 * @param options.mfaCode - Time-based one-time password (TOTP) for MFA
 * 
 * @returns Authentication result with JWT token
 * 
 * @throws {AuthenticationError} When credentials are invalid
 * @throws {AccountLockedError} When account is locked due to failed attempts
 * @throws {MFARequiredError} When MFA is enabled but code not provided
 * 
 * @example
 * ```typescript
 * // Basic authentication
 * const result = await authenticateUser({
 *   username: 'john.doe',
 *   password: 'MySecureP@ssw0rd!'
 * });
 * console.log('Token:', result.token);
 * 
 * // With MFA
 * const resultMFA = await authenticateUser(
 *   {
 *     username: 'admin',
 *     password: 'AdminP@ss123!'
 *   },
 *   {
 *     mfaCode: '123456'
 *   }
 * );
 * ```
 * 
 * @see {@link https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/AC-001.md | Access Control Policy}
 * @since 1.0.0
 * @public
 */
export async function authenticateUser(
  credentials: UserCredentials,
  options?: AuthOptions
): Promise<AuthResult> {
  // Implementation
}
```

### ✅ Good Pattern: README with Security Context

```markdown
# Game Template - React + TypeScript + Three.js

> Secure, high-performance 3D game template with React and Three.js

[![CI/CD](https://github.com/Hack23/game/workflows/CI/badge.svg)](https://github.com/Hack23/game/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/codecov/c/github/Hack23/game)](https://codecov.io/gh/Hack23/game)

## 🔒 Security & Compliance

This project implements security controls aligned with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC):

- **ISO 27001:2022** - Information security management
- **NIST CSF 2.0** - Cybersecurity framework
- **CIS Controls v8.1** - Security best practices
- **OWASP Top 10** - Web application security

For detailed security information, see [SECURITY.md](SECURITY.md).

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Modern browser with WebGL 2.0 support

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/Hack23/game.git
cd game

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit http://localhost:5173 to see the game.

## 📦 Available Scripts

| Script | Description | ISMS Policy |
|--------|-------------|-------------|
| `npm run dev` | Start development server | - |
| `npm run build` | Production build | SC-001 |
| `npm run preview` | Preview production build | - |
| `npm run lint` | Run ESLint | SC-002 |
| `npm run test` | Run Vitest unit tests | SC-002 |
| `npm run test:e2e` | Run Cypress E2E tests | SC-002 |
| `npm run coverage` | Generate coverage report | SC-002 |
| `npm audit` | Check dependencies for vulnerabilities | SC-003 |

## 🏗️ Architecture

\`\`\`mermaid
graph TB
    A[User Browser] --> B[React App]
    B --> C[@react-three/fiber]
    C --> D[Three.js]
    B --> E[Game State Management]
    E --> F[React Context]
    E --> G[Local Storage]
    B --> H[Security Layer]
    H --> I[Input Validation]
    H --> J[CSP Headers]
    H --> K[XSS Protection]
\`\`\`

## 🎮 Game Development

### Creating a 3D Component

\`\`\`typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  position: [number, number, number];
}

export function Player({ position }: PlayerProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#00ff00" />
    </mesh>
  );
}
\`\`\`

See [Game Development Guide](docs/GAME_DEVELOPMENT.md) for more examples.

## 🧪 Testing

We maintain 80%+ code coverage with three testing layers:

1. **Unit Tests** (Vitest) - Component and logic testing
2. **Integration Tests** (Vitest) - Multi-component interactions
3. **E2E Tests** (Cypress) - Full game flow testing

\`\`\`bash
# Run all tests with coverage
npm run coverage

# Run specific test file
npm run test -- Player.test.tsx

# Run E2E tests in interactive mode
npm run test:e2e:open
\`\`\`

## 📊 Code Quality

| Metric | Target | Current |
|--------|--------|---------|
| Code Coverage | ≥ 80% | 85% |
| TypeScript Strict | ✅ Enabled | ✅ |
| Security Headers | ✅ All | ✅ |
| Performance (FPS) | ≥ 60 | 60 |

## 🔐 Security

### Reporting Vulnerabilities

See [SECURITY.md](SECURITY.md) for vulnerability reporting process.

### Security Features

- ✅ Content Security Policy (CSP)
- ✅ HTTPS-only (HSTS)
- ✅ XSS Protection
- ✅ Input validation and sanitization
- ✅ Dependency scanning (npm audit)
- ✅ License compliance checking

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📚 Documentation

- [Game Development Guide](docs/GAME_DEVELOPMENT.md)
- [API Reference](docs/API.md)
- [Architecture Decision Records](docs/adr/)
- [Security Documentation](SECURITY.md)
```

### ✅ Good Pattern: Mermaid Diagram for Security Flow

```markdown
## Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant D as Database
    participant L as Audit Log
    
    U->>F: Enter credentials
    F->>F: Validate input format
    F->>A: POST /api/auth/login
    
    Note over A: ISMS Policy AC-001
    A->>D: Check credentials
    D-->>A: User data
    
    alt Valid Credentials
        A->>A: Generate JWT token
        A->>L: Log success
        A-->>F: {token, user}
        F-->>U: Redirect to game
    else Invalid Credentials
        A->>L: Log failure
        A->>A: Increment fail count
        alt Account Locked
            A-->>F: 423 Account Locked
            F-->>U: Show error + contact support
        else Not Locked
            A-->>F: 401 Unauthorized
            F-->>U: Show error
        end
    end
    
    Note over L: Compliance: ISO 27001 A.5.15
\`\`\`
```

### ✅ Good Pattern: Architecture Decision Record

```markdown
# ADR-001: Use @react-three/fiber for 3D Rendering

## Status
Accepted

## Context
We need to render 3D game graphics in a React application. Options considered:
1. Plain Three.js with imperative API
2. @react-three/fiber (React renderer for Three.js)
3. Babylon.js with React integration

## Decision
We will use @react-three/fiber for 3D rendering.

## Rationale

### Pros
- **Declarative**: JSX syntax matches React patterns
- **Performance**: Minimal overhead over raw Three.js
- **Ecosystem**: Rich ecosystem with @react-three/drei helpers
- **Type Safety**: Excellent TypeScript support
- **Testing**: Easier to test declarative components
- **Community**: Active community and regular updates

### Cons
- **Learning Curve**: Requires understanding both React and Three.js
- **Abstraction**: Additional layer between code and Three.js
- **Documentation**: Some Three.js patterns need translation

## Security Implications
- No additional security concerns beyond standard React/Three.js
- CSP policies apply normally to WebGL content
- ISMS Policy SC-001 (Secure Configuration) compliance maintained

## Consequences
- Developers must learn @react-three/fiber patterns
- Performance optimizations follow React patterns (memoization, refs)
- Test strategy includes React Testing Library for 3D components
- Documentation must cover both React and Three.js concepts

## References
- [@react-three/fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Documentation](https://threejs.org/docs/)
- [ISMS Policy SC-001](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/SC-001.md)

## Date
2024-01-15

## Author
Development Team
```

### ❌ Bad Pattern: Missing Context

```typescript
/**
 * Authenticates user
 * @param creds User credentials
 * @returns Auth result
 */
function auth(creds: any): any {
  // No security context, no examples, poor types
}
```

### ❌ Bad Pattern: No Examples

```typescript
/**
 * Complex game physics calculation with multiple parameters
 * and edge cases, but no examples showing how to use it.
 */
export function calculateTrajectory(
  initialVelocity: Vector3,
  angle: number,
  wind: Vector3,
  gravity: number,
  dragCoefficient: number
): TrajectoryResult {
  // Complex implementation without usage examples
}
```

### ❌ Bad Pattern: Outdated README

```markdown
# Game Template

Run `npm start` to start. <!-- Wrong command! -->

## Features
- User authentication <!-- Not implemented yet -->
- Multiplayer support <!-- Removed 6 months ago -->
```

### ❌ Bad Pattern: No Security Documentation

```typescript
// Bad: Security-critical code without ISMS reference
export function encryptData(data: string): string {
  // Uses AES-256, but no documentation about why,
  // which ISMS policy it implements, or compliance mapping
  return encrypt(data);
}
```

## References

### Documentation Standards
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Write the Docs](https://www.writethedocs.org/)
- [JSDoc](https://jsdoc.app/)
- [TypeDoc](https://typedoc.org/)

### Diagram Tools
- [Mermaid](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/)
- [Mermaid in GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/)

### Markdown
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Keep a Changelog](https://keepachangelog.com/)

### Architecture
- [Architecture Decision Records (ADR)](https://adr.github.io/)
- [C4 Model](https://c4model.com/)

## Remember

- **Security Context**: Always reference ISMS policies in security-related documentation
- **Code Examples**: Every public API needs working code examples
- **Keep Current**: Documentation should be updated with code changes
- **Mermaid Diagrams**: Use Mermaid for visual documentation - it's version-controlled and maintainable
- **JSDoc Everything**: All exported functions, classes, and interfaces need JSDoc
- **Write for Beginners**: Assume readers are new to the codebase
- **Link to Policies**: Reference external ISMS policies and compliance frameworks
- **Show Anti-Patterns**: Document what NOT to do to prevent mistakes
- **Accessibility**: Use semantic markdown and descriptive text
- **ADRs for Decisions**: Document significant architectural decisions
- **Changelog**: Maintain CHANGELOG.md following Keep a Changelog format
- **Version Docs**: Clearly state which version documentation applies to
- **Examples Over Words**: Show don't tell - code examples are more valuable than prose
- **Test Documentation**: Verify code examples actually work
- **CI/CD Integration**: Consider automated documentation generation and validation
