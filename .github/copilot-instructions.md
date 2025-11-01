# Copilot Instructions

This file provides guidance for GitHub Copilot coding agent when working on this repository.

## Project Overview

This is a game template built with React, TypeScript, PixiJS, and Vite with a strong focus on security and code quality.

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

# Check license compliance
npm run test:licenses
```

### Testing Approach

- **Unit Tests**: Use Vitest with jsdom for React components and game logic
- **E2E Tests**: Use Cypress for end-to-end testing of game flows
- **Coverage Target**: Minimum 80% code coverage
- **Test Location**: Unit tests in `src/` with `.test.tsx` extension, E2E tests in `cypress/`

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
- **Tests**: Colocate unit tests with source files using `.test.tsx` extension

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

## PixiJS with React Guidelines

### Core Principles

- **Leverage `@pixi/react` Components**: Use declarative components like `Stage`, `Container`, `Sprite`, `Graphics`, `Text`
- **Documentation**: 
  - `@pixi/react`: https://react.pixijs.io/getting-started/
  - PixiJS Core API: https://pixijs.download/release/docs/index.html

### Component Architecture

- **Extend PixiJS Objects**: Use `extend()` function to make PixiJS display objects available as React components
  ```typescript
  import { extend } from "@pixi/react";
  import { Graphics, Sprite } from "pixi.js";
  extend({ Graphics, Sprite });
  ```

- **Component-Based Structure**: Build reusable React components for game elements
- **State Management**: Use React hooks (`useState`, `useReducer`) within components
- **Drawing Logic**: Encapsulate PixiJS drawing in components, use `useCallback` for draw functions

### Game Loop and Updates

- **Use `useTick` hook**: For frame-by-frame logic (animations, physics)
  ```typescript
  useTick((delta: number) => {
    // Update game state each frame
  });
  ```
- **State Management**: Use React state (`useState`, `useContext`) or external libraries (Zustand, Redux) for complex state
- **Re-render Triggers**: Ensure state updates correctly trigger re-renders of PixiJS components

### Event Handling

- **Use event props**: `onClick`, `onPointerDown`, etc., similar to DOM events
- **Enable interactivity**: Set `interactive={true}` on components that need pointer events
  ```typescript
  <Sprite 
    interactive={true}
    cursor="pointer"
    onPointerDown={handleClick}
  />
  ```

### Strict Typing with PixiJS

- **Type PixiJS objects**: Use types from `pixi.js` and `@pixi/react`
- **Type callbacks explicitly**: 
  ```typescript
  draw={(g: PIXI.Graphics) => {
    g.beginFill(0xff0000);
    g.drawRect(0, 0, 100, 100);
    g.endFill();
  }}
  ```
- **Define component prop interfaces**: Always create interfaces for component props

### Example: Simple Player Component

```tsx
import { Sprite, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useState, useCallback } from "react";

interface PlayerProps {
  initialX: number;
  initialY: number;
  texture: Texture;
}

export function Player({
  initialX,
  initialY,
  texture,
}: PlayerProps): JSX.Element {
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  useTick((delta: number) => {
    // Example movement logic
    // setPosition(prev => ({ x: prev.x + 1 * delta, y: prev.y }));
  });

  const handleClick = useCallback(() => {
    console.log("Player clicked!");
    // Update state or trigger game logic
  }, []);

  return (
    <Sprite
      texture={texture}
      x={position.x}
      y={position.y}
      anchor={0.5}
      interactive={true}
      cursor="pointer"
      onPointerDown={handleClick}
    />
  );
}
```

## Security and Compliance

### Security Best Practices

- **Never commit secrets**: Use environment variables for sensitive data
- **Validate input**: Always validate and sanitize user input
- **Handle errors safely**: Don't expose sensitive information in error messages
- **Dependencies**: Only use approved licenses (MIT, Apache-2.0, BSD, ISC, CC0-1.0, Unlicense)
- **Security scanning**: CodeQL and dependency scanning run automatically on PRs

### License Compliance

- Run `npm run test:licenses` to verify all dependencies comply with approved licenses
- New dependencies must use one of the approved open-source licenses
- The build will fail if non-compliant licenses are detected

## Pull Request Guidelines

### When Creating PRs

- Write clear, descriptive PR titles
- Include acceptance criteria and testing steps
- Reference related issues
- Ensure all tests pass
- Verify license compliance
- Check that security scans pass

### Code Review Standards

- All PRs require review before merging
- Address all review comments
- Keep PRs focused and small when possible
- Update documentation if behavior changes

## Additional Resources

- Project README: `/README.md`
- Security Policy: `/SECURITY.md`
- TypeScript Config: `/tsconfig.json`
- Vite Config: `/vite.config.ts`
- Vitest Config: `/vitest.config.ts`
