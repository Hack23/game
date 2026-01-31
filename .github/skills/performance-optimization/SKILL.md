---
name: performance-optimization
description: React re-render optimization, Three.js rendering performance, useMemo/useCallback patterns, bundle size reduction, and 60fps profiling
license: MIT
---

# Performance Optimization Skill

## Context
This skill applies when:
- Building features that may impact frame rate or rendering performance
- Optimizing React re-renders in game components
- Reducing Three.js draw calls and GPU overhead
- Minimizing bundle size and improving load times
- Profiling performance bottlenecks
- Implementing animations and game loops
- Handling large datasets or complex 3D scenes

## Rules

1. **Target 60 FPS**: Maintain consistent 60 frames per second (16.67ms per frame) in game rendering
2. **Minimize Re-renders**: Use React.memo, useMemo, and useCallback to prevent unnecessary component updates
3. **Use Refs for Mutations**: Never use useState for high-frequency updates (60fps) - use refs instead
4. **Batch Draw Calls**: Group similar geometries and materials to reduce Three.js draw calls
5. **Instance Repeated Objects**: Use InstancedMesh for multiple similar objects (particles, enemies, bullets)
6. **Optimize Geometry**: Use lower polygon counts and Level of Detail (LOD) for distant objects
7. **Lazy Load Assets**: Load textures, models, and sounds on-demand, not at startup
8. **Code Splitting**: Use dynamic imports to split bundle by route and feature
9. **Memoize Expensive Computations**: Cache results of complex calculations with useMemo
10. **Debounce/Throttle Events**: Limit frequency of event handlers (resize, scroll, input)
11. **Profile Before Optimizing**: Use React DevTools Profiler and Chrome DevTools before making changes
12. **Monitor Bundle Size**: Keep bundle size under 500KB (gzipped) for initial load
13. **Use Web Workers**: Offload heavy computations (physics, AI) to background threads
14. **Optimize Images**: Compress textures and use appropriate formats (WebP, basis)
15. **Tree Shake Dependencies**: Import only what you need from libraries

## Examples

### ✅ Good Pattern: Memoized Component

```typescript
import { memo, useMemo, useCallback } from 'react';
import type { FC } from 'react';

interface GameHUDProps {
  score: number;
  health: number;
  ammo: number;
  onPause: () => void;
}

/**
 * Memoized HUD component - only re-renders when props change
 * Prevents expensive re-renders during 60fps game loop
 */
export const GameHUD: FC<GameHUDProps> = memo(({ 
  score, 
  health, 
  ammo, 
  onPause 
}) => {
  // Memoize expensive color calculation
  const healthColor = useMemo(() => {
    if (health > 75) return '#00ff00';
    if (health > 25) return '#ffff00';
    return '#ff0000';
  }, [health]);
  
  // Memoize event handler to prevent child re-renders
  const handlePause = useCallback(() => {
    onPause();
  }, [onPause]);
  
  return (
    <div className="game-hud">
      <div className="score">Score: {score}</div>
      <div className="health" style={{ color: healthColor }}>
        Health: {health}%
      </div>
      <div className="ammo">Ammo: {ammo}</div>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
});

GameHUD.displayName = 'GameHUD';
```

### ✅ Good Pattern: Refs for High-Frequency Updates

```typescript
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Player component optimized for 60fps updates
 * Uses refs instead of state for position/velocity to avoid re-renders
 */
export function OptimizedPlayer(): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Store velocity in ref - no re-renders on update
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Handle keyboard input without re-renders
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key);
  }, []);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
  }, []);
  
  // Game loop - runs 60fps without triggering React re-renders
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const speed = 5;
    const velocity = velocityRef.current;
    
    // Update velocity based on input
    velocity.set(0, 0, 0);
    if (keysPressed.current.has('w')) velocity.z -= speed * delta;
    if (keysPressed.current.has('s')) velocity.z += speed * delta;
    if (keysPressed.current.has('a')) velocity.x -= speed * delta;
    if (keysPressed.current.has('d')) velocity.x += speed * delta;
    
    // Update position directly on Three.js object
    meshRef.current.position.add(velocity);
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#00ff00" />
    </mesh>
  );
}
```

