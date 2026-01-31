---
name: react-threejs-game
description: Three.js game development with React using @react-three/fiber and @react-three/drei with strict TypeScript and 60fps performance
license: MIT
---

# react-threejs-game Skill

## Context
This skill applies when:
- Building 3D game scenes and components
- Implementing game loops and animations
- Handling 3D object interactions and physics
- Optimizing Three.js rendering performance
- Creating reusable 3D game components
- Managing game state with React patterns

## Rules

1. **Use Declarative Components**: Always use `@react-three/fiber` declarative syntax instead of imperative Three.js API
2. **Type Everything**: Use explicit TypeScript types for all Three.js objects, refs, and component props
3. **Leverage `useFrame` for Game Loop**: Implement frame-by-frame logic (animations, physics, AI) in `useFrame` hook
4. **Use Refs for Three.js Objects**: Access underlying Three.js objects via `useRef<THREE.Mesh>`, never mutate props directly
5. **Optimize Re-renders**: Minimize React re-renders by keeping game state updates in `useFrame` when possible
6. **Use Drei Helpers**: Leverage `@react-three/drei` pre-built components (OrbitControls, useTexture, Html) instead of custom implementations
7. **Event Handling**: Use built-in event props (`onClick`, `onPointerOver`) instead of manual raycasting
8. **Dispose Resources**: Clean up geometries, materials, and textures on component unmount to prevent memory leaks
9. **Instancing for Performance**: Use `InstancedMesh` for many similar objects (particles, enemies, bullets)
10. **Target 60 FPS**: Profile with React DevTools and Three.js stats - keep frame time under 16ms
11. **Separate Concerns**: Game logic in hooks, rendering in JSX, state in React state or Zustand
12. **Use LOD (Level of Detail)**: Reduce polygon count for distant objects to maintain performance
13. **Batch Draw Calls**: Minimize state changes and draw calls by grouping similar materials and geometries
14. **Avoid useState in useFrame**: Use refs or external state management for high-frequency updates
15. **Test 3D Components**: Write unit tests for game logic and E2E tests for user interactions

## Examples

### ✅ Good Pattern: Typed 3D Component with Game Logic

```typescript
import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  initialPosition: [number, number, number];
  speed: number;
  onCollision?: (object: THREE.Object3D) => void;
}

export function Player({ 
  initialPosition, 
  speed,
  onCollision 
}: PlayerProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [health, setHealth] = useState<number>(100);
  
  // Game loop - runs every frame (~60fps)
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Update position based on velocity
    meshRef.current.position.addScaledVector(velocityRef.current, delta * speed);
    
    // Boundary check
    if (meshRef.current.position.x > 10) {
      meshRef.current.position.x = 10;
      velocityRef.current.x = 0;
    }
  });
  
  const handleClick = useCallback(() => {
    console.log('Player clicked', { health });
  }, [health]);
  
  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={health > 50 ? '#00ff00' : '#ff0000'}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}
```

### ✅ Good Pattern: Instancing for Performance

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count: number;
}

export function ParticleSystem({ count }: ParticleSystemProps): JSX.Element {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Pre-compute positions once
  const particles = useMemo(() => {
    const temp: Array<{ position: THREE.Vector3; velocity: THREE.Vector3 }> = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        ),
        velocity: new THREE.Vector3(
          Math.random() * 0.1 - 0.05,
          Math.random() * 0.1 - 0.05,
          Math.random() * 0.1 - 0.05
        )
      });
    }
    return temp;
  }, [count]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const matrix = new THREE.Matrix4();
    
    particles.forEach((particle, i) => {
      // Update position
      particle.position.add(particle.velocity);
      
      // Reset if out of bounds
      if (Math.abs(particle.position.x) > 5) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > 5) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 5) particle.velocity.z *= -1;
      
      // Update instance matrix
      matrix.setPosition(particle.position);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
}
```

### ✅ Good Pattern: Drei Helpers and Controls

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

export function GameScene(): JSX.Element {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 10], fov: 60 }}
      gl={{ 
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Environment map for reflections */}
      <Environment preset="sunset" />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
      
      {/* Game objects */}
      <Player initialPosition={[0, 0, 0]} speed={5} />
      <Ground />
      
      {/* HTML overlay */}
      <Html position={[0, 3, 0]} center>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '10px' }}>
          Player HUD
        </div>
      </Html>
    </Canvas>
  );
}

function Ground(): JSX.Element {
  const texture = useTexture('/assets/textures/ground.jpg');
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.8}
      />
    </mesh>
  );
}
```

