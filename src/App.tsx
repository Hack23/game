import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Sparkles, Trail } from "@react-three/drei";
import { useRef, useState, useCallback } from "react";
import type { JSX } from "react";
import * as THREE from "three";
import { useGameState } from "./hooks/useGameState";
import "./App.css";

interface TargetSphereProps {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
  size: number;
}

function TargetSphere({ position, onClick, isActive, size }: TargetSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate target - rotate and float (only when active)
  useFrame((state) => {
    if (!isActive || !meshRef.current) return;
    
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isActive) {
      onClick();
    }
  }, [isActive, onClick]);

  return (
    <group position={position}>
      <Trail
        width={3}
        length={6}
        color={isActive ? "#00ff88" : "#666666"}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => isActive && setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isActive ? (hovered ? 1.3 : 1) : 0.6}
          data-testid="target-sphere"
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? (hovered ? "#00ff88" : "#00cc66") : "#666666"}
            emissive={isActive ? "#00ff88" : "#333333"}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.5}
            roughness={0.2}
          />
          {/* Animated rings for target effect */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.7, 0.02, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? "#ffffff" : "#999999"}
              transparent
              opacity={0.8}
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.4, 0.02, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? "#ffffff" : "#999999"}
              transparent
              opacity={0.8}
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </mesh>
        </mesh>
      </Trail>
      {/* Sparkle effect around target */}
      {isActive && (
        <Sparkles
          count={20}
          scale={size * 3}
          size={2}
          speed={0.4}
          color="#00ff88"
        />
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

function GameScene(): JSX.Element {
  const { gameState, incrementScore, resetGame, togglePause } = useGameState();

  const handleTargetClick = useCallback(() => {
    if (!gameState.isPlaying || gameState.timeLeft <= 0) return;
    incrementScore();
  }, [gameState.isPlaying, gameState.timeLeft, incrementScore]);

  const isGameOver = gameState.timeLeft <= 0;
  const timeColor = gameState.timeLeft <= 10 ? "#ff4444" : "#00ff88";

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#646cff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        castShadow
        color="#00ff88"
      />

      {/* Background particles */}
      <BackgroundParticles />

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

      {/* Score Display with glassmorphism */}
      <Html
        position={[0, 3.5, 0]}
        center
        distanceFactor={8}
        data-testid="score-display"
      >
        <div
          style={{
            background: "rgba(33, 38, 45, 0.7)",
            padding: "20px 40px",
            borderRadius: "20px",
            textAlign: "center",
            minWidth: "200px",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(100, 108, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              color: "#7d8590",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
              letterSpacing: "2px",
            }}
            data-testid="score-label"
          >
            SCORE
          </div>
          <div
            style={{
              color: "#00ff88",
              fontSize: "56px",
              fontWeight: "bold",
              textShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
            }}
            data-testid="score-value"
            data-score={gameState.score.toString()}
          >
            {gameState.score}
          </div>
          {gameState.combo > 0 && (
            <div
              style={{
                color: "#ffa500",
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "8px",
                animation: "pulse 0.5s ease-in-out",
              }}
            >
              🔥 COMBO x{gameState.combo}
            </div>
          )}
        </div>
      </Html>

      {/* Timer Display */}
      <Html
        position={[-4, 3.5, 0]}
        distanceFactor={10}
        data-testid="timer-display"
      >
        <div
          style={{
            background: "rgba(33, 38, 45, 0.7)",
            padding: "12px 24px",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(100, 108, 255, 0.3)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              color: "#7d8590",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
              letterSpacing: "1px",
            }}
          >
            TIME
          </div>
          <div
            style={{
              color: timeColor,
              fontSize: "32px",
              fontWeight: "bold",
              textShadow: `0 0 10px ${timeColor}`,
            }}
          >
            {gameState.timeLeft}s
          </div>
        </div>
      </Html>

      {/* Level & High Score Display */}
      <Html
        position={[4, 3.5, 0]}
        distanceFactor={10}
        data-testid="level-display"
      >
        <div
          style={{
            background: "rgba(33, 38, 45, 0.7)",
            padding: "12px 24px",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(100, 108, 255, 0.3)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              color: "#7d8590",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
              letterSpacing: "1px",
            }}
          >
            LEVEL
          </div>
          <div
            style={{
              color: "#646cff",
              fontSize: "32px",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(100, 108, 255, 0.5)",
            }}
          >
            {gameState.level}
          </div>
          {gameState.highScore > 0 && (
            <div
              style={{
                color: "#ffa500",
                fontSize: "10px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              HIGH: {gameState.highScore}
            </div>
          )}
        </div>
      </Html>

      {/* Status indicator */}
      <Html
        position={[-4, 2.5, 0]}
        distanceFactor={10}
        data-testid="game-status-container"
      >
        <div
          style={{
            color: gameState.isPlaying && !isGameOver ? "#00ff88" : "#ffa500",
            fontSize: "14px",
            fontWeight: "bold",
            background: "rgba(33, 38, 45, 0.7)",
            padding: "8px 16px",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(100, 108, 255, 0.3)",
          }}
          data-testid="game-status"
        >
          {isGameOver ? "⏱️ Time's Up!" : gameState.isPlaying ? "🎯 Active" : "⏸️ Paused"}
        </div>
      </Html>

      {/* Instructions */}
      <Html
        position={[0, -3, 0]}
        center
        distanceFactor={10}
        data-testid="instructions"
      >
        <div
          style={{
            color: gameState.isPlaying && !isGameOver ? "#ffffff" : "#7d8590",
            fontSize: "16px",
            background: "rgba(33, 38, 45, 0.7)",
            padding: "12px 20px",
            borderRadius: "12px",
            textAlign: "center",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(100, 108, 255, 0.3)",
          }}
          data-testid="instructions-text"
        >
          {isGameOver
            ? `🎮 Game Over! Final Score: ${gameState.score} - Click Reset to play again`
            : gameState.isPlaying
            ? "🎯 Click the target to score! Build combos for bonus points!"
            : "⏸️ Game paused - Resume to continue"}
        </div>
      </Html>

      {/* Control buttons */}
      <Html
        position={[4, 2.5, 0]}
        distanceFactor={10}
        data-testid="controls-container"
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={togglePause}
            data-testid="pause-button"
            disabled={isGameOver}
            style={{
              background: isGameOver ? "#666666" : gameState.isPlaying ? "#ff6b35" : "#00c851",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: isGameOver ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
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
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            🔄 Reset
          </button>
        </div>
      </Html>

      {/* Pause overlay */}
      {!gameState.isPlaying && !isGameOver && (
        <Html position={[0, 0, 0]} center distanceFactor={5}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              padding: "40px 60px",
              borderRadius: "20px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(100, 108, 255, 0.5)",
            }}
            data-testid="pause-overlay"
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏸️</div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              data-testid="pause-title"
            >
              GAME PAUSED
            </div>
          </div>
        </Html>
      )}

      {/* Game Over overlay */}
      {isGameOver && (
        <Html position={[0, 0, 0]} center distanceFactor={5}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              padding: "40px 60px",
              borderRadius: "20px",
              textAlign: "center",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 68, 68, 0.5)",
            }}
            data-testid="gameover-overlay"
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎮</div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              GAME OVER
            </div>
            <div
              style={{
                color: "#00ff88",
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {gameState.score}
            </div>
            <div style={{ color: "#7d8590", fontSize: "16px" }}>
              {gameState.isNewHighScore && gameState.score > 0
                ? "🏆 New High Score!"
                : `High Score: ${gameState.highScore}`}
            </div>
          </div>
        </Html>
      )}

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
  return (
    <div className="app-container" data-testid="app-container">
      <h1 data-testid="app-title">🎯 Target Shooter</h1>
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
          <GameScene />
        </Canvas>
      </div>
      <p className="instructions" data-testid="app-instructions">
        An immersive 3D target shooting game with combos, levels, and time pressure!
      </p>
    </div>
  );
}

export default App;