### ✅ Good Pattern: Instanced Mesh for Performance

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BulletSystemProps {
  maxBullets: number;
}

/**
 * Optimized bullet system using instancing
 * Renders 1000+ bullets with single draw call
 */
export function BulletSystem({ maxBullets }: BulletSystemProps): JSX.Element {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Pre-allocate bullet data (no allocation in game loop)
  const bullets = useMemo(() => {
    return Array.from({ length: maxBullets }, () => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      lifetime: 0
    }));
  }, [maxBullets]);
  
  // Reusable objects to avoid GC pressure
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let activeCount = 0;
    
    bullets.forEach((bullet, i) => {
      if (!bullet.active) return;
      
      // Update bullet position
      bullet.position.addScaledVector(bullet.velocity, delta);
      bullet.lifetime -= delta;
      
      // Deactivate if expired
      if (bullet.lifetime <= 0) {
        bullet.active = false;
        return;
      }
      
      // Update instance matrix
      tempObject.position.copy(bullet.position);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(activeCount, tempObject.matrix);
      activeCount++;
    });
    
    // Set visible instance count
    meshRef.current.count = activeCount;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxBullets]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffff00" />
    </instancedMesh>
  );
}
```

### ✅ Good Pattern: Code Splitting

```typescript
import { lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

// Lazy load heavy game components
const GameWorld = lazy(() => import('./GameWorld'));
const GameUI = lazy(() => import('./GameUI'));
const GameAudio = lazy(() => import('./GameAudio'));

/**
 * Main game component with code splitting
 * Loads components on-demand to reduce initial bundle size
 */
export function Game(): JSX.Element {
  return (
    <div className="game-container">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas>
          <GameWorld />
        </Canvas>
        
        <GameUI />
        <GameAudio />
      </Suspense>
    </div>
  );
}

function LoadingScreen(): JSX.Element {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading game...</p>
    </div>
  );
}
```

### ✅ Good Pattern: Debounced Event Handlers

```typescript
import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing expensive operations
 * Prevents performance issues from rapid event firing
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// Usage in component
export function GameSettings(): JSX.Element {
  const saveSettings = useCallback((settings: GameSettings) => {
    // Expensive operation
    localStorage.setItem('settings', JSON.stringify(settings));
  }, []);
  
  // Debounce saves to avoid excessive localStorage writes
  const debouncedSave = useDebounce(saveSettings, 500);
  
  const handleVolumeChange = (volume: number): void => {
    debouncedSave({ volume });
  };
  
  return (
    <input 
      type="range" 
      onChange={(e) => handleVolumeChange(Number(e.target.value))}
    />
  );
}
```

### ✅ Good Pattern: Web Worker for Heavy Computation

```typescript
// pathfinding.worker.ts
self.addEventListener('message', (e: MessageEvent) => {
  const { start, end, obstacles } = e.data;
  
  // Heavy A* pathfinding computation
  const path = calculatePath(start, end, obstacles);
  
  self.postMessage({ path });
});

// Game component
import { useCallback, useEffect, useRef } from 'react';

export function usePathfinding() {
  const workerRef = useRef<Worker>();
  
  useEffect(() => {
    // Create worker on mount
    workerRef.current = new Worker(
      new URL('./pathfinding.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
  
  const findPath = useCallback((
    start: Vector3,
    end: Vector3,
    obstacles: Vector3[]
  ): Promise<Vector3[]> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve([]);
        return;
      }
      
      const handler = (e: MessageEvent) => {
        workerRef.current?.removeEventListener('message', handler);
        resolve(e.data.path);
      };
      
      workerRef.current.addEventListener('message', handler);
      workerRef.current.postMessage({ start, end, obstacles });
    });
  }, []);
  
  return { findPath };
}
```

### ❌ Bad Pattern: Unnecessary Re-renders

```typescript
// Bad: Component re-renders every frame
function BadGameHUD({ gameState }: { gameState: GameState }) {
  // Expensive computation on every render
  const healthColor = gameState.health > 50 ? '#00ff00' : '#ff0000';
  
  return (
    <div>
      <div style={{ color: healthColor }}>
        Health: {gameState.health}
      </div>
    </div>
  );
}

