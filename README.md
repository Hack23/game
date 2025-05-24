# Game Template

A clean, minimal template for building games with React, TypeScript, and Vite - built with **security-first principles**.

## Badges

[![License](https://img.shields.io/github/license/Hack23/game.svg)](https://github.com/Hack23/game/raw/master/LICENSE.md)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/Hack23/game/badge)](https://scorecard.dev/viewer/?uri=github.com/Hack23/game)

## 🔒 Security Features

This template implements comprehensive security measures:

- **🛡️ Supply Chain Security** - OSSF Scorecard analysis and dependency review
- **🔍 Static Analysis** - CodeQL scanning for vulnerabilities
- **📦 Dependency Protection** - Automated dependency vulnerability checks
- **🔐 Runner Hardening** - All CI/CD runners are hardened with audit logging
- **📋 Security Policies** - GitHub security advisories and vulnerability reporting
- **🏷️ Pinned Dependencies** - All GitHub Actions pinned to specific SHA hashes

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Modern React with hooks
- 🔷 **TypeScript** - Strict typing with latest standards
- 🧪 **Vitest** - Fast unit testing with coverage
- 🌲 **Cypress** - Reliable E2E testing
- 📦 **ESLint** - Code linting with TypeScript rules
- 🔄 **GitHub Actions** - Automated testing and reporting
- 🎮 **PixiJS 8.x** - High-performance WebGL renderer for 2D games
- 🎵 **Howler.js** - Audio library for games

## Development Environment

This template includes a fully configured development environment:

- **🚀 GitHub Codespaces** - Zero-configuration development environment
- **🤖 GitHub Copilot** - AI-assisted development with code suggestions
- **💬 Copilot Chat** - In-editor AI assistance for debugging and explanations
- **🔧 VS Code Extensions** - Pre-configured extensions for game development
- **🔒 Secure Container** - Hardened development container with security features

### 🚀 Codespaces Setup

This repository is fully configured for GitHub Codespaces, providing:

- **One-click setup** - Start coding immediately with zero configuration
- **Pre-installed dependencies** - All tools and libraries ready to use
- **Configured test environment** - Cypress and Vitest ready to run
- **GitHub Copilot integration** - AI-powered code assistance
- **Optimized performance** - Container configured for game development

```mermaid
graph LR
    A[Developer] -->|Opens in Codespace| B[Container Setup]
    B -->|Auto-configures| C[Development Environment]
    C -->|Provides| D[VS Code + Extensions]
    C -->|Initializes| E[Node.js Environment]
    C -->|Configures| F[Testing Tools]
    
    D -->|Includes| G[GitHub Copilot]
    D -->|Includes| H[ESLint Integration]
    D -->|Includes| I[Debug Tools]
    
    E -->|Installs| J[PixiJS 8.x]
    E -->|Installs| K[React 19]
    E -->|Installs| L[TypeScript]
    
    F -->|Prepares| M[Cypress E2E]
    F -->|Prepares| N[Vitest Unit Tests]
    
    G -->|Assists with| O[Game Logic]
    G -->|Suggests| P[Game Components]
    
    classDef primary fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000
    classDef tools fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef testing fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    
    class A,B,C primary
    class D,E,F tools
    class G,O,P ai
    class M,N testing
    class J,K,L tools
    class H,I tools
```

## Security Workflows

```mermaid
graph TD
    A[🔒 Code Push/PR] --> B{🛡️ Security Gates}

    B --> |🔍 Code Analysis| C[CodeQL Scanning]
    B --> |📦 Dependencies| D[Dependency Review]
    B --> |🏗️ Supply Chain| E[OSSF Scorecard]

    C --> |🚨 Vulnerabilities| F[Security Alerts]
    D --> |⚠️ Known CVEs| F
    E --> |📊 Security Score| G[Security Dashboard]

    F --> H[🚫 Block Merge]
    G --> I[✅ Security Badge]

    subgraph "🔐 Protection Layers"
        J[Runner Hardening]
        K[Pinned Actions]
        L[Audit Logging]
    end

    %% Styling
    classDef security fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000
    classDef analysis fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef protection fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000
    classDef alert fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#000

    class A,B,H security
    class C,D,E analysis
    class J,K,L protection
    class F,G,I alert
```

## Test & Report Workflow

```mermaid
graph TD
    A[🚀 Code Push/PR] --> B{🔍 Prepare Environment}

    B --> |✅ Dependencies| C[🏗️ Build Validation]
    B --> |✅ Cypress Cache| D[🧪 Unit Tests]
    B --> |✅ Display Setup| E[🌐 E2E Tests]

    C --> |✅ Build Success| F{📊 Parallel Testing}

    F --> D
    F --> E

    D --> |📈 Coverage Report| G[📋 Test Reports]
    E --> |🎬 Videos & Screenshots| G

    G --> H[📤 Artifact Upload]
    H --> I[✨ Combined Reports]

    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef test fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef report fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef artifact fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000

    class A,I startEnd
    class B,C,F process
    class D,E test
    class G,H report
    class H artifact
```

## Quick Start

```bash
# Using GitHub Codespaces
# Click "Code" button on repository and select "Open with Codespaces"

# Or local development:
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## PixiJS 8.x Integration

This template uses PixiJS 8.x for high-performance 2D game rendering:

- Modern WebGL-based rendering
- Optimized sprite batching
- Integrated with React via @pixi/react
- Sound support via @pixi/sound and Howler.js
- Responsive game canvas
- Touch and mouse input handling

Example game component:

```tsx
import { Stage, Sprite, useTick } from '@pixi/react';
import { useState } from 'react';

export function Game() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  
  useTick((delta) => {
    // Game logic here
    setPosition(prev => ({
      x: prev.x + delta,
      y: prev.y
    }));
  });
  
  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0x1d2230 }}>
      <Sprite 
        image="/assets/character.png" 
        x={position.x} 
        y={position.y} 
        anchor={{ x: 0.5, y: 0.5 }}
      />
    </Stage>
  );
}
```

## Testing

### Unit Tests

- Uses Vitest with jsdom environment
- Configured for React Testing Library
- Coverage reports generated automatically
- Run with: `npm run test`

### E2E Tests

- Uses Cypress for end-to-end testing
- Starts dev server automatically
- Screenshots and videos on failure
- Run with: `npm run test:e2e`

### CI/CD Pipeline

```mermaid
flowchart LR
    subgraph "🔧 CI Pipeline"
        A1[📝 Code Changes] --> A2[🔍 Lint & Type Check]
        A2 --> A3[🏗️ Build]
        A3 --> A4[🧪 Test]
        A4 --> A5[📊 Report]
    end

    subgraph "🔒 Security Pipeline"
        S1[🛡️ CodeQL Analysis]
        S2[📦 Dependency Review]
        S3[🏆 OSSF Scorecard]
        S4[🔐 Runner Hardening]
    end

    subgraph "📈 Test Coverage"
        B1[Unit Tests<br/>80%+ Coverage]
        B2[E2E Tests<br/>Critical Flows]
        B3[Type Safety<br/>Strict Mode]
    end

    subgraph "🎯 Outputs"
        C1[📄 Coverage Reports]
        C2[🎬 Test Videos]
        C3[📸 Screenshots]
        C4[📋 JUnit XML]
        C5[🛡️ Security Reports]
    end

    A4 --> B1
    A4 --> B2
    A4 --> B3

    A1 --> S1
    A1 --> S2
    A1 --> S3
    A1 --> S4

    A5 --> C1
    A5 --> C2
    A5 --> C3
    A5 --> C4
    S1 --> C5
    S2 --> C5
    S3 --> C5

    %% Styling
    classDef pipeline fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef security fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef testing fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef output fill:#fff8e1,stroke:#f57c00,stroke-width:2px

    class A1,A2,A3,A4,A5 pipeline
    class S1,S2,S3,S4 security
    class B1,B2,B3 testing
    class C1,C2,C3,C4,C5 output
