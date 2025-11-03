import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Trail } from "@react-three/drei";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import type { JSX } from "react";
import * as THREE from "three";
import { useGameState, type GameState } from "./hooks/useGameState";
import { useAudioManager } from "./hooks/useAudioManager";
import "./App.css";

/**
 * Generate particle positions and colors for explosion effect
 * Called once outside the component render cycle
 */
function generateParticleData(): {
  particleCount: number;
  positions: Float32Array;
  colors: Float32Array;
} {
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.3;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Mix of green and yellow colors
    colors[i3] = Math.random() > 0.5 ? 0 : 1;
    colors[i3 + 1] = 1;
    colors[i3 + 2] = Math.random() > 0.5 ? 0.5 : 0;
  }

  return { particleCount, positions, colors };
}

interface ParticleExplosionProps {
  position: [number, number, number];
  active: boolean;
}

function ParticleExplosion({ position, active }: ParticleExplosionProps): JSX.Element | null {
  const particlesRef = useRef<THREE.Points>(null);
  const [visible, setVisible] = useState(active);
  const startTimeRef = useRef(0);

  // Generate particles once using useMemo with external function
  const particleData = useMemo(() => generateParticleData(), []);

  useFrame((state) => {
    if (!active || !particlesRef.current) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const duration = 0.6;

    if (elapsed < duration) {
      const scale = 1 + elapsed * 8;
      particlesRef.current.scale.set(scale, scale, scale);
      
      const geometry = particlesRef.current.geometry;
      const positionAttr = geometry.attributes.position;
      
      if (positionAttr && positionAttr.array) {
        const positions = positionAttr.array as Float32Array;
        
        for (let i = 1; i < positions.length; i += 3) {
          const current = positions[i];
          if (current !== undefined) {
            positions[i] = current + 0.02; // particles rise up (Y coordinate)
          }
        }
        positionAttr.needsUpdate = true;
      }
      
      const opacity = 1 - elapsed / duration;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    } else {
      setVisible(false);
      startTimeRef.current = 0;
    }
  });

  if (!visible && !active) return null;

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface TargetSphereProps {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
  size: number;
}

function TargetSphere({ position, onClick, isActive, size }: TargetSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  // Enhanced rotation and pulse animation
  useFrame((state) => {
    if (!isActive || !meshRef.current) return;
    
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.x += 0.01;
    
    // Animate rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.015;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z -= 0.02;
    }
    
    // Pulsing effect for hover state
    if (hovered) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      setPulseScale(pulse);
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isActive) {
      onClick();
    }
  }, [isActive, onClick]);

  const handlePointerOver = useCallback(() => {
    if (isActive) {
      setHovered(true);
      document.body.style.cursor = 'crosshair';
    }
  }, [isActive]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  return (
    <group position={position}>
      <Trail
        width={hovered ? 5 : 3}
        length={hovered ? 8 : 6}
        color={isActive ? (hovered ? "#00ffff" : "#00ff88") : "#666666"}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={isActive ? (hovered ? 1.4 * pulseScale : 1) : 0.6}
          data-testid="target-sphere"
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? (hovered ? "#00ffff" : "#00cc66") : "#666666"}
            emissive={isActive ? (hovered ? "#00ffff" : "#00ff88") : "#333333"}
            emissiveIntensity={hovered ? 1.2 : 0.6}
            metalness={0.7}
            roughness={0.1}
          />
          {/* Animated outer ring for target effect */}
          <mesh ref={outerRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.8, 0.03, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? (hovered ? "#ffff00" : "#ffffff") : "#999999"}
              transparent
              opacity={hovered ? 1.0 : 0.8}
              emissive={hovered ? "#ffff00" : "#ffffff"}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
          {/* Animated middle ring */}
          <mesh ref={middleRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.5, 0.03, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? (hovered ? "#ffff00" : "#ffffff") : "#999999"}
              transparent
              opacity={hovered ? 1.0 : 0.8}
              emissive={hovered ? "#ffff00" : "#ffffff"}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
          {/* Center dot for precise aiming */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[size * 0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={hovered ? 2.0 : 1.0}
            />
          </mesh>
        </mesh>
      </Trail>
      
      {/* Invisible larger hit area for easier clicking */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <sphereGeometry args={[size * 2.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Enhanced sparkle effect around target */}
      {isActive && (
        <Sparkles
          count={hovered ? 40 : 25}
          scale={size * (hovered ? 4 : 3)}
          size={hovered ? 3 : 2}
          speed={hovered ? 0.6 : 0.4}
          color={hovered ? "#ffff00" : "#00ff88"}
        />
      )}
      
      {/* Outer glow ring when hovered */}
      {isActive && hovered && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[size * 1.5, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#ffff00"
            transparent
            opacity={0.6}
            emissive="#ffff00"
            emissiveIntensity={1.5}
          />
        </mesh>
      )}
    </group>
  );
}

function BackgroundParticles(): JSX.Element {
  return (
    <Sparkles
      count={100}
      scale={15}
      size={1}
      speed={0.2}
      opacity={0.3}
      color="#646cff"
    />
  );
}

interface GameSceneProps {
  gameState: GameState;
  onTargetClick: () => void;
  showExplosion: boolean;
  explosionPosition: [number, number, number];
}

function GameScene({ gameState, onTargetClick, showExplosion, explosionPosition }: GameSceneProps): JSX.Element {
  const shakeTimeRef = useRef(0);
  const basePositionRef = useRef(new THREE.Vector3(0, 2, 8));

  const handleTargetClick = useCallback(() => {
    if (!gameState.isPlaying || gameState.timeLeft <= 0) return;
    onTargetClick();
    shakeTimeRef.current = 0.3; // Shake for 300ms
  }, [gameState.isPlaying, gameState.timeLeft, onTargetClick]);

  // Camera shake effect using useThree
  useFrame((state, delta) => {
    const camera = state.camera;
    
    if (shakeTimeRef.current > 0) {
      shakeTimeRef.current -= delta;
      const intensity = shakeTimeRef.current * 0.3;
      camera.position.x = basePositionRef.current.x + (Math.random() - 0.5) * intensity;
      camera.position.y = basePositionRef.current.y + (Math.random() - 0.5) * intensity;
      camera.position.z = basePositionRef.current.z + (Math.random() - 0.5) * intensity;
    } else if (shakeTimeRef.current <= 0) {
      camera.position.lerp(basePositionRef.current, 0.1);
    }
  });

  const isGameOver = gameState.timeLeft <= 0;

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.7} color="#646cff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        castShadow
        color="#00ff88"
      />

      {/* Background particles */}
      <BackgroundParticles />

      {/* Particle explosion effect */}
      {showExplosion && (
        <ParticleExplosion position={explosionPosition} active={showExplosion} />
      )}

      {/* Target Sphere */}
      <TargetSphere
        position={[gameState.playerX, gameState.playerY, gameState.playerZ]}
        onClick={handleTargetClick}
        isActive={gameState.isPlaying && !isGameOver}
        size={gameState.targetSize}
      />

      {/* Improved Grid floor with glow */}
      <gridHelper args={[10, 10, "#30363d", "#21262d"]} position={[0, -2, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0d1117" opacity={0.8} transparent />
      </mesh>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function App(): JSX.Element {
  const { gameState, incrementScore, resetGame, togglePause } = useGameState();
  const audioManager = useAudioManager();
  const [isMuted, setIsMuted] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState<[number, number, number]>([0, 0, 0]);
  const prevLevelRef = useRef(gameState.level);
  const prevComboRef = useRef(gameState.combo);

  // Play background music when game starts
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0 && !isMuted) {
      audioManager.startBackgroundMusic();
    } else {
      audioManager.stopBackgroundMusic();
    }

    return (): void => {
      audioManager.stopBackgroundMusic();
    };
  }, [gameState.isPlaying, gameState.timeLeft, isMuted, audioManager]);

  // Play game over sound
  useEffect(() => {
    if (gameState.timeLeft === 0 && !isMuted) {
      audioManager.playGameOverSound();
    }
  }, [gameState.timeLeft, isMuted, audioManager]);

  // Play level up sound
  useEffect(() => {
    if (gameState.level > prevLevelRef.current && !isMuted) {
      audioManager.playLevelUpSound();
    }
    prevLevelRef.current = gameState.level;
  }, [gameState.level, isMuted, audioManager]);

  // Play combo sound (on every 5th combo)
  useEffect(() => {
    if (gameState.combo > 0 && gameState.combo % 5 === 0 && gameState.combo !== prevComboRef.current && !isMuted) {
      audioManager.playComboSound();
    }
    prevComboRef.current = gameState.combo;
  }, [gameState.combo, isMuted, audioManager]);

  const handleTargetClick = useCallback(() => {
    // Trigger explosion effect
    setExplosionPosition([gameState.playerX, gameState.playerY, gameState.playerZ]);
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 600);
    
    incrementScore();
    if (!isMuted) {
      audioManager.playHitSound();
    }
  }, [incrementScore, isMuted, audioManager, gameState.playerX, gameState.playerY, gameState.playerZ]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioManager.setMuted(newMuted);
  }, [isMuted, audioManager]);

  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">🎯 Target Shooter</h1>
      
      {/* HUD Overlay for testing - outside canvas */}
      <div style={{ position: "absolute", top: "60px", left: "20px", zIndex: 10, display: "flex", gap: "20px" }}>
        <div data-testid="timer-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>TIME</div>
          <div style={{ color: gameState.timeLeft <= 10 ? "#ff4444" : "#00ff88", fontSize: "24px", fontWeight: "bold" }}>{gameState.timeLeft}s</div>
        </div>
        
        <div data-testid="score-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div data-testid="score-label" style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>SCORE</div>
          <div data-testid="score-value" style={{ color: "#00ff88", fontSize: "24px", fontWeight: "bold" }}>{gameState.score}</div>
          {gameState.combo > 0 && <div style={{ color: "#ffa500", fontSize: "12px" }}>🔥 COMBO x{gameState.combo}</div>}
        </div>
        
        <div data-testid="level-display" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "10px 20px", borderRadius: "8px", backdropFilter: "blur(10px)" }}>
          <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>LEVEL</div>
          <div style={{ color: "#646cff", fontSize: "24px", fontWeight: "bold" }}>{gameState.level}</div>
          {gameState.highScore > 0 && <div style={{ color: "#ffa500", fontSize: "10px" }}>HIGH: {gameState.highScore}</div>}
        </div>
      </div>
      
      {/* Game Status and Controls */}
      <div style={{ position: "absolute", top: "60px", right: "20px", zIndex: 10, display: "flex", gap: "10px", alignItems: "center" }}>
        <div data-testid="game-status" style={{ background: "rgba(33, 38, 45, 0.7)", padding: "8px 16px", borderRadius: "8px", backdropFilter: "blur(10px)", color: gameState.isPlaying && gameState.timeLeft > 0 ? "#00ff88" : "#ffa500", fontSize: "14px", fontWeight: "bold" }}>
          {gameState.timeLeft <= 0 ? "⏱️ Time's Up!" : gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
        </div>
        <button
          onClick={togglePause}
          data-testid="pause-button"
          disabled={gameState.timeLeft <= 0}
          style={{
            background: gameState.timeLeft <= 0 ? "#666666" : gameState.isPlaying ? "#ff6b35" : "#00c851",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: gameState.timeLeft <= 0 ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {gameState.isPlaying ? "⏸️ Pause" : "▶️ Resume"}
        </button>
        <button
          onClick={resetGame}
          data-testid="reset-button"
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          🔄 Reset
        </button>
        <button
          onClick={handleMuteToggle}
          data-testid="mute-button"
          style={{
            background: isMuted ? "#666666" : "#10b981",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>
      
      {/* Instructions */}
      <div data-testid="instructions-text" style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "rgba(33, 38, 45, 0.7)", padding: "12px 20px", borderRadius: "12px", backdropFilter: "blur(10px)", color: gameState.isPlaying && gameState.timeLeft > 0 ? "#ffffff" : "#7d8590", fontSize: "16px", textAlign: "center" }}>
        {gameState.timeLeft <= 0
          ? `🎮 Game Over! Final Score: ${gameState.score} - Click Reset to play again`
          : gameState.isPlaying
          ? "🎯 Click the target to score! Build combos for bonus points!"
          : "⏸️ Game paused - Resume to continue"}
      </div>
      
      {/* Pause overlay */}
      {!gameState.isPlaying && gameState.timeLeft > 0 && (
        <div data-testid="pause-overlay" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20, background: "rgba(0, 0, 0, 0.85)", padding: "40px 60px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(20px)", border: "2px solid rgba(100, 108, 255, 0.5)" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏸️</div>
          <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}>GAME PAUSED</div>
        </div>
      )}
      
      {/* Game Over overlay */}
      {gameState.timeLeft <= 0 && (
        <div data-testid="gameover-overlay" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20, background: "rgba(0, 0, 0, 0.85)", padding: "40px 60px", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(20px)", border: "2px solid rgba(255, 68, 68, 0.5)" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎮</div>
          <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>GAME OVER</div>
          <div style={{ color: "#00ff88", fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>{gameState.score}</div>
          <div style={{ color: "#7d8590", fontSize: "16px" }}>
            {gameState.isNewHighScore && gameState.score > 0
              ? "🏆 New High Score!"
              : `High Score: ${gameState.highScore}`}
          </div>
        </div>
      )}
      
      <div
        data-testid="threejs-canvas-container"
        style={{ width: "100%", height: "600px" }}
      >
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)" }}
          data-testid="threejs-canvas"
          shadows
        >
          <GameScene 
            gameState={gameState}
            onTargetClick={handleTargetClick}
            showExplosion={showExplosion}
            explosionPosition={explosionPosition}
          />
        </Canvas>
      </div>
      <p className="instructions" data-testid="app-instructions">
        An immersive 3D target shooting game with combos, levels, and time pressure!
      </p>
    </div>
  );
}

export default App;
