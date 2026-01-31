# Copilot Instructions

This file provides guidance for GitHub Copilot coding agent when working on this repository.

## 📋 Required Context Files

**ALWAYS read these files at the start of your session:**
- `.github/workflows/copilot-setup-steps.yml` - Environment setup and permissions
- `.github/copilot-mcp.json` - MCP server configuration and available tools
- `README.md` - Repository overview and project context
- `.github/agents/README.md` - Available custom agents
- `.github/skills/README.md` - Agent skills catalog

## 🎯 Agent Skills Catalog

This repository includes 6 comprehensive skills that provide reusable patterns:
- **security-by-design** - Defense-in-depth, OWASP, secure coding
- **isms-compliance** - ISO 27001, NIST CSF 2.0, CIS Controls alignment
- **react-threejs-game** - Three.js patterns, 60fps optimization
- **testing-strategy** - 80%+ coverage, deterministic tests
- **documentation-standards** - JSDoc, Mermaid, ISMS documentation
- **performance-optimization** - React/Three.js performance

Reference these skills when working on related tasks.

## Project Overview

This is a game template built with React, TypeScript, Three.js, and Vite with a strong focus on security and code quality.

**Security & Compliance:** All security practices in this repository align with [Hack23 AB's Information Security Management System (ISMS)](https://github.com/Hack23/ISMS-PUBLIC). For complete policy mapping, see [ISMS Policy Mapping](../docs/ISMS_POLICY_MAPPING.md).

## Development Workflow

### Setup and Installation

```bash
# Install dependencies
npm install

# Start development server (opens in browser at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality and Testing

```bash
# Run linter
npm run lint

# Run unit tests with Vitest
npm run test

# Run unit tests with coverage
npm run coverage

# Run E2E tests with Cypress
npm run test:e2e

# Check license compliance (using license-compliance tool)
npm run test:licenses
```

### Testing Approach

- **Unit Tests**: Use Vitest with jsdom for React components and game logic
- **E2E Tests**: Use Cypress for end-to-end testing of game flows
- **Coverage Target**: Minimum 80% code coverage
- **Test Location**: Unit tests in `src/` with `.test.tsx` or `.test.ts` extension, E2E tests in `cypress/`

## Coding Guidelines

### Strict Typing

- **Use explicit types and interfaces**: Avoid `any` (use `unknown` if needed)
- **Leverage utility types**: Use `Pick`, `Omit`, `Partial` and always define return types
- **TypeScript strict mode enabled**: `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess` are all enabled
- **Type all function parameters and returns**: Never rely on implicit types

### Code Organization

- **Components**: Place React components in `src/` or appropriate subdirectories
- **Assets**: Store game assets (images, sounds) in `public/assets/`
- **Types**: Define custom types in `src/types/`
- **Tests**: Colocate unit tests with source files using `.test.tsx` or `.test.ts` extension

### Code Quality

- **No unused variables**: Code must not have unused locals or parameters
- **No implicit returns**: Always explicitly return values
- **Exhaustive switch cases**: Handle all cases in switch statements
- **Safe array access**: Handle potential undefined values from array/object access

## Testing Guidelines

### Vite & Vitest Integration

- Use Vitest for fast feedback and native ESM support
- Separate unit and integration tests
- Leverage Vite's watch mode and coverage tools
- Mock external dependencies using existing helpers with proper TypeScript typings
- Use React Testing Library for component testing
- Configure jsdom environment for DOM testing

### Quality Standards

- Aim for minimum 80% code coverage
- Write tests for critical business logic and security paths
- Test both success and error cases
- Test edge cases and boundary conditions
- Use descriptive test names that explain what is being tested

### Test Structure

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("ComponentName", () => {
  it("should render correctly", () => {
    // Arrange
    const props = { /* test props */ };
    
    // Act
    render(<ComponentName {...props} />);
    
    // Assert
    expect(screen.getByText("expected text")).toBeInTheDocument();
  });
});
```

## Three.js with React Guidelines

### Core Principles

- **Leverage `@react-three/fiber`**: Use declarative React components for Three.js scenes
- **Use `@react-three/drei` helpers**: Pre-built components for common 3D game needs
- **Documentation**: 
  - `@react-three/fiber`: https://docs.pmnd.rs/react-three-fiber/
  - Three.js Core API: https://threejs.org/docs/
  - `@react-three/drei`: https://github.com/pmndrs/drei

### Component Architecture

- **Declarative 3D Scene**: Build 3D scenes using JSX-like syntax
  ```typescript
  import { Canvas } from "@react-three/fiber";
  import { OrbitControls } from "@react-three/drei";
  
  function Scene() {
    return (
      <Canvas>
        <ambientLight intensity={0.5} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
    );
  }
  ```

- **Component-Based Structure**: Build reusable React components for game objects
- **State Management**: Use React hooks (`useState`, `useReducer`) for game state
- **Refs for Three.js objects**: Use `useRef` to access underlying Three.js objects

### Game Loop and Updates

- **Use `useFrame` hook**: For frame-by-frame logic (animations, physics)
  ```typescript
  import { useFrame } from "@react-three/fiber";
  
  function RotatingBox() {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta;
      }
    });
    
    return (
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    );
  }
  ```
- **State Management**: Use React state (`useState`, `useContext`) or external libraries (Zustand, Redux) for complex state
- **Re-render Triggers**: State updates trigger React re-renders, not Three.js re-renders (for performance)

### Event Handling

- **Use event props**: `onClick`, `onPointerDown`, `onPointerOver`, etc.
- **Automatic interactivity**: All meshes are interactive by default
  ```typescript
  <mesh 
    onClick={(e) => console.log('clicked', e)}
    onPointerOver={(e) => setHovered(true)}
    onPointerOut={(e) => setHovered(false)}
  >
    <sphereGeometry />
    <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
  </mesh>
  ```

### Strict Typing with Three.js

- **Type Three.js objects**: Use types from `three` and `@react-three/fiber`
- **Type refs explicitly**: 
  ```typescript
  import * as THREE from "three";
  
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  ```
- **Define component prop interfaces**: Always create interfaces for component props

### Example: Simple Player Component

```tsx
import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlayerProps {
  initialPosition: [number, number, number];
  color: string;
}

export function Player({
  initialPosition,
  color,
}: PlayerProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    // Example: bob up and down
    if (meshRef.current) {
      meshRef.current.position.y = 
        initialPosition[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  const handleClick = useCallback(() => {
    console.log("Player clicked!");
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
```

### Common Patterns

- **Lighting**: Always add lights to see your meshes
  ```typescript
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <directionalLight position={[0, 10, 5]} intensity={1} />
  ```

- **Camera Controls**: Use OrbitControls for interactive camera
  ```typescript
  import { OrbitControls } from "@react-three/drei";
  
  <OrbitControls 
    enablePan={false}
    minDistance={3}
    maxDistance={15}
  />
  ```

- **HTML Overlays**: Render HTML on top of 3D scenes
  ```typescript
  import { Html } from "@react-three/drei";
  
  <Html position={[0, 1, 0]} center>
    <div style={{ color: 'white' }}>Score: {score}</div>
  </Html>
  ```

- **Textures and Materials**: Use proper material types
  ```typescript
  // Standard material (requires lighting)
  <meshStandardMaterial color="#ff0000" metalness={0.5} roughness={0.5} />
  
  // Basic material (no lighting needed)
  <meshBasicMaterial color="#ff0000" />
  
  // With texture
  import { useTexture } from "@react-three/drei";
  const texture = useTexture('/path/to/texture.png');
  <meshStandardMaterial map={texture} />
  ```

### Performance Tips

- **Minimize state updates**: Avoid unnecessary re-renders by using `useFrame` for animations
- **Use instancing**: For many similar objects, use `InstancedMesh`
- **Optimize geometry**: Use lower polygon counts for better performance
- **Dispose resources**: Clean up geometries, materials, and textures when components unmount

## 🔒 Strict Rules for Development

### ALWAYS Do

1. **ALWAYS** use TypeScript strict mode with explicit types (never use `any`)
2. **ALWAYS** run `npm run lint` before committing code
3. **ALWAYS** run `npm run test` before committing code
4. **ALWAYS** aim for 80%+ test coverage (95% for security-critical code)
5. **ALWAYS** validate user input and sanitize output
6. **ALWAYS** reference ISMS policies for security-related code
7. **ALWAYS** use existing patterns from the codebase (check similar files first)
8. **ALWAYS** dispose Three.js resources in cleanup functions
9. **ALWAYS** target 60fps performance for game code
10. **ALWAYS** use `useFrame` with delta time for animations

### NEVER Do

1. **NEVER** commit secrets, API keys, or credentials
2. **NEVER** create new markdown files unless explicitly asked
3. **NEVER** use `any` type in TypeScript (use `unknown` if needed)
4. **NEVER** skip running linter and tests before committing
5. **NEVER** update state inside `useFrame` (causes performance issues)
6. **NEVER** add dependencies without checking `npm audit` and `npm run test:licenses`
7. **NEVER** expose stack traces or internal errors to users
8. **NEVER** trust user input without validation
9. **NEVER** use GPL or AGPL licensed dependencies
10. **NEVER** commit without verifying the changes are minimal and focused

### Pre-Commit Validation Checklist

Before committing any code, verify:

- [ ] Code passes `npm run lint` with no errors
- [ ] All tests pass with `npm run test`
- [ ] Test coverage is 80%+ for new code
- [ ] No `any` types in TypeScript
- [ ] No secrets or credentials in code
- [ ] Changes are minimal and focused on the task
- [ ] Documentation is updated if public APIs changed
- [ ] ISMS policies are referenced for security changes
- [ ] Performance is acceptable (60fps for game code)
- [ ] All Three.js resources are disposed properly

### Decision Framework: Ask vs Complete

**Complete without asking when:**
- The pattern exists in the codebase (follow existing examples)
- The requirements are clear and unambiguous
- The change is small and focused
- Standard practices apply (linting, testing, typing)
- Security patterns are well-established

**Ask before proceeding when:**
- Multiple valid approaches exist with significant tradeoffs
- Security implications are unclear
- Breaking changes to public APIs
- New external dependencies are needed
- Architecture changes are required

## 🎨 Code Style Patterns

### Component Structure (React)
```typescript
// ALWAYS: Use this structure
interface ComponentProps {
  // Props with explicit types
  value: string;
  onChange: (value: string) => void;
}

export function Component({ value, onChange }: ComponentProps): JSX.Element {
  // Hooks first
  const [state, setState] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  
  // Callbacks with useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  // Effects
  useEffect(() => {
    // Cleanup if needed
    return () => {};
  }, []);
  
  // Render
  return <div ref={ref}>Content</div>;
}
```

### Three.js Game Objects
```typescript
// ALWAYS: Use this pattern for game objects
interface GameObjectProps {
  position: [number, number, number];
  onInteract?: () => void;
}

export function GameObject({ position, onInteract }: GameObjectProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation with delta time
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Use delta for frame-rate independent animation
      meshRef.current.rotation.y += delta;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} onClick={onInteract}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Test Structure
```typescript
// ALWAYS: Use this test pattern
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('ComponentName', () => {
  it('should render with correct props', () => {
    // Arrange
    const props = { value: 'test' };
    
    // Act
    render(<ComponentName {...props} />);
    
    // Assert
    expect(screen.getByText('test')).toBeInTheDocument();
  });
  
  it('should handle interactions', async () => {
    // Test user interactions
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

## 🔍 Codebase Patterns to Follow

### File Organization
- React components: `src/components/ComponentName.tsx`
- Hooks: `src/hooks/useHookName.ts`
- Types: `src/types/TypeName.ts`
- Tests: Colocated with source files (`ComponentName.test.tsx`)
- Game objects: `src/game/objects/ObjectName.tsx`

### Naming Conventions
- Components: PascalCase (`PlayerCharacter`)
- Hooks: camelCase with `use` prefix (`useAudioManager`)
- Types/Interfaces: PascalCase (`PlayerProps`, `GameState`)
- Constants: UPPER_SNAKE_CASE (`MAX_HEALTH`)
- Functions: camelCase (`handleClick`, `updatePosition`)

### Import Order
```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

// 2. Internal components
import { Player } from '@/components/Player';

// 3. Hooks
import { useAudioManager } from '@/hooks/useAudioManager';

// 4. Types
import type { GameState } from '@/types/GameState';

// 5. Styles (if any)
import './Component.css';
```

## 🎯 Remember

- **Ask less, complete more** - Follow existing patterns in the codebase
- **Security first** - Apply security-by-design principles from skills catalog
- **Performance matters** - Target 60fps for game code, minimize re-renders
- **Test thoroughly** - 80%+ coverage, test edge cases
- **Document clearly** - JSDoc for complex functions, update README when needed
- **Check before commit** - Run linter and tests, verify changes are minimal
- **Reference skills** - Use the skills catalog for guidance on patterns and best practices