```

### Security Workflows

- **CodeQL Analysis**: Automated vulnerability scanning on push/PR
- **Dependency Review**: Checks for known vulnerabilities in dependencies
- **OSSF Scorecard**: Supply chain security assessment with public scoring
- **Runner Hardening**: All CI/CD runners use hardened security policies

## Possible Future Project Structure

```
src/
├── test/           # Test setup and utilities
├── App.tsx         # Main application component
├── App.test.tsx    # Unit tests for App
├── main.tsx        # Application entry point
├── components/     # Game components
│   ├── Game.tsx    # Main game component with PixiJS Stage
│   └── UI/         # Game UI components
├── hooks/          # Custom React hooks
├── assets/         # Game assets (sprites, sounds)
└── index.css       # Global styles

cypress/
├── e2e/           # End-to-end test specs
└── support/       # Cypress support files

.devcontainer/     # GitHub Codespaces configuration
├── devcontainer.json  # Development container config
└── init-xvfb.sh      # Display server for Cypress

.github/
├── workflows/     # GitHub Actions workflows
│   ├── test-and-report.yml    # Main CI/CD pipeline
│   ├── codeql.yml            # Security code analysis
│   ├── dependency-review.yml  # Dependency vulnerability checks
│   └── scorecards.yml        # Supply chain security assessment
└── SECURITY.md    # Security policy and reporting
```

## Development Guidelines

- **Strict TypeScript** - Enable all strict options
- **Test Coverage** - Aim for 80%+ coverage
- **Component Testing** - Test critical user flows
- **Type Safety** - Avoid `any`, use explicit types
- **Security First** - All dependencies reviewed for vulnerabilities
- **Pinned Actions** - GitHub Actions pinned to specific SHA hashes
- **AI-Assisted** - Leverage GitHub Copilot for code generation and debugging

## Building Your Game

This template provides a **secure foundation** for game development:

1. Replace the counter example with your game logic
2. Add game-specific components in `src/components/`
3. Create game state management (Context API, Zustand, etc.)
4. Add unit tests for game logic
5. Create E2E tests for game flows
6. Deploy using the included **security-hardened** GitHub Actions

All security workflows will automatically protect your game from common vulnerabilities and supply chain attacks.

Happy gaming! 🎮🔒
