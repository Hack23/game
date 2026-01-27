# Copilot Instructions

This file provides guidance for GitHub Copilot coding agent when working on this repository.

## Project Overview

This is a game template built with React, TypeScript, Three.js, and Vite with a strong focus on security and code quality.

**Security & Compliance:** All security practices in this repository align with [Hack23 AB's Information Security Management System (ISMS)](https://github.com/Hack23/ISMS-PUBLIC) (2026 edition). For complete policy mapping, see [ISMS Policy Mapping](../docs/ISMS_POLICY_MAPPING.md).

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

# Run unit tests with coverage (target: 80%+)
npm run coverage

# Run E2E tests with Cypress
npm run test:e2e

# Check license compliance (MIT, Apache-2.0, BSD, ISC, CC0-1.0, Unlicense)
npm run test:licenses

# Run CI tests with JUnit output
npm run test:ci
npm run test:e2e:ci
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

- Aim for minimum 80% code coverage per [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) (2026)
- Write tests for critical business logic and security paths
- Test both success and error cases
- Test edge cases and boundary conditions
- Use descriptive test names that explain what is being tested

## Quality Checks

Before committing code changes, always run:

```bash
# Verify code quality
npm run lint

# Build project
npm run build

# Run tests
npm run test

# Check coverage
npm run coverage

# Verify license compliance
npm run test:licenses
```

All changes must pass these checks before being committed.

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

## Security & Compliance

All development follows [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC) (2026):

- **Supply Chain Security**: Verify dependencies before adding (`npm audit`, `npm run test:licenses`)
- **Secure Coding**: Follow OWASP guidelines, never commit secrets
- **Testing Requirements**: Minimum 80% coverage per [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) (2026)
- **License Compliance**: Only approved open-source licenses (MIT, Apache-2.0, BSD variants, ISC, CC0-1.0, Unlicense)
- **SBOM Quality**: Maintain SBOM quality score above 7.0/10
- **Build Security**: All GitHub Actions pinned to SHA hashes

For detailed compliance requirements, see [ISMS Policy Mapping](../docs/ISMS_POLICY_MAPPING.md).
