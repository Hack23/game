# Copilot Instructions

## Coding Guidelines

- **Strict Typing:**
  - _Use explicit types and interfaces; avoid `any` (use `unknown` if needed)_.
  - _Leverage utility types (Pick, Omit, Partial) and always define return types_.
  - _Enable TypeScript's strict options in `tsconfig.json` (e.g., `strictNullChecks`, `noImplicitAny`)_.

## Testing Guidelines

- **Vite & Vitest Integration:**
  - Configure Vite and Vitest for fast feedback and native ESM support.
  - Separate unit and integration tests, leveraging Vite's watch mode and coverage tools.
  - Mock external dependencies using existing helpers with proper TypeScript typings.
- **Quality Standards:**
  - Aim for a minimum of 80% code coverage.
  - Write tests for critical business logic and security paths.

## Summary

Focus on stability, strict TypeScript usage, and Vite-enhanced testing while reusing existing code.

## PixiJS with React Guidelines

- **Leverage `@pixi/react` Components:**
  - Utilize components like `Stage`, `Container`, `Sprite`, `Graphics`, `Text` from `@pixi/react` for declarative scene graph construction.
  - Refer to the official `@pixi/react` documentation: https://react.pixijs.io/getting-started/
- **Extend PixiJS Objects:**
  - Use the `extend` function from `@pixi/react` to make PixiJS display objects (e.g., `Graphics`, `Sprite`) available as React components.
  - Example: `extend({ Graphics, Sprite });`
- **Component-Based Architecture:**
  - Structure your game elements as reusable React components.
  - Manage state within components using React hooks (`useState`, `useReducer`).
  - Encapsulate PixiJS drawing logic within these components, often using `useCallback` for draw functions passed to `<pixiGraphics />`.
- **Game Loop and State Updates:**
  - Use the `useTick` hook from `@pixi/react` for logic that needs to run every frame (e.g., animations, physics).
  - Manage game state with React's state management (e.g., `useState`, `useContext`, or external libraries like Zustand/Redux if complexity grows).
  - Ensure state updates correctly trigger re-renders of PixiJS components.
- **PixiJS Core API:**
  - For advanced features or direct manipulation not covered by `@pixi/react` abstractions, you can still access the core PixiJS API.
  - Refer to the PixiJS API documentation: https://pixijs.download/release/docs/index.html
- **Event Handling:**
  - Use `@pixi/react`'s event props (e.g., `onClick`, `onPointerDown`) on Pixi components, similar to DOM event handling in React.
  - Ensure `interactive={true}` is set on components that need to respond to pointer events.
- **Strict Typing with PixiJS:**
  - When interacting with PixiJS objects directly or defining props for Pixi-React components, use precise TypeScript types provided by `pixi.js` and `@pixi/react`.
  - For instance, when using `Graphics`, type the draw callback parameter explicitly: `draw={(g: PIXI.Graphics) => { ... }}`.

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

https://react.pixijs.io/getting-started/
https://pixijs.download/release/docs/index.html