### ✅ Good Pattern: Event Handling

```typescript
import { useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';

interface InteractiveBoxProps {
  position: [number, number, number];
}

export function InteractiveBox({ position }: InteractiveBoxProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  
  const handleClick = (event: ThreeEvent<MouseEvent>): void => {
    event.stopPropagation();
    setClicked(!clicked);
    console.log('Clicked at', event.point);
  };
  
  const handlePointerOver = (event: ThreeEvent<PointerEvent>): void => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (): void => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  
  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={clicked ? '#ff00ff' : '#00ff00'}
        emissive={hovered ? '#ffff00' : '#000000'}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
```

### ❌ Bad Pattern: Imperative Three.js API

```typescript
// Bad: Using imperative Three.js API instead of declarative @react-three/fiber
function BadPlayer() {
  useEffect(() => {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh); // Don't do this!
    
    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, []);
  
  return null;
}
```

### ❌ Bad Pattern: No TypeScript Types

```typescript
// Bad: Missing types, using 'any'
function BadComponent({ position, speed }: any) {
  const meshRef = useRef(null); // Should be useRef<THREE.Mesh>(null)
  const velocity = useRef(new THREE.Vector3()); // No type
  
  useFrame((state, delta) => {
    // No type safety
    meshRef.current.position.x += velocity.current.x * delta;
  });
  
  return <mesh ref={meshRef} />;
}
```

### ❌ Bad Pattern: useState in High-Frequency Updates

```typescript
// Bad: Using useState for per-frame position updates
function BadPlayer() {
  const [position, setPosition] = useState([0, 0, 0]); // Schedules React updates every frame
  
  useFrame((state, delta) => {
    // Triggers high-frequency state updates: inefficient and conceptually wrong for game loops
    // where you should mutate Three.js objects directly via refs instead of React state
    setPosition(prev => [prev[0] + delta, prev[1], prev[2]]); // Performance killer!
  });
  
  return (
    <mesh position={position}>
      <sphereGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### ❌ Bad Pattern: Manual Raycasting

```typescript
// Bad: Manual raycasting when built-in events exist
function BadClickHandler() {
  useFrame(({ camera, mouse, scene }) => {
    const raycaster = new THREE.Raycaster(); // Created every frame!
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    // Complex click detection...
  });
  
  // Should use onClick event instead!
}
```

### ❌ Bad Pattern: Memory Leaks

```typescript
// Bad: Not disposing resources
function BadTexturedBox() {
  const texture = new THREE.TextureLoader().load('/texture.jpg'); // Never disposed!
  
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} /> {/* Memory leak */}
    </mesh>
  );
}
```

## References

### Documentation
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

### Performance
- [React Three Fiber Performance Tips](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
- [Three.js Performance Best Practices](https://discoverthreejs.com/tips-and-tricks/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)

### Learning Resources
- [Three.js Journey](https://threejs-journey.com/)
- [Discover Three.js](https://discoverthreejs.com/)
- [Poimandres Examples](https://codesandbox.io/examples/package/@react-three/fiber)

## Remember

- **Declarative over Imperative**: Use JSX and React patterns, not raw Three.js API
- **Type Safety**: Strict TypeScript prevents runtime errors in 3D math and object manipulation
- **Performance First**: Profile early, target 60 FPS, optimize re-renders and draw calls
- **useFrame for Game Logic**: Put frame-by-frame updates in `useFrame`, not `useEffect`
- **Refs for Mutations**: Use refs for Three.js object mutations, not state
- **Drei for Common Tasks**: Don't reinvent the wheel - use Drei helpers and controls
- **Instance When Possible**: Many similar objects should use `InstancedMesh`
- **Dispose Resources**: Prevent memory leaks by cleaning up geometries, materials, textures
- **Event System**: Use built-in event props instead of manual raycasting
- **Test 3D Components**: Unit test game logic, E2E test user interactions
- **LOD for Scale**: Use Level of Detail to maintain performance with complex scenes
- **Batch Draw Calls**: Group similar materials and geometries to reduce draw calls
- **Mobile Considerations**: Test on low-end devices, reduce polygon counts, simplify shaders
- **Debug Tools**: Use React DevTools Profiler and Three.js Stats for performance monitoring
- **Documentation**: Document 3D coordinate systems, game mechanics, and optimization strategies