// This HUD will re-render 60 times per second if parent updates!
```

### ❌ Bad Pattern: useState for High-Frequency Updates

```typescript
// Bad: Triggers 60 re-renders per second
function BadPlayer() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  
  useFrame((state, delta) => {
    // DON'T DO THIS - causes 60 re-renders/second!
    setPosition(prev => ({
      x: prev.x + delta,
      y: prev.y,
      z: prev.z
    }));
  });
  
  return <mesh position={[position.x, position.y, position.z]} />;
}
```

### ❌ Bad Pattern: Not Using Instancing

```typescript
// Bad: 1000 individual meshes = 1000 draw calls
function BadBullets({ bullets }: { bullets: Bullet[] }) {
  return (
    <>
      {bullets.map((bullet, i) => (
        <mesh key={i} position={bullet.position}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
    </>
  );
}
```

### ❌ Bad Pattern: Memory Allocation in Game Loop

```typescript
// Bad: Creates new objects every frame (60 fps = GC pressure)
useFrame((state, delta) => {
  bullets.forEach(bullet => {
    // DON'T: Creating new Vector3 every frame!
    const velocity = new THREE.Vector3(0, 0, -1);
    const scaledVelocity = velocity.multiplyScalar(delta);
    bullet.position.add(scaledVelocity);
  });
});

// Good: Reuse objects
const tempVelocity = useMemo(() => new THREE.Vector3(), []);

useFrame((state, delta) => {
  bullets.forEach(bullet => {
    tempVelocity.set(0, 0, -1).multiplyScalar(delta);
    bullet.position.add(tempVelocity);
  });
});
```

### ❌ Bad Pattern: Large Bundle Without Splitting

```typescript
// Bad: Importing everything upfront
import { GameWorld } from './GameWorld';
import { GameUI } from './GameUI';
import { GameAudio } from './GameAudio';
import { GamePhysics } from './GamePhysics';
import { GameAI } from './GameAI';
// ... 50 more imports

// Result: 5MB initial bundle, slow load time
```

## References

### Performance Tools
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Three.js Stats](https://threejs.org/docs/#examples/en/libs/Stats)

### Best Practices
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Three.js Performance Tips](https://discoverthreejs.com/tips-and-tricks/)
- [Web Vitals](https://web.dev/vitals/)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

### Optimization Guides
- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)

## Remember

- **60 FPS is Critical**: Frame time must stay under 16.67ms for smooth gameplay
- **Profile First**: Use DevTools Profiler before optimizing - measure, don't guess
- **Refs for Game Loop**: Never use useState in useFrame - use refs for mutations
- **Memoize Everything**: Use memo, useMemo, useCallback to prevent re-renders
- **Instance Repeated Objects**: InstancedMesh is 10-100x faster for many similar objects
- **Batch Draw Calls**: Group similar materials/geometries to reduce GPU overhead
- **Code Split**: Lazy load routes and features to reduce initial bundle size
- **Avoid Allocations**: Reuse objects in game loop to reduce garbage collection pressure
- **Web Workers**: Offload heavy computations (pathfinding, physics) to background threads
- **Optimize Assets**: Compress textures, use LOD, lazy load resources
- **Debounce Events**: Throttle rapid events (resize, input) to prevent performance spikes
- **Monitor Bundle Size**: Keep initial bundle under 500KB gzipped
- **Test on Low-End Devices**: Profile on minimum spec hardware, not just development machines
- **React Profiler**: Use React DevTools Profiler to identify slow components
- **Three.js Stats**: Monitor FPS, draw calls, and memory in development
- **Lighthouse Scores**: Aim for 90+ Performance score in Lighthouse audits
